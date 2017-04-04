export function attrs(a) {
	if ( !a )
		return {};
	const _a = {};
	const { attributes } = a;
	for ( let i = 0, atr, len = attributes.length; i < len; i++ ) {
		atr = attributes[ i ];
		if (atr.value) {
		_a[ atr.name ] = atr.value;
		}
	}
	return JSON.stringify( _a );
};