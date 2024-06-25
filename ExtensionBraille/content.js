//import { equivalenciasBrailleIntegral, contarCaracteresBraille } from './equivalenciasBraille.js';
//import { equivalenciasBrailleComputerizado, contarCaracteresBraille } from './equivalenciasBraille.js'; 

let contenidoFiltrado = false;
let contenidoOriginal = '';

let configuracion = {};

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {

    if (request.action === "filtrarContenido") {
      filtrarContenido();
    }

    if (request.action === "restaurarContenidoOriginal") {
      restaurarContenidoOriginal();
    }
    
    if (request.action === "filtrarContenidoSinModificar") {
      filtrarContenidoSinModificar();
    }

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
    chrome.storage.sync.get(['longitudMaxima'], function(configuracion) {
      if (contenidoFiltrado == true) {
        reject('El contenido ya está filtrado');
        return;
      }

      let lineas = [];
      const bloques = texto.split('\n'); // Divide el texto en bloques por nueva línea

      bloques.forEach((bloque) => {
        const palabras = bloque.split(' ');
        let lineaActual = '';

        palabras.forEach((palabra) => {
          if (lineaActual.length + palabra.length <= configuracion.longitudMaxima) {
            lineaActual += palabra + ' ';
          } else {
            lineas.push(lineaActual.trim());
            lineaActual = palabra + ' ';
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


function filtrarElemento(elemento) {
  if (elemento.nodeType === Node.TEXT_NODE) {
    const texto = elemento.nodeValue;
    const lineasFiltradas = dividirLineas(texto);
    elemento.nodeValue = lineasFiltradas.join('\n');
  } else {
    for (let i = 0; i < elemento.childNodes.length; i++) {
      filtrarElemento(elemento.childNodes[i]);
    }
  }
}

function filtrarContenido() {
  if (contenidoFiltrado) { // Si el contenido ya fue filtrado, no hacer nada
    return;
  }

  // Guardar el contenido original de la página
  if (!contenidoOriginal) {
    contenidoOriginal = document.body.innerHTML;
  }

  filtrarElemento(document.body);
  //agregarEtiquetasInteractivas(document.body);
  contenidoFiltrado = true;
}

function restaurarContenidoOriginal(){

  if (contenidoOriginal) {
    document.body.innerText = contenidoOriginal;
  }
  
  contenidoFiltrado = false;
  contenidoOriginal = '';
}

function filtrarContenidoSinModificar() {

  if (!contenidoOriginal) { 
    contenidoOriginal = document.body.innerHTML;
  }

  filtrarElemento(document.body);
  contenidoFiltrado = true;
}



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
