document.getElementById('guardarBtn').addEventListener('click', function(event) {
    event.preventDefault(); // Evita que el formulario se envíe

    // Recoge los valores de los campos del formulario
    const longitud = document.getElementById('longitud').value;
    const infoAdicional = document.getElementById('infoAdicional').checked;
    const brailleComputerizado = document.getElementById('brailleComputerizado').checked;
    const brailleIntegral = document.getElementById('brailleIntegral').checked;

    // Envía los valores a content.js
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { 
            action: 'guardarConfiguracion',
            longitud: longitud,
            infoAdicional: infoAdicional,
            brailleComputerizado: brailleComputerizado,
            brailleIntegral: brailleIntegral
        });
    });
});

/*document.getElementById('filtrarBtn').addEventListener('click', function() {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'filtrarContenido' });
    });
});

document.getElementById('restaurarBtn').addEventListener('click', function() {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'restaurarContenidoOriginal' });
    });
});

document.getElementById('filtrarSinModificarBtn').addEventListener('click', function() {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'filtrarContenidoSinModificar' });
    });
});


document.getElementById('filtrarPorConsolaBtn').addEventListener('click', function() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {action: "filtrarPorConsola"});
    });
});*/

// Codigo para que cuando pulse el deslizador
window.onload = function() {
    document.getElementById('mySwitch').addEventListener('change', function(e) {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            if (e.target.checked) {
                chrome.tabs.sendMessage(tabs[0].id, {action: "filtrarContenido"});
                chrome.tabs.sendMessage(tabs[0].id, {action: "filtrarPorConsola"});
                alert('Filtrado Activado');
            } else {
                chrome.tabs.sendMessage(tabs[0].id, {action: "restaurarOriginal"});
                alert('Filtrado Desactivado');
            }
        });
    });
}

// Función para crear y agregar elementos p
function mostrarConfiguracion(longitud, infoAdicional, tipoBraille) {
    // Eliminar los elementos p existentes
    let elementosP = document.querySelectorAll('p');
    elementosP.forEach(function(elemento) {
        elemento.remove();
    });

    // Crear nuevos elementos p
    let p1 = document.createElement('p');
    p1.innerHTML = '<strong>Configuración actual:</strong>';
    p1.style.marginLeft = '20px';

    let p2 = document.createElement('p');
    p2.textContent = 'Longitud máxima de línea: ' + longitud;
    p2.style.marginLeft = '20px';

    let p3 = document.createElement('p');
    p3.textContent = 'Caracteres de información adicional: ' + (infoAdicional ? 'activado' : 'desactivado');
    p3.style.marginLeft = '20px';

    let p4 = document.createElement('p');
    p4.textContent = 'Tipo de braille seleccionado: ' + tipoBraille;
    p4.style.marginLeft = '20px';

    // Agregar los elementos p al final del body del popup
    document.body.appendChild(p1);
    document.body.appendChild(p2);
    document.body.appendChild(p3);
    document.body.appendChild(p4);
}

// Código para mostrar la configuración actual en el popup
document.addEventListener('DOMContentLoaded', function() {
    chrome.storage.sync.get(['longitudMaxima', 'infoAdicional', 'brailleComputerizado', 'brailleIntegral'], function(configuracion) {
        // Guardar el valor original de la longitud máxima
        let longitudOriginal = configuracion.longitudMaxima;

        // Ajustar la longitud máxima si infoAdicional está activado
        let longitud = configuracion.infoAdicional ? longitudOriginal - 5 : longitudOriginal;

        // Determinar el tipo de braille seleccionado
        let tipoBraille = 'ninguno';
        if (configuracion.brailleIntegral) {
            tipoBraille = 'integral';
        } else if (configuracion.brailleComputerizado) {
            tipoBraille = 'computerizado';
        }

        // Mostrar la configuración
        mostrarConfiguracion(longitud, configuracion.infoAdicional, tipoBraille);
    });
});

// Código para guardar la configuración y actualizar el texto
document.getElementById('guardarBtn').addEventListener('click', function() {
    // Obtener los valores actuales de los elementos del formulario
    let longitudMaxima = document.getElementById('longitud').value;
    let infoAdicional = document.getElementById('infoAdicional').checked;
    let brailleComputerizado = document.getElementById('brailleComputerizado').checked;
    let brailleIntegral = document.getElementById('brailleIntegral').checked;

    // Guardar la configuración
    chrome.storage.sync.set({
        'longitudMaxima': longitudMaxima,
        'infoAdicional': infoAdicional,
        'brailleComputerizado': brailleComputerizado,
        'brailleIntegral': brailleIntegral
    }, function() {
        // Guardar el valor original de la longitud máxima
        let longitudOriginal = longitudMaxima;

        // Ajustar la longitud máxima si infoAdicional está activado
        let longitud = infoAdicional ? longitudOriginal - 5 : longitudOriginal;

        // Determinar el tipo de braille seleccionado
        let tipoBraille = 'ninguno';
        if (brailleIntegral) {
            tipoBraille = 'integral';
        } else if (brailleComputerizado) {
            tipoBraille = 'computerizado';
        }

        // Mostrar la configuración
        mostrarConfiguracion(longitud, infoAdicional, tipoBraille);
    });
});