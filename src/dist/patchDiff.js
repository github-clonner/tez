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

export function replaceChildrenByDiff(_attrs, _vattrs, _childs, _childs2, substore) {
	const _store = substore || [];
	const _attrs1 = attrs(_attrs);
	const _attrs2 = attrs(_vattrs);
	let i = 0;
	const _max = Math.max(_childs.length, _childs2.length);
	let _attrTag = _attrs.tagName,
	_vattrTag = _vattrs.tagName;
	let _attrCSS = _attrs.style.cssText,
	_vattrCSS = _vattrs.style.cssText;
	let _attrHTML = _attrs.innerHTML,
	_vattrHTML = _vattrs.innerHTML;
	let _isEqualHTML = _attrHTML === _vattrHTML;
	let _isEqualCSS = _attrCSS === _vattrCSS;
	let _isEqualTag = _attrTag === _vattrTag;
	let _isEqualTag8CSS = _isEqualCSS && _isEqualTag;
	let _isEqualAttr = _attrs === _attrs2;
	let item;
	var pi;
	var ni;
	var _tmp;
	let len;
	if (_max) {
		while (i < _max) {
			if (_childs[i] && !_childs2[i]) {
				_store.push({
					index: i,
					diff: false,
					virtual: _childs[i],
					real: 'append'
				});
			} else if (_childs2[i] && !_childs[i]) {
				_store.push({
					index: i,
					diff: false,
					virtual: 'append',
					real: _childs2[i]
				});
			} else if (_childs[i] && !_childs[i].isEqualNode(_childs2[i])) {
				_store.push({
					index: i,
					diff: true,
					virtual: _childs[i],
					real: _childs2[i]
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
					attrs.replaceChild(rr);
				}
			} else if (item.diff) {
				replaceChildrenByDiff(rr, vr, vr.children, rr.children);
			}
		}
	} else if (_isEqualTag && !_isEqualHTML && _isEqualTag8CSS) {
		_attrs.innerHTML = _vattrs.innerHTML;
	} else if (!_isEqualCSS) {
		_attrs.style.cssText = _vattrs.style.cssText;
	} else if (!_isEqualTag) {
		_attrs.parentNode.replaceChild(_vattrs, _attrs);
	} else if (!_isEqualAttr && _isEqualTag8CSS && _isEqualHTML) {
		const _diff = extend(JSON.parse(_attrs2), JSON.parse(_attrs1));
		for (let p in _diff) {
			if (p === "style") {
				continue;
			}
			_attrs.setAttribute(p, _diff[p]);
		}
	}
	return _attrs;
};
