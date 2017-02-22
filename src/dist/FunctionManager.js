import { ARRAY_SLICE } from './configs';
import setWorker from './setWorker';
import setRAF from './setRaf';
import setFn from './setFn';
import PluginManager from './PluginManager';

let FunctionManager = function (fnc, mode) {
	this._mode = (mode === "Worker" && WORKER_SUPPORT) ? new setWorker(true) : mode === "raf" ? new setRAF(true) : new setFn(true);
	this.m = this._mode.call(fnc);
	return this;
}

FunctionManager.prototype = {
	onMessage( fn ) {
		const c = this;
		this.m.done( e => fn.call( c.m, e.data ) );
		return this;
	}
	, plugin( plug ) {
		if ( typeof plug === "string" && PluginManager[ plug ] !== undefined && PluginManager[ plug ].fnMgr !== undefined ) {
			this.m = PluginManager[ plug ].fnMgr.call( this, this.m );
		}
		return this;
	}
	, get() {
		return this.m.get();
	}
	, run( a ) {
		const args = a !== undefined ? ARRAY_SLICE.call( arguments ) : [];
		if ( !args.length )
			return this;
		this.m.run( ...args );
		return this;
	}
};
export default FunctionManager;