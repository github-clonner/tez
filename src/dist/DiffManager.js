let DiffManager = function DiffManager(a, b) {
	if ( ( a && b ) && ( !a.nodeType && !b.nodeType ) && typeof a === "object" && typeof b === "object" ) {
		const _keys = ( b && b.push && b.slice ? b : b && Object.keys( b ) ) || [];
		const _keysA = ( a && a.push && a.slice ? a : a && Object.keys( a ) ) || [];
		let i = 1;
		let _diff = {};
		const _len = _keys && _keys.length;
		const _extract = ( ( a && _keys.length || 0 ) > ( b && _keysA.length || 0 ) ? b : a ) || _diff;
		if ( _keys.length || _keysA.length ) {
			for ( let p in _extract ) {
				if ( DiffManager( a[ p ], b[ p ] ) ) {
					_diff[ p ] = [ a[ p ], b[ p ] ];
					i++;
				}
			}
		}
		return Object.keys( _diff )
			.length ? _diff : i > 1;
	} else {
		return a !== b && [ a, b ];
	}
};

export default DiffManager;