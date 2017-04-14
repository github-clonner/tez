import {
	attrs
}
from './attrs';
import {
	extend
}
from './extend';
import {
	_getItem
}
from './getItem';

const HTMLSyntaxTags = new RegExp("&lt;|&gt;|/>|<|>", "g");

export function replaceChildrenByDiff(_attrs, _vattrs, _childs = [], _childs2 = [], _store = []) {
	if ( !_attrs || !_vattrs) {
		return null;
	}
	const _attrs1 = attrs(_attrs);
	const _attrs2 = attrs(_vattrs);
	let i = 0;
	const _max = Math.max(_childs.length, _childs2.length);
	let _attrTag = _attrs.tagName,
	_vattrTag = _vattrs.tagName;
	let _isNT = _attrs.nodeType,
		_isVNT = _vattrs.nodeType,
		_isTN = _isNT === 3,
		_isVTN = _isVNT === 3;
	let _attrCSS = _attrs && _attrs.style && _attrs.style.cssText,
	_vattrCSS = _vattrs && _vattrs.style && _vattrs.style.cssText;
	let _attrHTML = _attrs.innerHTML,
	_vattrHTML = _vattrs.innerHTML;
	let _isEqualHTML = _attrHTML === _vattrHTML;
	let _isEqualCSS = _attrCSS === _vattrCSS;
	let _isEqualTag = _attrTag === _vattrTag;
	let _isEqualTag8CSS = _isEqualCSS && _isEqualTag;
	let _isEqualTextNode = _isTN === true && (_isTN === _isVTN);
	let _isEqualAttr = _attrs === _attrs2;
	let item;
	var pi;
	var ni;
	var _tmp;
	let len;
	let itemReal, itemVirtual;
	if (_max) {
		while (i < _max) {
			itemVirtual = _childs[i];
			itemReal = _childs2[i];
			if (itemVirtual && !itemReal) {
				_store.push({
					index: i,
					diff: false,
					virtual: itemVirtual,
					real: 'append'
				});
			} else if (itemReal && !_childs[i]) {
				_store.push({
					index: i,
					diff: false,
					virtual: 'append',
					real: itemReal
				});
			} else if (itemVirtual && itemVirtual.isEqualNode(itemReal) === false) {
				_store.push({
					index: i,
					diff: true,
					virtual: itemVirtual,
					real: itemReal
				});
			}
			i++;
		}
	}
	if (_store.length) {
		let a = 0;
		let _tmp;
		while (item = _store.shift()) {
			i = item.index;
			const pi = i - 1;
			const ni = i + 1;
			const vr = item.virtual;
			const rr = item.real;
			if (!item.diff && rr === 'append') {
				_tmp = _childs2[ni];
				if (_tmp) {
					_attrs.insertBefore(vr, _tmp);
				} else {
					_attrs.appendChild(vr);
				}
			} else if (!item.diff && vr === 'append') {
				if (rr.remove !== undefined) {
					rr.remove();
				} else {
					_attrs.removeChild(rr);
				}
			} else if (item.diff) {
				if (rr.tagName === undefined || vr.tagName === undefined || rr.tagName !== vr.tagName) {
				_attrs.replaceChild(vr, rr);
				} else {
				replaceChildrenByDiff(rr, vr, vr.childNodes, rr.childNodes);
				}
			}
		}
	} else if (_isEqualTextNode && _attrs.value !== _vattrs.value) {
		_attrs.value = _vattrs.value;
	} else if (!_isEqualTag && _attrs.parentNode !== null && _vattrs && _vattrs.nodeType) {
		_attrs.parentNode.replaceChild(_vattrs, _attrs);
	} else if (!_isEqualAttr && _isEqualTag8CSS && _isEqualHTML) {
		const _diff = extend(JSON.parse(_attrs2), JSON.parse(_attrs1));
		for (let p in _diff) {
			if (p === "style") {
				continue;
			}
			_attrs.setAttribute(p, _diff[p]);
		}
	} else if (HTMLSyntaxTags.test(_vattrHTML) && _attrHTML !== _vattrHTML) {
		if (_attrs.childNodes && _attrs.childNodes.length) {
			replaceChildrenByDiff(_attrs, _vattrs, _vattrs.childNodes, _attrs.childNodes);
		} else if (_attrs.isEqualNode(_vattrs)) {
			_attrs.innerHTML = _vattrs.innerHTML;
		} else {
			_attrs.parentNode.replaceChild(_vattrs, _attrs);
		}
		// maybe later...
	} else {
		if (_attrs.textContent) {
			_attrs.textContent = _vattrs.textContent;
		} else {
			_attrs.innerText = _vattrs.innerText;
		}
	}
	return _attrs;
};

