/*!
 * @name Tez.js
 * @description Lightweight, Flexible, Fast, Memory and Power Effecient Animation, Function and Class Manager
 * @version v2.3.1.0
 * @author @dalisoft (https://github.com/dalisoft)
 * @license Apache 2.0
 */

(((root, factory) => {
		if (typeof define === "function") {
			define([], () => factory.call(root));
		} else if (typeof module !== "undefined") {
			module.exports = factory.call(root);
		} else {
			root.Tez = factory.call(root);
		}
	})
	(this, function (undefined) {
		var Tez = {};

		/*
		@constructor Worker
		@description Use worker
		 */
		let ROOT = this;

		let MAX_WORKER_THREAD = 2;
		let CURRENT_WORKER_THREAD = 0;
		let LIST_WORKER_THREAD = [];
		let ARRAY_SLICE = [].slice;
		let FUNC_STR = Function.toString;
		let WORKER_SUPPORT = ROOT.Worker !== undefined;

		const setWorker = function (force) {
			this._force = force;
			this._worker = null;
			this._id = 0;
			return this;
		};
		if (WORKER_SUPPORT) {
			var p = setWorker.prototype = {
				createBlob(fn) {
					return new Worker(
						window.URL.createObjectURL(
							new Blob([
`self.onmessage = function(wrk) {var f = ${FUNC_STR.call(fn)};self.postMessage(f.apply(this, wrk.data));};`
								], {
								type: 'text/javascript'
							})))
				},
				call(fn) {
					if (this._id >= MAX_WORKER_THREAD && this._force) {
						LIST_WORKER_THREAD.shift()
						.close();
					}
					this._fnc = fn;
					this._worker = this.createBlob(fn);
					this._id++;
					LIST_WORKER_THREAD.push(this);
					return this;
				},
				get() {
					return this._val;
				},
				done(fn) {
					const curr = this;
					this._worker.addEventListener('message', e => {
						if (e.data === undefined)
							return;
						curr._val = fn.call(curr._worker, {
								data: e.data
							});
					});
				},
				run() {
					const args = ARRAY_SLICE.call(arguments);
					this._worker.postMessage(args);
					this._val = args[0];
					return this;
				},
				close() {
					this._worker && this._worker.destroy();
					return this;
				}
			};
		} else {
			console.log('Tez [FunctionManager]: Worker isn\'t supported');
		}

		/*
		@constructor RAF
		@description Use RAF
		 */
		const RAF_CALLS = [];

		const RAF_UPDATE = ((win => {
				win.requestAnimationFrame = win.requestAnimationFrame || (fn => win.setTimeout(fn, 50 / 3));
				win.cancelAnimationFrame = win.cancelAnimationFrame || (fn => win.clearTimeout(fn));
				const _run = "RUNNING";
				let _tick;
				_tick = function update() {
					let i = 0;
					while (i < RAF_CALLS.length) {
						const raf = RAF_CALLS[i];
						if (raf.loop) {
							raf._val = raf.args ? raf.render(...raf.args) : raf.render.call(raf);
							raf.loop = raf._val === _run;
						} else if (raf.run && (!raf.rendered && !raf._destroy)) {
							if (raf.args) {
								raf._val = raf.render(...raf.args);
							} else {
								raf._val = raf.render.call(raf);
							}
							if (raf._val === _run) {
								raf.loop = true;
							}
							raf.rendered = true;
						} else if (raf.run) {
							RAF_CALLS.splice(i, 1);
						}
						i++
					}
					if (RAF_CALLS.length) {
						_tick = win.requestAnimationFrame(update);
					} else {
						win.cancelAnimationFrame(_tick);
					}
				};
				return {
					add(item) {
						const _item = {
							_destroy: false,
							message(last) {
								const old = this.render,
								curr = this,
								self = this.self;
								this.render = function () {
									return (curr._val = last.call(curr, {
												data: (curr._val = old.apply(curr, ARRAY_SLICE.call(arguments)))
											}));
								}
							},
							get() {
								return this._val || this.args && this.args[0];
							},
							destroy() {
								this._destroy = true;
							},
							args: null,
							rendered: false,
							render: item,
							run: false
						};
						RAF_CALLS.push(_item);
						win.requestAnimationFrame(_tick);
						return _item;
					},
					destroy(item) {
						const match = [].concat(RAF_CALLS)
						.filter(item2 => item2.render === item);
						if (!match)
							return;
						const i = RAF_CALLS.indexOf(match[0]);
						if (i > -1) {
							RAF_CALLS.splice(i, 1);
						}
					}
				};
			})
			(this));

		const setRAF = function () {
			this._raf = null;
			return this;
		};
		var p = setRAF.prototype = {
			call(fn) {
				this._raf = RAF_UPDATE.add(fn);
				this._raf.self = this;
				this._val = this._raf._val;
				return this;
			},
			get() {
				return this._raf.get();
			},
			done(fn) {
				this._raf.message(fn);
				this._val = this._raf._val;
				return this;
			},
			run() {
				this._raf.args = ARRAY_SLICE.call(arguments);
				this._raf.run = true;
				this._val = this._raf._val;
				return this;
			},
			close() {
				RAF_UPDATE.destroy(this._raf);
				return this;
			}
		};

		const setFn = function () {
			this._fn = null;
			return this;
		};
		var p = setFn.prototype = {
			call(fn) {
				this._fn = fn;
				return this;
			},
			get() {
				return this._val;
			},
			done(fn) {
				const _oldFn = this._fn;
				const curr = this;
				this._fn = function () {
					const args = ARRAY_SLICE.call(arguments);
					return fn.call(curr, {
						data: (curr._val = _oldFn.apply(curr, args))
					});
				};
				return this;
			},
			run(a) {
				const args = a !== undefined ? ARRAY_SLICE.call(arguments) : [];
				this._val = args.length ? this._fn(...args) : this._fn.call(this);
				return this;
			},
			close() {
				this._fn = null;
				return this;
			}
		};

		/*
		@constructor Tez
		@description Main function
		 */
		var Tez = {
			FunctionManager(fnc, mode) {
				this._mode = (mode === "Worker" && WORKER_SUPPORT) ? new setWorker(true) : mode === "raf" ? new setRAF(true) : new setFn(true);
				this.m = this._mode.call(fnc);
				return this;
			},
			PluginManager: {},
			extend(a = {}, b = {}) {
				for (const p in b) {
					if (a[p] === undefined && b[p] !== undefined) {
						a[p] = b[p];
					}
				}
				return a;
			}
		};
		Tez.FunctionManager.prototype = {
			onMessage(fn) {
				const c = this;
				this.m.done(e => fn.call(c.m, e.data));
				return this;
			},
			plugin(plug) {
				if (typeof plug === "string" && Tez.PluginManager[plug] !== undefined && Tez.PluginManager[plug].fnMgr !== undefined) {
					this.m = Tez.PluginManager[plug].fnMgr.call(this, this.m);
				}
				return this;
			},
			get() {
				return this.m.get();
			},
			run(a) {
				const args = a !== undefined ? ARRAY_SLICE.call(arguments) : [];
				if (!args.length)
					return this;
				this.m.run(...args);
				return this;
			}
		};
		Tez.CompositeManager = (draw, args) => new Tez.FunctionManager(draw, "raf")
		.run(args);
		Tez.LogicManager = (fn, args) => new Tez.FunctionManager(fn, "Worker")
		.run(args);
		Tez.CallManager = (fn, args) => new Tez.FunctionManager(fn)
		.run(args);
		Tez.DOMManager = function (node) {
			this.node = node;
			return this;
		};
		Tez.TweenManager = (a, b) => {
			const _isFunc = typeof(b) === "function";
			const _isArray = b && b.push && b.slice;
			const _isObj = (!_isArray && typeof(b) === "object");
			const _isNum = (!_isArray && !_isObj) && typeof(b) === "number";
			const _isStr = !_isNum && typeof(b) === "string";
			const _obj = {};
			let _arr = [];
			const _num = 0;
			return t => {
				if (_isFunc) {
					return b(t);
				} else if (_isArray) {
					return (_arr = b.map((v2, i) => {
								if (typeof v2 === "number") {
									return a[i] + (v2 - a[i]) * t;
								} else if (typeof v2 === "function") {
									return v2(t);
								}
							}));
				} else if (_isObj) {
					for (const p in b) {
						if (typeof b[p] === "number") {
							_obj[p] = a[p] + (b[p] - a[p]) * t;
						} else if (typeof b[p] === "function") {
							_obj[p] = b[p](t);
						}
					}
					return _obj;
				} else if (_isNum) {
					return a + (b - a) * t;
				}
			}
		};
		Tez.DiffManager = function _rdh(a, b) {
			if ((a && b) && (!a.nodeType && !b.nodeType) && typeof a === "object" && typeof b === "object") {
				const _keys = (b && b.push && b.slice ? b : b && Object.keys(b)) || [];
				const _keysA = (a && a.push && a.slice ? a : a && Object.keys(a)) || [];
				let i = 1;
				const _diff = {};
				const _len = _keys && _keys.length;
				const _extract = ((a && _keys.length || 0) > (b && _keysA.length || 0) ? b : a) || _diff;
				if (_keys.length || _keysA.length) {
					for (const p in _extract) {
						if (_rdh(a[p], b[p])) {
							_diff[p] = [a[p], b[p]];
							i++;
						}
					}
				}
				return Object.keys(_diff)
				.length ? _diff : i > 1;
			} else {
				return a !== b && [a, b];
			}
		};
		Tez.DOMManager.prototype = {
			getNode() {
				return this.node;
			},
			logic(fn) {
				this._logic = new Tez.LogicManager(fn);
				return this;
			},
			logicArg(arg) {
				this._logic.run.call(this._logic, arg);
				return this;
			},
			logicMsg(fn) {
				this._logic && this._logic.onMessage(fn.call(this, this.node));
				return this;
			},
			getLogic() {
				return this._logic;
			},
			composite(fn) {
				this._composite = new Tez.CompositeManager(fn.bind(this));
				return this;
			},
			compositeArg(arg) {
				this._composite.run.call(this._composite, arg);
				return this;
			},
			compositeMsg(fn) {
				this._composite && this._composite.onMessage(fn.call(this, this.node));
				return this;
			},
			getComposite() {
				return this._composite;
			}
		};
		const attrs = a => {
			if (!a)
				return {};
			const _a = {};
			const attributes = a.attributes;
			for (let i = 0, atr, len = attributes.length; i < len; i++) {
				atr = attributes[i];
				_a[atr.name] = atr.value;
			}
			return JSON.stringify(_a);
		};
		const _getItem = function _giw(item, parent) {
			if (item.isEqualNode(parent)) {
				return item;
			}
			const childs = ARRAY_SLICE.call(parent.children);
			let i = 0;
			let _match;
			let _parentWhile;
			let _matchInsideWhile;
			if (childs.length) {
				while (i < childs.length) {
					if (childs[i] && childs[i].isEqualNode(item)) {
						_match = childs[i];
						_parentWhile = parent;
						break;
					} else if (_matchInsideWhile = _giw(item, _parentWhile = childs[i])) {
						_match = _matchInsideWhile;
						break;
					}
					i++
				}
			} else if (item.isEqualNode(parent)) {
				_match = parent;
			}
			if (_match) {
				return {
					matched: _match,
					matchParent: _parentWhile
				}
			}
			return null;
		};
		const replaceChildrenByDiff = function _rchd(_attrs, _vattrs, _childs, _childs2, substore) {
			const _store = (substore || []).concat([]);
			const _attrs1 = attrs(_attrs);
			const _attrs2 = attrs(_vattrs);
			if (substore) {
				substore.splice(0, substore.length);
			}
			let i = 0;
			const _max = Math.max(_childs.length, _childs2.length);
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
					} else if (_childs[i] && _childs[i].isEqualNode(_childs2[i])) {
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
				len = _store.length;
				while (a < len) {
					item = _store[a],
					i = item.index;
					let _tmp;
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
						rr.remove();
					} else if (item.diff) {
						_tmp = rr;
						_rchd(rr, vr, vr.children, rr.children);
					}
					a++;
				}
			} else if (_attrs.innerHTML !== _vattrs.innerHTML) {
				_attrs.innerHTML = _vattrs.innerHTML;
			} else if (_attrs.style.cssText !== _vattrs.style.cssText) {
				_attrs.style.cssText = _vattrs.style.cssText;
			} else if (_attrs.tagName !== _vattrs.tagName) {
				_attrs.parentNode.replaceChild(_vattrs, _attrs);
			} else if (_attrs1 !== _attrs2) {
				const _diff = JSON.parse(_attrs);
				for (const p in _diff) {
					_attrs.setAttribute(p, _diff[p]);
				}
			}
		};
		const _tmpDiv = document.createElement("div");
		const _parseString = str => {
			if (!str) {
				return [];
			};
			_tmpDiv.innerHTML = str;
			return ARRAY_SLICE.call(_tmpDiv.children);
		};
		const _makeNode = opts => {
			if (!opts || !opts.tag)
				return;
			const {
				tag,
				css,
				content,
				attr
			} = opts;
			const _tag = document.createElement(tag);
			if (css) {
				_tag.style.cssText = css;
			}
			if (content) {
				_tag.innerHTML = content;
			}
			if (attr) {
				for (let p in attr) {
					_tag.setAttribute(p, attr[p]);
				}
			}
			return _tag;
		};
		Tez.createElement = _makeNode;

		var p = Tez.XHR = function (opts = {}) {
			this._xhr = new XMLHttpRequest();
			const xhr = this;
			if (opts.load) {
				xhr.on('load', opts.load);
			}
			if (opts.url) {
				xhr.request(opts.method || "GET", opts.url, opts.async);
				xhr.send(opts.params);
			}
			if (opts.events) {
				opts.events.map(event => {
					xhr.on(event.name, event.callback);
				});
			}
			return this;
		};
		p.prototype = {
			on(ev, fn) {
				this._xhr.addEventListener(ev, fn);
				return this;
			},
			withCredentials(state) {
				this._xhr.withCredentials = state !== undefined ? state : false;
				return this;
			},
			off(ev, fn) {
				this._xhr.removeEventListener(ev, fn);
				return this;
			},
			request(method, url, async) {
				this._xhr.open(method, url, async);
				return this;
			},
			send(params) {
				if (params) {
					this._xhr.send(params);
				} else {
					this._xhr.send();
				}
				return this;
			}
		};
		p = Tez.hashURL = function (opts = {}) {
			this._prefix = opts.prefix || "!/#";
			this._hashTags = true;
			this._changed = false;
			return this;
		};
		p.prototype = {
			getHash(hash) {
				return this._prefix + hash;
			},
			getLocationHash() {
				return window.location.hash.substr(1);
			},
			getChanged() {
				return this._changed;
			},
			setHash(hash) {
				if (this.getHash(hash) !== this.getLocationHash()) {
					window.location.hash = this.getHash(hash);
					this._changed = true;
				} else {
					this._changed = false;
				}
				return this;
			},
			set(url) {
				return this.setHash(url);
			}
		};
		p = Tez.URLComponent = function (opts = {}) {
			this.hash = new Tez.hashURL({
					prefix: opts.prefixURL
				});
			this.async = opts.async !== undefined ? opts.async : true;
			this.xhr = new Tez.XHR();
			this.loadRealLink = opts.loadRealLink !== undefined ? opts.loadRealLink : true;
			return this;
		};
		p.prototype = {
			request(url, method, withCredentials) {
				this.hash.set(url);
				if (this.loadRealLink) {
					this.xhr.request(method || "GET", url, this.async);
					this.xhr.withCredentials(withCredentials);
					this.xhr.send();
				}
				return this;
			},
			then(fn) {
				if (this.loadRealLink && this.hash.getChanged()) {
					const __self__ = this.xhr;
					const __self__hash__ = this.hash;
					let __eventFunc__;
					this.xhr.on('load', __eventFunc__ = function () {
						const args = ARRAY_SLICE.call(arguments);
						if (__self__hash__.getChanged()) {
							fn.apply(this, args);
							__self__.off('load', __eventFunc__);
						}
					});
				} else if (this.hash.getChanged()) {
					fn.call(this, {
						onlyURLChanged: true
					});
				}
				return this;
			}
		};
		Tez.domClass = function (node, vars) {
			this._vars = vars = vars || {};
			if (vars.quickRender === undefined) {
				vars.quickRender = true;
			}
			const _opts = this._opt = {};
			this._node = typeof(node) === "string" ? document.querySelector(node) : node.length && node[0].nodeType ? node[0] : node;
			this._vnode = this._node.cloneNode(true);
			this._nodeElem = this._vnode;
			this._quickRender = vars.quickRender;
			this._appendStore = [];
			this.props = {};
			this._listOfNodes = [];
			if (vars.styling === undefined) {
				vars.styling = this._vnode.style.cssText;
			}
			if (vars.attrs === undefined) {
				vars.attrs = attrs(this._vnode);
			}
			if (vars.content === undefined) {
				vars.content = this._vnode.innerHTML;
			}
			return this.render();
		};
		Tez.domClass.prototype = {
			createElement(opts) {
				let item;
				const appendStore = this._appendStore;
				const len = appendStore.length;
				appendStore[len] = {
					real: 'append',
					virtual: (item = _makeNode(opts)),
					diff: false,
					index: len
				};
				return item;
			},
			setProps(props) {
				for (const p in props) {
					this.props[p] = props[p];
				}
				return this;
			},
			setEvent(find, eventName, eventFunc) {
				const __self__ = this;

				const __eventFunc__ = function (e) {
					eventFunc.call(__self__, this, e)
				};

				if (eventFunc && find === null) {
					this._node.addEventListener(eventName, __eventFunc__);
				} else if (eventFunc) {
					find = this._node.querySelector(find);
					find.addEventListener(eventName, __eventFunc__);
				}
				return this;
			},
			createFunction(fn) {
				fn.call(this);
				return this;
			},
			render() {
				const vars = this._vars;
				const node = this._node;
				const vnode = this._vnode;
				const append = this._appendStore;
				const _listOfNodes = this._listOfNodes;
				let _vattrs = vars.attrs;
				let _attrs = attrs(node);
				let _diff;
				if (_attrs !== _vattrs) {
					_diff = JSON.parse(_vattrs);
					for (const p in _diff) {
						node.setAttribute(p, _diff[p]);
					}
					vars.attrs = attrs(vnode);
				}
				_vattrs = vars.styling;
				_attrs = node.style.cssText;
				if (_vattrs !== _attrs) {
					this._node.style.cssText = _vattrs;
					vars.styling = node.style.cssText;
				}
				_vattrs = vars.content;
				_attrs = node.innerHTML;
				for (let i = 0, len = _listOfNodes.length; i < len; i++) {
					const idx = append.length;
					append[idx] = {
						virtual: _listOfNodes[i],
						real: 'append',
						diff: false,
						index: idx
					}
				}
				if (append.length || _attrs !== _vattrs) {
					const _childs = _parseString(_vattrs);
					const _childs2 = _parseString(_attrs);
					replaceChildrenByDiff(node, vnode, _childs, _childs2, append);
					vars.content = vnode.innerHTML;
				}
				return this;
			},
			setNode(node) {
				this._listOfNodes.push(node);
				return this._quickRender ? this.render() : this;
			},
			setAttrs(_attrs) {
				let attr;
				const nattr = {};
				const _attr = JSON.parse(this._vars.attrs);
				for (var p in _attr) {
					if (_attr[p] !== undefined) {
						nattr[p] = _attr[p];
					}
				}
				for (var p in _attrs) {
					if (_attrs[p] !== undefined) {
						nattr[p] = _attrs[p];
					}
				}
				this._vars.attrs = JSON.stringify(nattr);
				return this._quickRender ? this.render() : this;
			},
			setStyling(cssText) {
				const styling = this._vars.styling;
				const style = this._vnode.style;
				style.cssText = styling;
				for (const p in cssText) {
					style[p] = cssText[p];
				}
				this._vars.styling = style.cssText;
				return this._quickRender ? this.render() : this;
			},
			setContent(contents) {
				let content = this._vars.content;
				if (!contents) {
					return this._quickRender ? this.render() : this;
				}
				contents = typeof(contents) === "string" ? contents : contents.nodeType ? contents.outerHTML : contents;
				const rel = contents.includes("=") ? contents.charAt(0) === "+" ? 1 : contents.charAt(0) === "-" ? -1 : 0 : 0;

				if (rel === 0) {
					content = contents;
				} else if (rel === 1) {
					content += contents.substr(2);
				} else if (rel === -1) {
					const _getParsed = _parseString(contents.substr(2))[0];
					const _find = _getItem(_getParsed, this._node);
					if (_find && _find.matched) {
						this._appendStore.push({
							virtual: _find.matched,
							real: 'append',
							remove: true
						});
					}
				}

				this._vars.content = content;
				return this._quickRender ? this.render() : this;
			}
		};
		Tez.tezClass = function (opts) {
			const _self = this;
			this.events = {};
			opts = Tez.extend(opts || {}, {
					lets: {},
					lets2: {},
					_lets: {},
					tweenable: {},
					state: 0,
					render: null
				});

			opts.setInitLets && opts.setInitLets.call(opts);
			opts.setTweenableLets && opts.setTweenableLets.call(opts);

			this.mountedNodes = [];

			this.opts = opts;

			this.lets = opts.lets;
			this.lets2 = opts.lets2;
			return this;
		};
		const getDecPow = (d = 4) => 10 ** d;
		Tez.tezClass.prototype = {
			plugin(plug) {
				if (typeof plug === "string" && Tez.PluginManager[plug] !== undefined && Tez.PluginManager[plug].tez !== undefined) {
					Tez.PluginManager[plug].tez.call(this, this.lets, this.opts);
				}
				return this;
			},
			apply() {
				const {
					opts
				} = this;
				const {
					lets,
					lets2,
					_lets
				} = opts;
				const _minVal = 0.001;
				const _maxVal = 1;
				this.mountedNodes.map((node, index) => {
					const dom = new Tez.DOMManager(node);
					const now = Date.now();
					const {
						render,
						tweenable
					} = opts;
					const round = tweenable.roundLets;
					const limitDec = tweenable.limitLetsDecimals;
					const start = tweenable && (typeof(tweenable.startTime) === "function" ? tweenable.startTime.call(_self, node, index) : tweenable.startTime) || 0;
					const dur = tweenable && (typeof(tweenable.duration) === "function" ? tweenable.duration.call(_self, node, index) : tweenable.duration) || 1000;
					const tween = Tez.TweenManager(lets, lets2);
					let diff;

					if (tweenable) {
						diff = Tez.DiffManager(lets, lets2);
						dom.composite(e => {
							if (!diff)
								return e.state;
							let elapsed = Math.max(0, Math.min(((Date.now() - now) - start) / dur, 1));
							let timeElapsed = elapsed;
							if (tweenable.curve) {
								elapsed = tweenable.curve(timeElapsed);
							}
							_lets = tween(elapsed);
							for (let p in _lets) {
								if (round && round[p]) {
									_lets[p] = typeof(_lets[p]) === "number" ? (_lets[p] | 0) : _lets[p] !== undefined && _lets[p].push && _lets[p].slice ? _lets[p].map(Math.round) : _lets[p];
								} else if (limitDec && limitDec[p]) {
									let dv = getDecPow(limitDec[p]);
									_lets[p] = typeof(_lets[p]) === "number" ? (((_lets[p] * dv) | 0) / dv) : _lets[p] !== undefined && _lets[p].push && _lets[p].slice ? _lets[p].map(v => ((v * dv) | 0) / dv) : _lets[p];
								}
							}
							if (timeElapsed > _minVal) {
								render.call(_self, node, _lets, opts, index, elapsed);
							}
							return timeElapsed < _maxVal ? e.state : 0;
						})
						.compositeArg({
							state: opts.state || "RUNNING"
						});
					} else if (opts.initState) {
						render.call(_self, node, lets, opts, index, elapsed);
					}
				});
				return this;
			},
			render(_lets, leaveLet) {
				const _self = this;
				const opts = this.opts;
				_lets = _lets || opts.lets;
				const dm = Tez.DiffManager(opts.lets, _lets);
				if (!dm)
					return this;
				this.mountedNodes.map((node, index) => {
					opts.render.call(_self, node, _lets || opts.lets, opts, index);
				});
				if (!leaveLet) {
					opts.lets = _lets;
				}
				return this;
			},
			mountNode(node) {
				node = ARRAY_SLICE.call(typeof(node) === "string" ? document.querySelectorAll(node) : node.length ? node : [node]);
				this.mountedNodes = this.mountedNodes.concat(node);
				return this;
			},
			nodeOn(event, on) {
				this.mountedNodes.map(node => {
					this.node = node;
					node.addEventListener(event, e => {
						on.call(this, e);
					});
				});
				return this;
			},
			nodeOff(event, off) {
				this.mountedNodes.map(node => {
					this.node = node;
					node.removeEventListener(event, e => {
						off.call(this, e);
					});
				});
				return this;
			},
			on(event, callback, unshift) {
				if (!this.events[event]) {
					this.events[event] = [];
				}
				this.events[event][unshift ? 'unshift' : 'push'](callback);
				return this;
			},
			off(event, callback) {
				if (!this.events[event].length) {
					delete this.events[event];
				}
				let i = 0;
				while (i < this.events[event].length) {
					if (this.events[event][i] === callback) {
						this.events[event].splice(i, 1);
					} else {
						i++
					}
				}
				return this;
			},
			dispatch(event, custom) {
				if (!this.events[event]) {
					return;
				}
				custom = custom || {};
				const {
					opts
				} = this;
				this.events[event].map(event => {
					event.call(this, Tez.extend(custom, {
							opts,
							timestamp: Date.now(),
							type: event,
							target: this
						}));
				});
				return this;
			}
		};
		return Tez;
	}));
