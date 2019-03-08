
import {callHandler as jsbridgeCallHandler} from './jsbridge';
import {callHandler as schemaCallHandler} from './schema';

const patternResult = navigator.userAgent.match(/NEJSBridge\/([\d.]+)\b/);

export const isJsbridgeCapable = !!patternResult;

export const callHandler = isJsbridgeCapable ? jsbridgeCallHandler : schemaCallHandler;

export const libSupport = (actionName, versionMap) => {
    if (!isJsbridgeCapable || !(actionName in versionMap)) {
        return false;
    }

    const sinceVersoin = versionMap[actionName];
    const currentVersion = parseInt(patternResult[1], 10);

    return sinceVersoin <= currentVersion;
}