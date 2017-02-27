import { ARRAY_SLICE, ROOT } from './configs';

const document = ROOT.document;

const _tmpDiv = document !== undefined ? document.createElement( "div" ) : false;
export function _parseString (str) {
	if ( !str || !_tmpDiv ) {
		return [];
	};
	_tmpDiv.innerHTML = str;
	return ARRAY_SLICE.call( _tmpDiv.children );
};
