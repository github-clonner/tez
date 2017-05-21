export default function _getItem ( item, parent ) {
	if ( item.isEqualNode( parent ) ) {
		return item;
	}
	const childs = [... parent.children ];
	let i = 0;
	let _match;
	let _parentWhile;
	let _matchInsideWhile;
	if ( childs.length ) {
		while ( i < childs.length ) {
			if ( childs[ i ] && childs[ i ].isEqualNode( item ) ) {
				_match = childs[ i ];
				_parentWhile = parent;
				break;
			} else if ( _matchInsideWhile = _getItem( item, _parentWhile = childs[ i ] ) ) {
				_match = _matchInsideWhile;
				break;
			}
			i++
		}
	} else if ( item.isEqualNode( parent ) ) {
		_match = parent;
	}
	if ( _match ) {
		return {
			matched: _match
			, matchParent: _parentWhile
		}
	}
	return null;
}