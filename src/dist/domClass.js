import { attrs } from './attrs';
import { _parseString } from './str2node';
import { replaceChildrenByDiff } from './pathDiff';
import { _makeNode } from './makeNode';
import { _getItem } from './getItem';

let domClass = function( node, vars ) {
	this._vars = vars = vars || {};
	if ( vars.quickRender === undefined ) {
		vars.quickRender = true;
	}
	const _opts = this._opt = {};
	this._node = typeof( node ) === "string" ? document.querySelector( node ) : node.length && node[ 0 ].nodeType ? node[ 0 ] : node;
	this._vnode = this._node.cloneNode( true );
	this._nodeElem = this._vnode;
	this._quickRender = vars.quickRender;
	this._appendStore = [];
	this.props = {};
	this._listOfNodes = [];
	if ( vars.styling === undefined ) {
		vars.styling = this._vnode.style.cssText;
	}
	if ( vars.attrs === undefined ) {
		vars.attrs = attrs( this._vnode );
	}
	if ( vars.content === undefined ) {
		vars.content = this._vnode.innerHTML;
	}
	return this.render();
};
domClass.prototype = {
	createElement( opts ) {
		let item;
		const appendStore = this._appendStore;
		const len = appendStore.length;
		appendStore[ len ] = {
			real: 'append'
			, virtual: ( item = _makeNode( opts ) )
			, diff: false
			, index: len
		};
		return item;
	}
	, setProps( props ) {
		for ( const p in props ) {
			this.props[ p ] = props[ p ];
		}
		return this;
	}
	, setEvent( find, eventName, eventFunc ) {
		const __self__ = this;

		const __eventFunc__ = function( e ) {
			eventFunc.call( __self__, this, e )
		};

		if ( eventFunc && find === null ) {
			this._node.addEventListener( eventName, __eventFunc__ );
		} else if ( eventFunc ) {
			find = this._node.querySelector( find );
			find.addEventListener( eventName, __eventFunc__ );
		}
		return this;
	}
	, createFunction( fn ) {
		fn.call( this );
		return this;
	}
	, render() {
		const vars = this._vars;
		const node = this._node;
		const vnode = this._vnode;
		const append = this._appendStore;
		const _listOfNodes = this._listOfNodes;
		let _vattrs = vars.attrs;
		let _attrs = attrs( node );
		let _diff;
		if ( _attrs !== _vattrs ) {
			_diff = JSON.parse( _vattrs );
			for ( const p in _diff ) {
				node.setAttribute( p, _diff[ p ] );
			}
			vars.attrs = attrs( vnode );
		}
		_vattrs = vars.styling;
		_attrs = node.style.cssText;
		if ( _vattrs !== _attrs ) {
			this._node.style.cssText = _vattrs;
			vars.styling = node.style.cssText;
		}
		_vattrs = vars.content;
		_attrs = node.innerHTML;
		for ( let i = 0, len = _listOfNodes.length; i < len; i++ ) {
			const idx = append.length;
			append[ idx ] = {
				virtual: _listOfNodes[ i ]
				, real: 'append'
				, diff: false
				, index: idx
			}
		}
		if ( append.length || _attrs !== _vattrs ) {
			const _childs = _parseString( _vattrs );
			const _childs2 = _parseString( _attrs );
			replaceChildrenByDiff( node, vnode, _childs, _childs2, append );
			vars.content = vnode.innerHTML;
		}
		return this;
	}
	, setNode( node ) {
		this._listOfNodes.push( node );
		return this._quickRender ? this.render() : this;
	}
	, setAttrs( _attrs ) {
		let attr;
		const nattr = {};
		const _attr = JSON.parse( this._vars.attrs );
		for ( var p in _attr ) {
			if ( _attr[ p ] !== undefined ) {
				nattr[ p ] = _attr[ p ];
			}
		}
		for ( var p in _attrs ) {
			if ( _attrs[ p ] !== undefined ) {
				nattr[ p ] = _attrs[ p ];
			}
		}
		this._vars.attrs = JSON.stringify( nattr );
		return this._quickRender ? this.render() : this;
	}
	, setStyling( cssText ) {
		const styling = this._vars.styling;
		const style = this._vnode.style;
		style.cssText = styling;
		for ( const p in cssText ) {
			style[ p ] = cssText[ p ];
		}
		this._vars.styling = style.cssText;
		return this._quickRender ? this.render() : this;
	}
	, setContent( contents ) {
		let content = this._vars.content;
		if ( !contents ) {
			return this._quickRender ? this.render() : this;
		}
		contents = typeof( contents ) === "string" ? contents : contents.nodeType ? contents.outerHTML : contents;
		const rel = contents.includes( "=" ) ? contents.charAt( 0 ) === "+" ? 1 : contents.charAt( 0 ) === "-" ? -1 : 0 : 0;

		if ( rel === 0 ) {
			content = contents;
		} else if ( rel === 1 ) {
			content += contents.substr( 2 );
		} else if ( rel === -1 ) {
			const _getParsed = _parseString( contents.substr( 2 ) )[ 0 ];
			const _find = _getItem( _getParsed, this._node );
			if ( _find && _find.matched ) {
				this._appendStore.push( {
					virtual: _find.matched
					, real: 'append'
					, remove: true
				} );
			}
		}

		this._vars.content = content;
		return this._quickRender ? this.render() : this;
	}
};

export default domClass;