//import { equivalenciasBrailleIntegral, contarCaracteresBrailleIntegral } from './equivalenciasBraille.js';
//import { equivalenciasBrailleComputerizado, contarCaracteresBrailleComputerizado } from './equivalenciasBraille.js'; 

let contenidoOriginal = '';
let contenidoFiltrado = false;
let configuracion = {};

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {

    if (request.action === "filtrarContenido") {
      filtrarContenido();
    }

    if (request.action === "restaurarContenidoOriginal") {
      restaurarContenidoOriginal();
    }
    /*
    if (request.action === "filtrarContenidoSinModificar") {
      filtrarContenidoSinModificar();
    }*/

    if (request.action === "filtrarPorConsola") {
      // Obtiene el texto del cuerpo del documento
      const texto = document.body.innerText;

      // Llama a la función dividirLineas
      dividirLineas(texto).then(lineasDivididas => {
        // Muestra cada línea dividida en la consola del navegador
        lineasDivididas.forEach(linea => console.log(linea));
      });
    }

    if (request.action === 'guardarConfiguracion') {
      // Recoge los valores del formulario
      let longitudMaxima = parseInt(request.longitud);
      const infoAdicional = request.infoAdicional;
      const brailleComputerizado = request.brailleComputerizado;
      const brailleIntegral = request.brailleIntegral;

      // Si se marcó la casilla de incluir 5 caracteres de información adicional, resta 5 a longitudMaxima
      if (infoAdicional) {
        longitudMaxima -= 5;
      }

      // Guarda la configuración en el almacenamiento de Chrome
      chrome.storage.sync.set({
        longitudMaxima: longitudMaxima,
        brailleComputerizado: brailleComputerizado,
        brailleIntegral: brailleIntegral
      });

      // Mostramos la configuración en la consola
      console.log('Configuración guardada');
      console.log('Longitud máxima de línea: ' + longitudMaxima);
      console.log('Información adicional activada: ' + infoAdicional);
      console.log('Contar en braille computerizado: ' + brailleComputerizado);
      console.log('Contar en braille integral: ' + brailleIntegral);
      }
  }
);

function dividirLineas(texto) {
  return new Promise((resolve, reject) => {
    // Obtiene la configuración del almacenamiento de Chrome
    chrome.storage.sync.get(['longitudMaxima', 'brailleComputerizado', 'brailleIntegral'], function(configuracion) {

      let lineas = [];
      const bloques = texto.split('\n'); // Divide el texto en bloques por nueva línea

      bloques.forEach((bloque) => {
        const palabras = bloque.split(' ');
        let lineaActual = '';
        let contadorLineaActual = 0;

        palabras.forEach((palabra) => {
          let longitudPalabra = configuracion.brailleComputerizado ? contarCaracteresBrailleComputerizado(palabra) : contarCaracteresBrailleIntegral(palabra);
          if (contadorLineaActual + longitudPalabra <= configuracion.longitudMaxima) {
            lineaActual += palabra + ' ';
            contadorLineaActual += longitudPalabra + 1; // +1 para el espacio
          } else {
            lineas.push(lineaActual.trim());
            lineaActual = palabra + ' ';
            contadorLineaActual = longitudPalabra + 1; // +1 para el espacio
          }
        });

        if (lineaActual !== '') {
          lineas.push(lineaActual.trim());
        }
      });

      resolve(lineas);
    });
  });
}

async function filtrarElemento(elemento) {
  if (elemento.nodeType === Node.TEXT_NODE) {
      // Si el elemento es un nodo de texto, filtramos su contenido
      const texto = elemento.nodeValue;
      const lineasFiltradas = await dividirLineas(texto); // Filtramos el texto según la longitud máxima
      elemento.nodeValue = lineasFiltradas.join('\n'); // Actualizamos el contenido del nodo de texto
  } else {
      // Si el elemento es un nodo de elemento (HTML), recursivamente filtramos sus nodos hijos
      for (let i = 0; i < elemento.childNodes.length; i++) {
          await filtrarElemento(elemento.childNodes[i]);
      }
  }
}

async function filtrarContenido() {

  // Guardar el contenido original de la página
  if (!contenidoOriginal) {
    contenidoOriginal = document.body.innerHTML;
  }
  // Obtiene todo el texto del cuerpo del documento
  let texto = document.body.innerText;

  
  await filtrarElemento(document.body);

  //filtrarElemento(document.body);
  //agregarEtiquetasInteractivas(document.body);
}

function restaurarContenidoOriginal(){

  if (contenidoOriginal) {
    document.body.innerText = contenidoOriginal;
  }
  contenidoOriginal = '';
}
/*
function filtrarContenidoSinModificar() {

  if (!contenidoOriginal) { 
    contenidoOriginal = document.body.innerHTML;
  }

  filtrarElemento(document.body);
}*/



