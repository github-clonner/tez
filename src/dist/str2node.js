import { ARRAY_SLICE } from './configs';

const _tmpDiv = document.createElement( "div" );
export function _parseString (str) {
	if ( !str ) {
		return [];
	};
	_tmpDiv.innerHTML = str;
	return ARRAY_SLICE.call( _tmpDiv.children );
};