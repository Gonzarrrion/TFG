chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (changeInfo.status === 'complete' && tab.active) {
        chrome.storage.sync.get('filtradoActivado', function(data) {
            if (data.filtradoActivado) {
                chrome.tabs.sendMessage(tabId, {action: "filtrarContenido"});
                chrome.tabs.sendMessage(tabId, {action: "filtrarPorConsola"});
            }
        });
    }
});