/* Solo si no esta confugarada la linea con los 5 caracteres adicionales de info adicional podriamos añadir nosotros
las etiquetas y ocupar los 5 caracteres primeros para ello */
/*
function agregarEtiquetasInteractivas(elemento) {
  if (elemento.nodeType === Node.ELEMENT_NODE) {
    if (elemento.tagName === 'A') {
      // Etiquetar los enlaces
      elemento.setAttribute('data-braille', 'enlace');
    } else if (elemento.tagName === 'BUTTON') {
      // Etiquetar los botones
      elemento.setAttribute('data-braille', 'botón');
    } else if (elemento.tagName === 'IMG') {
      // Etiquetar las imágenes
      elemento.setAttribute('data-braille', 'imagen');
    }
    for (let i = 0; i < elemento.childNodes.length; i++) {
      agregarEtiquetasInteractivas(elemento.childNodes[i]);
    }
  }
}*/

// Equivalencias de caracteres mas comunes en Braille integral (Braille de seis puntos en castellano)

const equivalenciasBrailleIntegral = {
  ' ': 1, 'a': 1, 'b': 1, 'c': 1, 'd': 1, 'e': 1, 'f': 1, 'g': 1, 'h': 1, 'i': 1, 'j': 1,
  'k': 1, 'l': 1, 'm': 1, 'n': 1, 'o': 1, 'p': 1, 'q': 1, 'r': 1, 's': 1, 't': 1,
  'u': 1, 'v': 1, 'w': 1, 'x': 1, 'y': 1, 'z': 1, 'á': 1, 'é': 1, 'í': 1, 'ó': 1, 
  'ú': 1, 'ü': 1, 'ñ': 1, 

  'A': 2, 'B': 2, 'C': 2, 'D': 2, 'E': 2, 'F': 2, 'G': 2, 'H': 2, 'I': 2, 'J': 2,
  'K': 2, 'L': 2, 'M': 2, 'N': 2, 'O': 2, 'P': 2, 'Q': 2, 'R': 2, 'S': 2, 'T': 2,
  'U': 2, 'V': 2, 'W': 2, 'X': 2, 'Y': 2, 'Z': 2, 'Á': 2, 'É': 2, 'Í': 2, 'Ó': 2, 
  'Ú': 2, 'Ñ': 2, 'Ü': 2, 

  '0': 2, '1': 2, '2': 2, '3': 2, '4': 2, '5': 2, '6': 2, '7': 2, '8': 2, '9': 2,

  '.': 1, ',': 1, ';': 1, ':': 2, '¡': 1, '!': 1, '¿': 1, '?': 1, '(': 1, ')': 1, 
  '"': 1, '«': 1, '»': 1, '[': 1, ']': 1, '{': 2, '}': 2, '-': 1, '—': 2, '*': 1,
  '`': 1, '\'': 1, '/': 2, '//': 3, '\\': 2, '\\\\': 3, '<': 2, '>': 2, '|': 2,
  '||': 2, '+': 1, '±': 3, '·': 2, '÷': 2, '·/·': 2, '=': 1, '%': 2, '‰': 3,
  '©': 4, '®': 4, '™': 6, '℗': 4, '℠': 6, 'º': 1, 'ª': 1, '°': 1, '†': 2, '⚭': 3,
  '»': 1, '§': 1, '@': 1, '¶': 1, '#': 1, '$': 2, '&': 2, '€': 2, '₡': 2, '₢': 2, 
  '₣': 2, '₤': 2, '₥': 2, '₦': 2, '₧': 2, '₨': 2, '¥': 2, '₿': 2, 'Ƀ': 2, '₹': 2, 
  '₺': 2, '₽': 2, '₸': 2, '₾': 2, '₼': 2, '½': 3, '¼': 3, '¾': 3, '^': 1, '_': 2, 
  '~': 1, ' ': 1, '\n': 1, '‹': 1, '›': 1,
};

function contarCaracteresBrailleIntegral(texto) {
  let contador = 0;
  for (const char of texto) {
    if (equivalenciasBrailleIntegral[char] !== undefined) {
      contador += equivalenciasBrailleIntegral[char];
    } else {
      contador += 3; // Por defecto si no lo encontramos lo contamos como 3 para evitar problemas
    }
  }
  return contador;
}

//export { equivalenciasBrailleIntegral, contarCaracteresBrailleIntegral };

// Equivalencias de caracteres mas comunes en Braille computerizado (Braille de ocho puntos en castellano)

