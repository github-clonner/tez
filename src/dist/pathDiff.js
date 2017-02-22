import { attrs } from './attrs';

export function replaceChildrenByDiff( _attrs, _vattrs, _childs, _childs2, substore ) {
	const _store = ( substore || [] )
		.concat( [] );
	const _attrs1 = attrs( _attrs );
	const _attrs2 = attrs( _vattrs );
	if ( substore ) {
		substore.splice( 0, substore.length );
	}
	let i = 0;
	const _max = Math.max( _childs.length, _childs2.length );
	let item;
	var pi;
	var ni;
	var _tmp;
	let len;
	if ( _max ) {
		while ( i < _max ) {
			if ( _childs[ i ] && !_childs2[ i ] ) {
				_store.push( {
					index: i
					, diff: false
					, virtual: _childs[ i ]
					, real: 'append'
				} );
			} else if ( _childs2[ i ] && !_childs[ i ] ) {
				_store.push( {
					index: i
					, diff: false
					, virtual: 'append'
					, real: _childs2[ i ]
				} );
			} else if ( _childs[ i ] && _childs[ i ].isEqualNode( _childs2[ i ] ) ) {
				_store.push( {
					index: i
					, diff: true
					, virtual: _childs[ i ]
					, real: _childs2[ i ]
				} );
			}
			i++;
		}
	}
	if ( _store.length ) {
		let a = 0;
		len = _store.length;
		while ( a < len ) {
			item = _store[ a ]
				, i = item.index;
			let _tmp;
			const pi = i - 1;
			const ni = i + 1;
			const vr = item.virtual;
			const rr = item.real;
			if ( !item.diff && rr === 'append' ) {
				_tmp = _childs2[ ni ];
				if ( _tmp ) {
					_attrs.insertBefore( vr, _tmp );
				} else {
					_attrs.appendChild( vr );
				}
			} else if ( !item.diff && vr === 'append' ) {
				rr.remove();
			} else if ( item.diff ) {
				_tmp = rr;
				replaceChildrenByDiff( rr, vr, vr.children, rr.children );
			}
			a++;
		}
	} else if ( _attrs.innerHTML !== _vattrs.innerHTML ) {
		_attrs.innerHTML = _vattrs.innerHTML;
	} else if ( _attrs.style.cssText !== _vattrs.style.cssText ) {
		_attrs.style.cssText = _vattrs.style.cssText;
	} else if ( _attrs.tagName !== _vattrs.tagName ) {
		_attrs.parentNode.replaceChild( _vattrs, _attrs );
	} else if ( _attrs1 !== _attrs2 ) {
		const _diff = JSON.parse( _attrs );
		for ( const p in _diff ) {
			_attrs.setAttribute( p, _diff[ p ] );
		}
	}
};