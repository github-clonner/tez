export default function makeNode (opts) {
	if ( !opts || !opts.tag )
		return;
	const {
		tag
		, css
		, content
		, attr
	} = opts;
	const _tag = document.createElement( tag );
	if ( css ) {
		_tag.style.cssText = css;
	}
	if ( content ) {
		_tag.innerHTML = content;
	}
	if ( attr ) {
		for ( let p in attr ) {
			_tag.setAttribute( p, attr[ p ] );
		}
	}
	return _tag;
};