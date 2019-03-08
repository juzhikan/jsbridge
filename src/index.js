export {isJsbridgeCapable} from './lib/bridge';

export {callHandler as comicCallHandler, registerHandler as comicRegisterHandler,
    support as comicSupport} from './comic/comic';
export {callHandler as snailCallHandler, registerHandler as snailRegisterHandler,
    support as snailSupport} from './snail/snail';

export {callHandler as readCallHandler, registerHandler as readRegisterHandler,
    support as readSupport, schemaGetter as readSchemaGetter} from './read/read';

export {callHandler as schemaCallHandler} from './lib/bridge/schema';