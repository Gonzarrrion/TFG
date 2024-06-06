document.getElementById('charOptions').addEventListener('change', function() {
    const selectedValue = this.value;
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'updateLongitudMaxima', value: parseInt(selectedValue) });
    });
});

document.getElementById('filtrarBtn').addEventListener('click', function() {
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
