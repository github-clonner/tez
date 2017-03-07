import domClass from './domClass';
import {
	_each
}
from './each';

let _arr = Array.prototype;
let _slice = _arr.slice;

class TD {
	constructor(query, context) {
		context = context || document;
		if (!(this instanceof TD)) {
			return new TD(query, context);
		}
		if (query instanceof TD) {
			query = query.get();
		}
		var query = this.query = _slice.call((typeof(query) === "string") ? (query.indexOf("<") === -1 ? context.querySelectorAll(query) : (function () {
						var _div = document.createElement("div");
						_div.innerHTML = query;
						return _div.children;
					}
						())) : query.length && query.push ? query : [query]);

		if (query.length === 0) {
			return this;
		}
		this.domc = [];
		_each(query, function (item, i) {
			this[i] = item;
			this.domc[i] = new domClass(item);
		}, this);
		this.length = query.length;
		return this;
	}
	get() {
		return this.query;
	}
	find(_item) {
		var _p = [];
		this.each(function (item, i) {
			if (item && item.isEqualNode(document.querySelector(_item))) {
				_p = _p.concat([item]);
			} else if (item.querySelectorAll(_item)) {
				_p = _p.concat(_slice.call(item.querySelectorAll(_item)));
			}
		});
		_each(this.query, function (item, i) {
			delete this[i];
			delete this.domc[i];
			delete this.query[i];
		}, this);
		_each(_p, function (item, i) {
			this[i] = item;
			this.domc[i] = new domClass(item);
		}, this);
		this.length = _p.length;
		return this;
	}
	parent(parent) {
		return this.each(function (item, i) {
			if (parent && item.parentNode) {
				while (item.parentNode !== parent) {
					item = item.parentNode;
				}
				this[i] = item;
			} else {
				this[i] = item.parentNode || item;
			}
		});
	}
	each(fn) {
		var _ok = this.length;
		if (!_ok)
			return this;
		_each(this, fn, this);
		return this.virtualsync();
	}
	domEach(fn) {
		var _ok = this.domc.length;
		if (!_ok)
			return this;
		_each(this.domc, fn, this);
		return this;
	}
	virtualsync() {
		return this.domEach(function (item) {
			item && item.sync();
		});
	}
	attr(name, value) {
		if (typeof(name) === "string") {
			if (typeof(value) === "string") {
				return this.domEach(function setAttrs(item) {
					item.setAttrs(Object.defineProperty({}, name, {
							value: value
						}));
				});
			} else {
				return this[0].getAttribute(name);
			}
		} else if (typeof(name) === "object") {
			return this.domEach(function setAttrs(item) {
				item.setAttrs(name);
			});
		}
		return this;
	}
	css(name, value) {
		if (typeof(name) === "string") {
			if (typeof(value) === "string") {
				return this.domEach(function setStyling(item) {
					item.setStyling(Object.defineProperty({}, name, {
							value: value
						}));
				});
			} else {
				return this[0].getAttribute(name);
			}
		} else if (typeof(name) === "object") {
			return this.domEach(function setStyling(item) {
				item.setStyling(name);
			});
		}
		return this;
	}
	on(ev, fn) {
		return this.each(function (item) {
			item.addEventListener(ev, fn);
		});
	}
	off(ev, fn) {
		return this.each(function (item) {
			item.removeEventListener(ev, fn);
		});
	}
	laggy(fn, ms) {
		var _self = this;
		if (!fn)
			return this;
		setTimeout(function () {
			fn.call(_self);
		}, ms || 50);
		return this;
	}
	empty() {
		return this.each(function (item) {
			item.innerHTML = '';
		});
	}
	html(value) {
		if (value !== undefined) {
			return this.domEach(function (item, i) {
				item && item.setContent(value);
			});
		} else {
			return this[0].innerHTML;
		}
	}
	text(value) {
		if (value !== undefined) {
			return this.domEach(function (item, i) {
				item && item.setContent(value);
			});
		} else {
			return this[0].textContent || this[0].innerText;
		}
	}
	append(html) {
		return this.virtualsync().domEach(function (item) {
			item && item.setCustom(function (node) {
				if (typeof(html) === "string") {
					node.innerHTML += html;
				} else if (html && html.nodeType) {
					node.appendChild(html);
				}
			});
		})

	}
	appendTo(html) {
		var $html = $(html);
		return this.each(function (item) {
			$html.append(item);
		});
	}
	prependTo(html) {
		var $html = $(html);
		return this.each(function (item) {
			$html.prepend(item);
		});
	}
	prepend(html) {
		return this.virtualsync().domEach(function (item) {
			item.setCustom(function (node) {
				if (typeof(html) === "string") {
					node.innerHTML = html + node.innerHTML;
				} else if (html && html.nodeType) {
					throw new Error("Prepend for some reason doesn't support now yet");
				}
			});
		})

	}
	remove() {
		return this.each(function (item, i) {
			item.parentNode.removeChild(item);
		})
		.virtualsync();
	}
};
export default TD;
