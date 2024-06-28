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

// Codigo para cuando pulse el deslizador
window.onload = function() {
    document.getElementById('mySwitch').addEventListener('change', function(e) {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            if (e.target.checked) {
                chrome.tabs.sendMessage(tabs[0].id, {action: "filtrarContenido"});
                chrome.tabs.sendMessage(tabs[0].id, {action: "filtrarPorConsola"});
            } else {
                chrome.tabs.sendMessage(tabs[0].id, {action: "restaurarOriginal"});
            }
        });
    });
}
// Código para guardar el estado del interruptor y que se mantenga al recargar la página,
// cambiar de pestaña, cerrar y volver a abrir el navegador, etc.
document.getElementById('mySwitch').addEventListener('change', function(e) {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        if (e.target.checked) {
            chrome.tabs.sendMessage(tabs[0].id, {action: "filtrarContenido"});
            chrome.tabs.sendMessage(tabs[0].id, {action: "filtrarPorConsola"});
            alert('El filtrado de contenido esta activado');
        } else {
            chrome.tabs.sendMessage(tabs[0].id, {action: "restaurarOriginal"});

            alert('El filtrado de contenido esta desactivado');
        }
        // Guardar el estado del interruptor
        chrome.storage.sync.set({filtradoActivado: e.target.checked});
    });
});

// Código para que el interruptor se mantenga en la posición correcta al recargar la página,
// cambiar de pestaña, cerrar y volver a abrir el navegador, etc.
window.onload = function() {
    // Obtener el estado guardado del interruptor
    chrome.storage.sync.get('filtradoActivado', function(data) {
        const mySwitch = document.getElementById('mySwitch');
        mySwitch.checked = data.filtradoActivado;
        mySwitch.dispatchEvent(new Event('change'));
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

/// Guardar el estado del formulario y del interruptor cuando se haga clic en el botón Guardar
document.getElementById('guardarBtn').addEventListener('click', function(e) {
    e.preventDefault();

    var longitud = document.getElementById('longitud').value;
    var infoAdicional = document.getElementById('infoAdicional').checked;
    var tipoBraille = document.querySelector('input[name="tipoBraille"]:checked').value;
    var filtradoActivado = document.getElementById('mySwitch').checked;

    // Ajustar la longitud si infoAdicional está activado
    longitud = infoAdicional ? longitud - 5 : longitud;

    chrome.storage.sync.set({
        longitud: longitud,
        infoAdicional: infoAdicional,
        tipoBraille: tipoBraille,
        filtradoActivado: filtradoActivado
    }, function() {
        // Mostrar la configuración después de guardarla
        mostrarConfiguracion(longitud, infoAdicional, tipoBraille);
    });
});

// Recuperar el estado del formulario y del interruptor cuando se cargue la extensión
window.onload = function() {
    chrome.storage.sync.get(['longitud', 'infoAdicional', 'tipoBraille', 'filtradoActivado'], function(data) {
        document.getElementById('longitud').value = data.longitud || '40';
        document.getElementById('infoAdicional').checked = data.infoAdicional || false;
        document.querySelector(`input[name="tipoBraille"][value="${data.tipoBraille || 'computerizado'}"]`).checked = true;
        document.getElementById('mySwitch').checked = data.filtradoActivado || false;

        // Mostrar la configuración después de recuperarla
        mostrarConfiguracion(data.longitud, data.infoAdicional, data.tipoBraille);
    });
};

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