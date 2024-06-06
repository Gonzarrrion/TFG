let longitudMaxima = 0;
let contenidoFiltrado = false;
let contenidoOriginal = '';

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.action === "updateLongitudMaxima") {
      longitudMaxima = request.value;
      contenidoFiltrado = false; // Flag para saber si el contenido de la página ya fue filtrado
    }
    if (request.action === "filtrarContenido") {
      filtrarContenido();
    }
    if (request.action === "restaurarContenidoOriginal") {
      restaurarContenidoOriginal();
    }
    if (request.action === "filtrarContenidoSinModificar") {
      filtrarContenidoSinModificar();
    }
  }
);

function dividirLineas(texto, longitudMaxima) {
  const palabras = texto.split(' ');
  let lineas = [];
  let lineaActual = '';

  palabras.forEach((palabra) => {
    if (lineaActual.length + palabra.length <= longitudMaxima) {
      lineaActual += palabra + ' ';
    } else {
      lineas.push(lineaActual.trim());
      lineaActual = palabra + ' ';
    }
  });

  if (lineaActual !== '') {
    lineas.push(lineaActual.trim());
  }

  return lineas;
}

function filtrarContenido() {

  if (contenidoFiltrado == true ) { // Si el contenido ya fue filtrado, no hacer nada
    return;
  }

  // Guardar el contenido original de la página
  if (!contenidoOriginal) {
    contenidoOriginal = document.body.innerText;
  }
  
  const lineasFiltradas = dividirLineas(contenidoOriginal, longitudMaxima);

  document.body.innerText = lineasFiltradas.join('\n');

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
    contenidoOriginal = document.body.innerText;
  }

  const lineasFiltradas = dividirLineas(contenidoOriginal, longitudMaxima);

  console.log("Líneas filtradas sin modificar:");
  console.log(lineasFiltradas.join('\n'));
}
