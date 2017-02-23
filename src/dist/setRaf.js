import { ARRAY_SLICE, ROOT } from './configs';

const RAF_CALLS = [];

const RAF_UPDATE = ( ( win => {
		win.requestAnimationFrame = win.requestAnimationFrame || ( fn => win.setTimeout( fn, 50 / 3 ) );
		win.cancelAnimationFrame = win.cancelAnimationFrame || ( fn => win.clearTimeout( fn ) );
		const _run = "RUNNING";
		let _tick;
		_tick = function update() {
			let i = 0;
			while ( i < RAF_CALLS.length ) {
				const raf = RAF_CALLS[ i ];
				if ( raf.loop ) {
					raf._val = raf.args ? raf.render( ...raf.args ) : raf.render.call( raf );
					raf.loop = raf._val === _run;
				} else if ( raf.run && ( !raf.rendered && !raf._destroy ) ) {
					if ( raf.args ) {
						raf._val = raf.render( ...raf.args );
					} else {
						raf._val = raf.render.call( raf );
					}
					if ( raf._val === _run ) {
						raf.loop = true;
					}
					raf.rendered = true;
				} else if ( raf.run ) {
					RAF_CALLS.splice( i, 1 );
				}
				i++
			}
			if ( RAF_CALLS.length ) {
				_tick = win.requestAnimationFrame( update );
			} else {
				win.cancelAnimationFrame( _tick );
			}
		};
		return {
			add( item ) {
				const _item = {
					_destroy: false
					, message( last ) {
						const old = this.render
							, curr = this
							, self = this.self;
						this.render = function() {
							return ( curr._val = last.call( curr, {
								data: ( curr._val = old.apply( curr, ARRAY_SLICE.call( arguments ) ) )
							} ) );
						}
					}
					, get() {
						return this._val || this.args && this.args[ 0 ];
					}
					, destroy() {
						this._destroy = true;
					}
					, args: null
					, rendered: false
					, render: item
					, run: false
				};
				RAF_CALLS.push( _item );
				win.requestAnimationFrame( _tick );
				return _item;
			}
			, destroy( item ) {
				const match = [].concat( RAF_CALLS )
					.filter( item2 => item2.render === item );
				if ( !match )
					return;
				const i = RAF_CALLS.indexOf( match[ 0 ] );
				if ( i > -1 ) {
					RAF_CALLS.splice( i, 1 );
				}
			}
		};
	} )
	( ROOT ) );

class setRAF {
	constructor () {
	this._raf = null;
	return this;
	}
	call( fn ) {
		this._raf = RAF_UPDATE.add( fn );
		this._raf.self = this;
		this._val = this._raf._val;
		return this;
	}
	get() {
		return this._raf.get();
	}
	done( fn ) {
		this._raf.message( fn );
		this._val = this._raf._val;
		return this;
	}
	run() {
		this._raf.args = ARRAY_SLICE.call( arguments );
		this._raf.run = true;
		this._val = this._raf._val;
		return this;
	}
	close() {
		RAF_UPDATE.destroy( this._raf );
		return this;
	}
};

export default setRAF;