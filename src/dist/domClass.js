import { attrs } from './attrs';
import { _parseString } from './str2node';
import { replaceChildrenByDiff } from './patchDiff';
import { _makeNode } from './makeNode';
import { _getItem } from './getItem';

class domClass {
	constructor( node, vars = {} ) {
		this._vars = vars;
		if ( vars.quickRender === undefined ) {
			vars.quickRender = true;
		}
		this._opt = {};
		this._node = typeof( node ) === 'string' ? document.querySelector( node ) : node.length && node[ 0 ].nodeType ? node[ 0 ] : node;
		this._vnode = this._node.cloneNode( true );
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
	}
	static getComponentRendered (get) {
		if (typeof get === "string" || typeof get === "number") {
			return get;
		} else if (get === undefined || get === null) {
			return '';
		} else if ( typeof get === "function" || typeof get === "object" ) {
		let viewMethod = get.View ? "View" : get.Render ? "Render" : get.view ? "view" : "render";
			let compileComponent2Node = get && ( get.View || get.Render || get.view || get.render );
		return compileComponent2Node ? get[ viewMethod ]() : false;
		}
		return '';
	}
	static parseComponent( get, multi ) {
		let finalNode;
		if ( get && get.nodeType ) {
			finalNode = get;
		} else if ( typeof get === "string" ) {
			let compileStr2Node = get.includes( "</" ) || get.includes( "/>" );
			if ( compileStr2Node ) {
				finalNode = _parseString( get );
			} else {
				finalNode = [document.createElement( get )];
			}
		} else if ( typeof get === "function" || typeof get === "object" ) {
			let compileComponent2Node = domClass.getComponentRendered(get);
			if ( compileComponent2Node ) {
				finalNode = _parseString( compileComponent2Node );
			} else {
				finalNode = [_makeNode( typeof get === "function" ? get() : get )];
			}
		}
		return multi ? finalNode : finalNode[0];
	}
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
	sync( { props, content, styling, attrs } ) {
		if ( props ) {
			this.props = props;
		}
		if ( content ) {
			this.vars.content = content;
		}
		if ( styling ) {
			this.vars.styling = styling;
		}
		if ( attrs ) {
			this.vars.attrs = attrs;
		}

		return this;
	}
	setProps( props ) {
		for ( const p in props ) {
			this.props[ p ] = props[ p ];
		}
		return this;
	}
	setEvent( find, eventName, eventFunc ) {
		const __self__ = this;
		const { _node } = this;

		const __eventFunc__ = function( e ) {
			eventFunc.call( __self__, this, e )
		}

		if ( eventFunc && find === null ) {
			_node.addEventListener( eventName, __eventFunc__ );
		} else if ( eventFunc ) {
			find = _node.querySelector( find );
			find.addEventListener( eventName, __eventFunc__ );
		}
		return this;
	}
	createFunction( fn ) {
		fn.call( this );
		return this;
	}
	render() {
		const { _vars, _node, _vnode, _appendStore, _listOfNodes } = this;
		let _vattrs = _vars.attrs;
		let _attrs = attrs( _node );
		let _diff, _diff2;
		if ( _attrs !== _vattrs ) {
			_diff = JSON.parse( _vattrs );
			_diff2 = JSON.parse( _attrs );
			for ( const p in _diff ) {
				_node.setAttribute( p, _diff[ p ] );
			}
			for ( const p in _diff2 ) {
				if ( _diff[ p ] === undefined ) {
					_node.removeAttribute( p );
				}
			}
			_vars.attrs = attrs( _vnode );
		}
		_vattrs = _vars.styling;
		_attrs = _node.style.cssText;
		if ( _vattrs !== _attrs ) {
			this._node.style.cssText = _vattrs;
			_vars.styling = _node.style.cssText;
		}
		_vattrs = _vars.content;
		_attrs = _node.innerHTML;
		for ( let i = 0, idx, len = _listOfNodes.length; i < len; i++ ) {
			idx = _appendStore.length;
			_appendStore[ idx ] = {
				virtual: _listOfNodes[ i ]
				, real: 'append'
				, diff: false
				, index: idx
			}
		}
		if ( _appendStore.length || _attrs !== _vattrs ) {
			_vnode.innerHTML = _vattrs;
			replaceChildrenByDiff( _node, _vnode, _vnode.children, _node.children, _appendStore );
			_vars.content = _vnode.innerHTML;
		}
		return this;
	}
	setNode( node ) {
		this._listOfNodes.push( node );
		return this._quickRender ? this.render() : this;
	}
	setAttrs( _attrs ) {
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
	setStyling( cssText ) {
		const styling = this._vars.styling;
		const style = this._vnode.style;
		style.cssText = styling;
		for ( const p in cssText ) {
			style[ p ] = cssText[ p ];
		}
		this._vars.styling = style.cssText;
		return this._quickRender ? this.render() : this;
	}
	setView( get ) {
		let finalNode = domClass.parseComponent( get );
		if ( finalNode && finalNode.nodeType ) {
			replaceChildrenByDiff( this._node, finalNode, [], [] );
			this._vars.content = finalNode.innerHTML;
			this._vars.styling = finalNode.style.cssText;
			this._vars.attrs = attrs( finalNode );
		}
		return this._quickRender ? this.render() : this;
	}
	setContent( contents ) {
		let content = this._vars.content;
		if ( !contents ) {
			return this._quickRender ? this.render() : this;
		}
		contents = domClass.getComponentRendered(typeof( contents ) === "string" ? contents : contents.nodeType ? contents.outerHTML : contents);
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