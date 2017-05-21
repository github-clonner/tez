import { ROOT } from './configs';

const document = ROOT.document;

const _tmpDiv = document !== undefined ? document.createElement( "div" ) : false;
export default function _parseString (str) {
	if ( !str || !_tmpDiv ) {
		return [];
	};
	_tmpDiv.innerHTML = str;
	return Array.from(_tmpDiv.children);
};