const equivalenciasBrailleComputerizado = {
  ' ': 1, '!': 1, '"': 1, '#': 1, '$': 1, '%': 1, '&': 1, "'": 1, 
  '(': 1, ')': 1, '*': 1, '+': 1, ',': 1, '-': 1, '.': 1, '/': 2, 
  '0': 1, '1': 1, '2': 1, '3': 1, '4': 1, '5': 1, '6': 1, '7': 1, 
  '8': 1, '9': 1, ':': 1, ';': 1, '<': 1, '=': 1, '>': 1, '?': 1, 
  '@': 1, 'A': 1, 'B': 1, 'C': 1, 'D': 1, 'E': 1, 'F': 1, 'G': 1, 
  'H': 1, 'I': 1, 'J': 1, 'K': 1, 'L': 1, 'M': 1, 'N': 1, 'O': 1, 
  'P': 1, 'Q': 1, 'R': 1, 'S': 1, 'T': 1, 'U': 1, 'V': 1, 'W': 1, 
  'X': 1, 'Y': 1, 'Z': 1, '[': 1, '\\':1, ']': 1, '^': 1, '_': 1, 
  '`': 1, 'a': 1, 'b': 1, 'c': 1, 'd': 1, 'e': 1, 'f': 1, 'g': 1, 
  'h': 1, 'i': 1, 'j': 1, 'k': 1, 'l': 1, 'm': 1, 'n': 1, 'o': 1, 
  'p': 1, 'q': 1, 'r': 1, 's': 1, 't': 1, 'u': 1, 'v': 1, 'w': 1, 
  'x': 1, 'y': 1, 'z': 1, '{': 1, '|': 1, '}': 1, '~': 1,
  'Ç': 1, 'ü': 1, 'é': 1, 'â': 1, 'ä': 1, 'à': 1, 'å': 1, 'ç': 1, 
  'ê': 1, 'ë': 1, 'è': 1, 'ï': 1, 'î': 1, 'ì': 1, 'Ä': 1, 'Å': 1, 
  'É': 1, 'æ': 1, 'Æ': 1, 'ô': 1, 'ö': 1, 'ò': 1, 'û': 1, 'ù': 1, 
  'ÿ': 1, 'Ö': 1, 'Ü': 1, 'ø': 1, '£': 1, 'Ø': 1, '×': 1, 'ƒ': 1, 
  'á': 1, 'í': 1, 'ó': 1, 'ú': 1, 'ñ': 1, 'Ñ': 1, 'ª': 1, 'º': 1, 
  '¿': 1, '®': 1, '¬': 1, '½': 1, '¼': 1, '¡': 1, '«': 1, '»': 1, 
  'ð': 1, 'Ð': 1, 'Ê': 1, 'Ë': 1, 'È': 1, 'ı': 1, 'Í': 1, 'Î': 1, 
  'Ï': 1, '┘': 1, '┌': 1, '¦': 1, 'Ì': 1, 
  'Ó': 1, 'ß': 1, 'Ô': 1, 'Ò': 1, 'õ': 1, 'Õ': 1, 'µ': 1, 'þ': 1, 
  'Þ': 1, 'ý': 1, 'Ý': 1, '¯': 1, '´': 1, '≡': 1, '±': 1, '‗': 1, 
  '¾': 1, 
  '¶': 1, '§': 1, '÷': 1, '¸': 1, '°': 1, '¨': 1, '·': 1, '¹': 1, 
  '³': 1, '²': 1, '¡': 1, '¢': 1, '£': 1, '¤': 1, 
  '¥': 1, '¦': 1, '§': 1, '¨': 1, '©': 1, 'ª': 1, '«': 1, '¬': 1, 
  '®': 1, '¯': 1, '°': 1, '±': 1, '²': 1, '³': 1, '´': 1, 
  'µ': 1, '¶': 1, '·': 1, '¸': 1, '¹': 1, 'º': 1, '»': 1, '¼': 1, 
  '½': 1, '¾': 1, '¿': 1, 'À': 1, 'Á': 1, 'Â': 1, 'Ã': 1, 'Ä': 1, 
  'Å': 1, 'Æ': 1, 'Ç': 1, 'È': 1, 'É': 1, 'Ê': 1, 'Ë': 1, 'Ì': 1, 
  'Í': 1, 'Î': 1, 'Ï': 1, 'Ð': 1, 'Ñ': 1, 'Ò': 1, 'Ó': 1, 'Ô': 1, 
  'Õ': 1, 'Ö': 1, '×': 1, 'Ø': 1, 'Ù': 1, 'Ú': 1, 'Û': 1, 'Ü': 1, 
  'Ý': 1, 'Þ': 1, 'ß': 1, 'à': 1, 'á': 1, 'â': 1, 'ã': 1, 'ä': 1, 
  'å': 1, 'æ': 1, 'ç': 1, 'è': 1, 'é': 1, 'ê': 1, 'ë': 1, 'ì': 1, 
  'í': 1, 'î': 1, 'ï': 1, 'ð': 1, 'ñ': 1, 'ò': 1, 'ó': 1, 'ô': 1, 
  'õ': 1, 'ö': 1, '÷': 1, 'ø': 1, 'ù': 1, 'ú': 1, 'û': 1, 'ü': 1, 
  'ý': 1, 'þ': 1, 'ÿ': 1
};

function contarCaracteresBrailleComputerizado(texto) {
  let contador = 0;
  for (const char of texto) {
    if (equivalenciasBrailleComputerizado[char] !== undefined) {
      contador += equivalenciasBrailleComputerizado[char];
    } else {
      contador += 2; // Por defecto si no lo encontramos lo contamos como 2 para evitar problemas
    }
  }
  return contador;
}

//export { equivalenciasBrailleComputerizado, contarCaracteresBrailleComputerizado };
