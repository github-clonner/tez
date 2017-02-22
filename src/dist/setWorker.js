import { FUNC_STR, WORKER_SUPPORT, MAX_WORKER_THREAD, ARRAY_SLICE, LIST_WORKER_THREAD } from './configs';

const setWorker = function (force) {
	this._force = force;
	this._worker = null;
	this._id = 0;
	return this;
};
if (WORKER_SUPPORT) {
	var p = setWorker.prototype = {
		createBlob(fn) {
			return new Worker(
				window.URL.createObjectURL(
					new Blob([
`self.onmessage = function(wrk) {var f = ${FUNC_STR.call(fn)};self.postMessage(f.apply(this, wrk.data));};`
						], {
						type: 'text/javascript'
					})))
		},
		call(fn) {
			if (this._id >= MAX_WORKER_THREAD && this._force) {
				LIST_WORKER_THREAD.shift()
				.close();
			}
			this._fnc = fn;
			this._worker = this.createBlob(fn);
			this._id++;
			LIST_WORKER_THREAD.push(this);
			return this;
		},
		get() {
			return this._val;
		},
		done(fn) {
			const curr = this;
			this._worker.addEventListener('message', e => {
				if (e.data === undefined)
					return;
				curr._val = fn.call(curr._worker, {
						data: e.data
					});
			});
		},
		run() {
			const args = ARRAY_SLICE.call(arguments);
			this._worker.postMessage(args);
			this._val = args[0];
			return this;
		},
		close() {
			this._worker && this._worker.destroy();
			return this;
		}
	};
}
export default setWorker;