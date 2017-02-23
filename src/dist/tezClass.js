import { getDecPow } from './getDecPow';
import { ARRAY_SLICE } from './configs';
import { extend } from './extend';

class tezClass {
	constructor ( opts = {} ) {
	this.events = {};
	opts = extend( opts, {
		lets: {}
		, lets2: {}
		, _lets: {}
		, tweenable: {}
		, state: 0
		, render: null
	} );

	opts.setInitLets && opts.setInitLets.call( opts );
	opts.setTweenableLets && opts.setTweenableLets.call( opts );

	this.mountedNodes = [];

	this.opts = opts;

	this.lets = opts.lets;
	this.lets2 = opts.lets2;
	return this;
	}
	plugin( plug ) {
		if ( typeof plug === "string" && Tez.PluginManager[ plug ] !== undefined && Tez.PluginManager[ plug ].tez !== undefined ) {
			Tez.PluginManager[ plug ].tez.call( this, this.lets, this.opts );
		}
		return this;
	}
	apply() {
		const {
			opts
		} = this;
		let {
			lets
			, lets2
			, _lets
		} = opts;
		const _minVal = 0.001;
		const _maxVal = 1;
		this.mountedNodes.map( ( node, index ) => {
			const dom = new Tez.DOMManager( node );
			const now = Date.now();
			const {
				render
				, tweenable
			} = opts;
			const round = tweenable.roundLets;
			const limitDec = tweenable.limitLetsDecimals;
			const start = tweenable && ( typeof( tweenable.startTime ) === "function" ? tweenable.startTime.call( this, node, index ) : tweenable.startTime ) || 0;
			const dur = tweenable && ( typeof( tweenable.duration ) === "function" ? tweenable.duration.call( this, node, index ) : tweenable.duration ) || 1000;
			const tween = Tez.TweenManager( lets, lets2 );
			let diff;

			if ( tweenable ) {
				diff = Tez.DiffManager( lets, lets2 );
				dom.composite( e => {
						if ( !diff )
							return e.state;
						let elapsed = Math.max( 0, Math.min( ( ( Date.now() - now ) - start ) / dur, 1 ) );
						let timeElapsed = elapsed;
						if ( tweenable.curve ) {
							elapsed = tweenable.curve( timeElapsed );
						}
						_lets = tween( elapsed );
						for ( let p in _lets ) {
							if ( round && round[ p ] ) {
								_lets[ p ] = typeof( _lets[ p ] ) === "number" ? ( _lets[ p ] | 0 ) : _lets[ p ] !== undefined && _lets[ p ].push && _lets[ p ].slice ? _lets[ p ].map( Math.round ) : _lets[ p ];
							} else if ( limitDec && limitDec[ p ] ) {
								let dv = getDecPow( limitDec[ p ] );
								_lets[ p ] = typeof( _lets[ p ] ) === "number" ? ( ( ( _lets[ p ] * dv ) | 0 ) / dv ) : _lets[ p ] !== undefined && _lets[ p ].push && _lets[ p ].slice ? _lets[ p ].map( v => ( ( v * dv ) | 0 ) / dv ) : _lets[ p ];
							}
						}
						if ( timeElapsed > _minVal ) {
							render.call( this, node, _lets, opts, index, elapsed );
						}
						return timeElapsed < _maxVal ? e.state : 0;
					} )
					.compositeArg( {
						state: opts.state || "RUNNING"
					} );
			} else if ( opts.initState ) {
				render.call( this, node, lets, opts, index, elapsed );
			}
		} );
		return this;
	}
	render( _lets, leaveLet ) {
		const { opts } = this;
		_lets = _lets || opts.lets;
		const dm = Tez.DiffManager( opts.lets, _lets );
		if ( !dm )
			return this;
		this.mountedNodes.map( ( node, index ) => {
			opts.render.call( this, node, _lets || opts.lets, opts, index );
		} );
		if ( !leaveLet ) {
			opts.lets = _lets;
		}
		return this;
	}
	mountNode( node ) {
		node = ARRAY_SLICE.call( typeof( node ) === "string" ? document.querySelectorAll( node ) : node.length ? node : [ node ] );
		this.mountedNodes = this.mountedNodes.concat( node );
		return this;
	}
	nodeOn( event, on ) {
		this.mountedNodes.map( node => {
			this.node = node;
			node.addEventListener( event, e => {
				on.call( this, e );
			} );
		} );
		return this;
	}
	nodeOff( event, off ) {
		this.mountedNodes.map( node => {
			this.node = node;
			node.removeEventListener( event, e => {
				off.call( this, e );
			} );
		} );
		return this;
	}
	on( event, callback, unshift ) {
		if ( !this.events[ event ] ) {
			this.events[ event ] = [];
		}
		this.events[ event ][ unshift ? 'unshift' : 'push' ]( callback );
		return this;
	}
	off( event, callback ) {
		if ( !this.events[ event ].length ) {
			delete this.events[ event ];
		}
		let i = 0;
		while ( i < this.events[ event ].length ) {
			if ( this.events[ event ][ i ] === callback ) {
				this.events[ event ].splice( i, 1 );
			} else {
				i++
			}
		}
		return this;
	}
	dispatch( event, custom = {} ) {
		if ( !this.events[ event ] ) {
			return;
		}
		const {
			opts
		} = this;
		this.events[ event ].map( event => {
			event.call( this, extend( custom, {
				opts
				, timestamp: Date.now()
				, type: event
				, target: this
			} ) );
		} );
		return this;
	}
};

export default tezClass;