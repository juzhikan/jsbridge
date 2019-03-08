let bridgeCallbackQueue = [];

function setupWebViewJavascriptBridge(callback) {
    if (window.NEJSBridge) {
        callback(NEJSBridge)
        return;
    }
    bridgeCallbackQueue.push(callback);
    
    var NEJSBridgeReady = false;
    document.addEventListener('NEJSBridgeReady', function() {
            NEJSBridgeReady = true;
            bridgeCallbackQueue.forEach((callback) => {
                callback(NEJSBridge);
            });
            bridgeCallbackQueue = [];
        },
        false
    );

    var notifyAppTimes = 0;
    function notifyAppLoaded() {
        notifyAppTimes++;
        var WVJBIframe = document.createElement('iframe');
        WVJBIframe.style.display = 'none';
        WVJBIframe.src = 'nejb://nejb_loaded';
        document.documentElement.appendChild(WVJBIframe);
        setTimeout(function () {
            document.documentElement.removeChild(WVJBIframe);
        }, 0);
    }
    notifyAppLoaded();
    var notifyAppTimer = setInterval(function () {
        if(notifyAppTimes < 6 && !NEJSBridgeReady){
            notifyAppLoaded();
        }else{
            clearInterval(notifyAppTimer);
        }
    }, 300)
}

export const callHandler = (actionName, data, callback) => {
    setupWebViewJavascriptBridge(function(bridge) {
        bridge.callHandler(actionName, data, (resp) => {
            if (resp !== undefined) {
                resp = JSON.parse(resp);
            }
            callback(resp);
        });
    });
}

export const registerHandler = (actionName, callback) => {
    setupWebViewJavascriptBridge(function(bridge) {
        bridge.registerHandler(actionName, (resp, responseCallback) => {
            if (resp !== undefined) {
                resp = JSON.parse(resp);
            }
            callback(resp, responseCallback);
        });
    });
}
