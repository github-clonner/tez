import { ARRAY_SLICE } from './configs';

class setFn {
	constructor () {
	this._fn = null;
	return this;
	}
	call( fn ) {
		this._fn = fn;
		return this;
	}
	get() {
		return this._val;
	}
	done( fn ) {
		const _oldFn = this._fn;
		const curr = this;
		this._fn = function() {
			const args = ARRAY_SLICE.call( arguments );
			return fn.call( curr, {
				data: ( curr._val = _oldFn.apply( curr, args ) )
			} );
		};
		return this;
	}
	run( a ) {
		const args = a !== undefined ? ARRAY_SLICE.call( arguments ) : [];
		this._val = args.length ? this._fn( ...args ) : this._fn.call( this );
		return this;
	}
	close() {
		this._fn = null;
		return this;
	}
};

export default setFn;