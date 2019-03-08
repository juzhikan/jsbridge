import {stringify} from '../util';

function connectToNative(url, isInApp) {
    if (!isInApp) {
        window.location.href = url;
        return;
    }

    var WVJBIframe = document.createElement('iframe');
    WVJBIframe.style.display = 'none';
    WVJBIframe.src = url;
    document.documentElement.appendChild(WVJBIframe);
    setTimeout(function() { document.documentElement.removeChild(WVJBIframe) }, 0)
}

const setValueByPath = (path, value) => {
    const array = path.split('.');

    array.reduce(function(acc, currentValue, currentIndex, array) {

        if (currentIndex === array.length - 1) {
            acc[currentValue] = value;
        } else if (acc[currentValue] === undefined || acc[currentValue] === null) {
            acc[currentValue] = {};
        }

        return acc[currentValue];
    }, window);
};

export const callHandler = (actionName, data, callback, isInApp, seperator = '?') => {

    if (typeof callback === 'object' && callback !== null) {

        if (callback.name !== undefined) {
            setValueByPath(callback.name, (...args) => {
                if (typeof callback.handler === 'function') {
                    callback.handler.apply(null, args);
                }
                setValueByPath(callback.name, null);
            });
        }
    }
    const url = actionName + seperator + stringify(data);
    connectToNative(url, isInApp);
}
