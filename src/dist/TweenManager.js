let TweenManager = ( a, b ) => {
	const _isFunc = typeof( b ) === "function";
	const _isArray = b && b.push && b.slice;
	const _isObj = ( !_isArray && typeof( b ) === "object" );
	const _isNum = ( !_isArray && !_isObj ) && typeof( b ) === "number";
	const _isStr = !_isNum && typeof( b ) === "string";
	const _obj = {};
	let _arr = [];
	const _num = 0;
	return t => {
		if ( _isFunc ) {
			return b( t );
		} else if ( _isArray ) {
			return ( _arr = b.map( ( v2, i ) => {
				if ( typeof v2 === "number" ) {
					return a[ i ] + ( v2 - a[ i ] ) * t;
				} else if ( typeof v2 === "function" ) {
					return v2( t );
				}
			} ) );
		} else if ( _isObj ) {
			for ( const p in b ) {
				if ( typeof b[ p ] === "number" ) {
					_obj[ p ] = a[ p ] + ( b[ p ] - a[ p ] ) * t;
				} else if ( typeof b[ p ] === "function" ) {
					_obj[ p ] = b[ p ]( t );
				}
			}
			return _obj;
		} else if ( _isNum ) {
			return a + ( b - a ) * t;
		}
	}
};

export default TweenManager;