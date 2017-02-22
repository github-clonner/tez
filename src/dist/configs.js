let ROOT = typeof(window) !== "undefined" ? window : typeof(exports) !== "undefined" ? exports : {};
let MAX_WORKER_THREAD = 2;
let CURRENT_WORKER_THREAD = 0;
let LIST_WORKER_THREAD = [];
let ARRAY_SLICE = [].slice;
let FUNC_STR = Function.toString;
let WORKER_SUPPORT = ROOT.Worker !== undefined;

export { MAX_WORKER_THREAD, CURRENT_WORKER_THREAD, LIST_WORKER_THREAD, ARRAY_SLICE, FUNC_STR, WORKER_SUPPORT, ROOT };