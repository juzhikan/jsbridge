import {isJsbridgeCapable, callHandler as bridgeCallHandler} from './bridge';
import {stringify} from './util';

export default class APIAbstract {
    constructor() {

    }

    getLegacyProtocolConfig(actionName, data) {
        switch (actionName) {

        }
    }

    getComputedUrl(path) {
        if (/^[\w0-9]+:\/\//.test(path)) { //'necomics://manhua.163.com/v1', nereader://yuedu.163.com/v1?
            return path;
        }

        return this.schemaName_ + '://' + path;
    }
}

let APIInstance;

const schemaCallHandler = (API, actionName, data, callback, seperator) => {
    APIInstance = APIInstance || new API();

    const obj = APIInstance.getLegacyProtocolConfig(actionName, data) || {};

    actionName = obj.actionName || actionName;
    data = obj.data || data;
    if(data.seperator !== undefined) {
        seperator = data.seperator;     //兼容'neteasereaderuri://entryid=cf3587af574a4056a798878f59fa1b60_4&type=2'
    }

    let oCallback = null;

    if (callback) {
        oCallback = {};
        if (typeof obj.callback === 'string') {
            oCallback.name = obj.callback;
            oCallback.handler = callback;
        } else if (obj.callback !== undefined) {

            if (obj.callback.name === undefined) {
                throw new Error('callback name must be provided');
            }

            oCallback.name = obj.callback.name;
            oCallback.handler = (...args) => {
                if (typeof obj.callback.handler === 'function') {
                    let result = obj.callback.handler.apply(null, args);
                    callback(result);
                } else {
                    callback.apply(null, result);
                }
            };
        }
    }

    const isInApp = APIInstance.isInApp();

    if (actionName === 'pageRedirect') {
        const path = APIInstance.getComputedUrl(data.path);

        bridgeCallHandler(path, data.query, oCallback, isInApp, seperator);
    } else {
        const path = APIInstance.getComputedUrl(actionName);

        bridgeCallHandler(path, data, oCallback, isInApp, seperator);
    }
}

const jsbridgeCallHandler = (API, actionName, data, callback, seperator = '?') => {
    APIInstance = APIInstance || new API();

    if (actionName === 'pageRedirect') {
        let path;
        let query;
        let close;
        let obj = APIInstance.getLegacyProtocolConfig(actionName, data);

        if (obj) {
            obj = obj.data;
            path = obj.path || data.path;
            query = obj.query || data.query;
            if(obj.seperator !== undefined) {
                seperator = obj.seperator;     //兼容'neteasereaderuri://entryid=cf3587af574a4056a798878f59fa1b60_4&type=2'
            }
        }else{
            path = data.path;
            query = data.query;
            close = data.close;
        }

        path = APIInstance.getComputedUrl(path);

        data = { actionUrl: path + seperator + stringify(query) };
        if(close){
            data.close = close;
        }
    }

    bridgeCallHandler(actionName, data, callback);
}

const doCallHandler = isJsbridgeCapable ? jsbridgeCallHandler : schemaCallHandler;

export const callHandler = (API, actionName, data = {}, callback, seperator) => {
    if (typeof data === 'function') {
        callback = data;
        data = {};
    }

    doCallHandler(API, actionName, data, callback, seperator);
};
