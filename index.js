/*!
 * @name Tez.js
 * @description Lightweight, Flexible, Fast, Memory and Power Effecient Animation, Function and Class Manager
 * @version v2.1.4.0
 * @author @dalisoft (https://github.com/dalisoft)
 * @license Apache 2.0
 */

(function (root, factory) {
	if (typeof define === "function") {
		define([], function () {
			return factory.call(root);
		});
	} else if (typeof module !== "undefined") {
		module.exports = factory.call(root);
	} else {
		root.Tez = factory.call(root);
	}
}
	(this, function (undefined) {
		/*
		Polyfills
		 */
		if (!Array.prototype.filter) {
			Array.prototype.filter = function (fn) {
				var i = 0;
				while (i < this.length) {
					if (!fn.call(this[i], this[i], i)) {
						this.splice(i, 1);
					} else {
						i++
					}
				}
				return this;
			}
		}
		if (!Array.prototype.map) {
			Array.prototype.map = function (fn, scope) {
				var i = 0;
				while (i < this.length) {
					this[i] = fn.call(scope || this[i], this[i], i);
					i++
				}
				return this;
			}
		}

		var Tez = {};
		/*
		@constructor Worker
		@description Use worker
		 */
		var ROOT = this,
		MAX_WORKER_THREAD = 2,
		CURRENT_WORKER_THREAD = 0,
		LIST_WORKER_THREAD = [],
		ARRAY_SLICE = [].slice,
		FUNC_STR = Function.toString,
		WORKER_SUPPORT = ROOT.Worker !== undefined;

		var setWorker = function (force) {
			this._force = force;
			this._worker = null;
			this._id = 0;
			return this;
		};
		if (WORKER_SUPPORT) {
			var p = setWorker.prototype = {
				createBlob: function (fn) {
					return new Worker(
						window.URL.createObjectURL(
							new Blob([
									'self.onmessage = function(wrk) {' +
									'var f = ' + FUNC_STR.call(fn) + ';' +
									'self.postMessage(f.apply(this, wrk.data));' +
									'};'
								], {
								type: 'text/javascript'
							})))
				},
				call: function (fn) {
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
				get: function () {
					return this._val;
				},
				done: function (fn) {
					var curr = this;
					this._worker.addEventListener('message', function (e) {
						if (e.data === undefined)
							return;
						curr._val = fn.call(curr._worker, {
								data: e.data
							});
					});
				},
				run: function () {
					var args = ARRAY_SLICE.call(arguments);
					this._worker.postMessage(args);
					this._val = args[0];
					return this;
				},
				close: function () {
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
		var RAF_CALLS = [],
		RAF_UPDATE = (function (win) {
			win.requestAnimationFrame = win.requestAnimationFrame || function (fn) {
				return win.setTimeout(fn, 50 / 3);
			};
			win.cancelAnimationFrame = win.cancelAnimationFrame || function (fn) {
				return win.clearTimeout(fn);
			};
			var _run = "RUNNING",
			_tick;
			_tick = function update() {
				var i = 0;
				while (i < RAF_CALLS.length) {
					var raf = RAF_CALLS[i];
					if (raf.loop) {
						raf._val = raf.args ? raf.render.apply(raf, raf.args) : raf.render.call(raf);
						raf.loop = raf._val === _run;
					} else if (raf.run && (!raf.rendered && !raf._destroy)) {
						if (raf.args) {
							raf._val = raf.render.apply(raf, raf.args);
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
				add: function (item) {
					var _item = {
						_destroy: false,
						message: function (last) {
							var old = this.render,
							curr = this,
							self = this.self;
							this.render = function () {
								return (curr._val = last.call(curr, {
											data: (curr._val = old.apply(curr, ARRAY_SLICE.call(arguments)))
										}));
							}
						},
						get: function () {
							return this._val || this.args && this.args[0];
						},
						destroy: function () {
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
				destroy: function (item) {
					var match = [].concat(RAF_CALLS)
					.filter(function (item2) {
						return item2.render === item;
					});
					if (!match)
						return;
					var i = RAF_CALLS.indexOf(match[0]);
					if (i > -1) {
						RAF_CALLS.splice(i, 1);
					}
				}
			};
		}
			(this));

		var setRAF = function () {
			this._raf = null;
			return this;
		};
		var p = setRAF.prototype = {
			call: function (fn) {
				this._raf = RAF_UPDATE.add(fn);
				this._raf.self = this;
				this._val = this._raf._val;
				return this;
			},
			get: function () {
				return this._raf.get();
			},
			done: function (fn) {
				this._raf.message(fn);
				this._val = this._raf._val;
				return this;
			},
			run: function () {
				this._raf.args = ARRAY_SLICE.call(arguments);
				this._raf.run = true;
				this._val = this._raf._val;
				return this;
			},
			close: function () {
				RAF_UPDATE.destroy(this._raf);
				return this;
			}
		};

		var setFn = function () {
			this._fn = null;
			return this;
		};
		var p = setFn.prototype = {
			call: function (fn) {
				this._fn = fn;
				return this;
			},
			get: function () {
				return this._val;
			},
			done: function (fn) {
				var _oldFn = this._fn,
				curr = this;
				this._fn = function () {
					var args = ARRAY_SLICE.call(arguments);
					return fn.call(curr, {
						data: (curr._val = _oldFn.apply(curr, args))
					});
				};
				return this;
			},
			run: function (a) {
				var args = a !== undefined ? ARRAY_SLICE.call(arguments) : [];
				this._val = args.length ? this._fn.apply(this, args) : this._fn.call(this);
				return this;
			},
			close: function () {
				this._fn = null;
				return this;
			}
		};

		/*
		@constructor Tez
		@description Main function
		 */
		var Tez = {
			FunctionManager: function (fnc, mode) {
				this._mode = (mode === "Worker" && WORKER_SUPPORT) ? new setWorker(true) : mode === "raf" ? new setRAF(true) : new setFn(true);
				this.m = this._mode.call(fnc);
				return this;
			},
			PluginManager: {},
			extend: function (a, b) {
				a = a || {};
				b = b || {};
				for (var p in b) {
					if (a[p] === undefined && b[p] !== undefined) {
						a[p] = b[p];
					}
				}
				return a;
			}
		};
		Tez.FunctionManager.prototype = {
			onMessage: function (fn) {
				var c = this;
				this.m.done(function (e) {
					return fn.call(c.m, e.data);
				});
				return this;
			},
			plugin: function (plug) {
				if (typeof plug === "string" && Tez.PluginManager[plug] !== undefined && Tez.PluginManager[plug].fnMgr !== undefined) {
					this.m = Tez.PluginManager[plug].fnMgr.call(this, this.m);
				}
				return this;
			},
			get: function () {
				return this.m.get();
			},
			run: function (a) {
				var args = a !== undefined ? ARRAY_SLICE.call(arguments) : [];
				if (!args.length)
					return this;
				this.m.run.apply(this.m, args);
				return this;
			}
		};
		Tez.CompositeManager = function (draw, args) {
			return new Tez.FunctionManager(draw, "raf")
			.run(args);
		};
		Tez.LogicManager = function (fn, args) {
			return new Tez.FunctionManager(fn, "Worker")
			.run(args);
		};
		Tez.CallManager = function (fn, args) {
			return new Tez.FunctionManager(fn)
			.run(args);
		};
		Tez.DOMManager = function (node) {
			this.node = node;
			return this;
		};
		Tez.TweenManager = function (a, b) {
			var _isFunc = typeof(b) === "function";
			var _isArray = b && b.push && b.slice;
			var _isObj = (!_isArray && typeof(b) === "object");
			var _isNum = (!_isArray && !_isObj) && typeof(b) === "number";
			var _isStr = !_isNum && typeof(b) === "string";
			var _obj = {},
			_arr = [],
			_num = 0;
			return function (t) {
				if (_isFunc) {
					return b(t);
				} else if (_isArray) {
					return (_arr = b.map(function (v2, i) {
								if (typeof v2 === "number") {
									return a[i] + (v2 - a[i]) * t;
								} else if (typeof v2 === "function") {
									return v2(t);
								}
							}));
				} else if (_isObj) {
					for (var p in b) {
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
				var _keys = (b && b.push && b.slice ? b : b && Object.keys(b)) || [],
				_keysA = (a && a.push && a.slice ? a : a && Object.keys(a)) || [],
				i = 1,
				_diff = {},
				_len = _keys && _keys.length,
				_extract = ((a && _keys.length || 0) > (b && _keysA.length || 0) ? b : a) || _diff;
				if (_keys.length || _keysA.length) {
					for (var p in _extract) {
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
			getNode: function () {
				return this.node;
			},
			logic: function (fn) {
				this._logic = new Tez.LogicManager(fn);
				return this;
			},
			logicArg: function (arg) {
				this._logic.run.call(this._logic, arg);
				return this;
			},
			logicMsg: function (fn) {
				this._logic && this._logic.onMessage(fn.call(this, this.node));
				return this;
			},
			getLogic: function () {
				return this._logic;
			},
			composite: function (fn) {
				this._composite = new Tez.CompositeManager(fn.bind(this));
				return this;
			},
			compositeArg: function (arg) {
				this._composite.run.call(this._composite, arg);
				return this;
			},
			compositeMsg: function (fn) {
				this._composite && this._composite.onMessage(fn.call(this, this.node));
				return this;
			},
			getComposite: function () {
				return this._composite;
			}
		};
		var attrs = function (a) {
			if (!a)
				return {};
			var _a = {},
			attributes = a.attributes;
			for (var i = 0, atr, len = attributes.length; i < len; i++) {
				atr = attributes[i];
				_a[atr.name] = atr.value;
			}
			return JSON.stringify(_a);
		}
		var _getItem = function _giw(item, parent) {
			if (item.isEqualNode(parent)) {
				return item;
			}
			var childs = ARRAY_SLICE.call(parent.children);
			var i = 0,
			_match,
			_parentWhile,
			_matchInsideWhile;
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
		}
		var replaceChildrenByDiff = function _rchd(_attrs, _vattrs, _childs, _childs2, substore) {
			var _store = (substore || []).concat([]);
			if (substore) {
				substore.splice(0, substore.length);
			}
			var i = 0,
			_max = Math.max(_childs.length, _childs2.length),
			item,
			pi,
			ni,
			_tmp,
			len;
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
					} else if (_childs[i] && _childs[i].tagName !== _childs2[i].tagName) {
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
				var a = 0;
				len = _store.length;
				while (a < len) {
					item = _store[a],
					i = item.index;
					var pi = i - 1,
					ni = i + 1,
					_tmp,
					vr = item.virtual,
					rr = item.real;
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
			}
		};
		var _tmpDiv = document.createElement("div");
		var _parseString = function (str) {
			if (!str) {
				return [];
			};
			_tmpDiv.innerHTML = str;
			return ARRAY_SLICE.call(_tmpDiv.children);
		};
		var _makeNode = function (tag, css, content) {
			if (!tag)
				return;
			if (!content && css) {
				content = css;
				css = null;
			}
			var _tag = document.createElement(tag);
			if (css) {
				_tag.style.cssText = css;
			}
			if (content) {
				_tag.innerHTML = content;
			}
			return _tag;
		};
		Tez.createElement = _makeNode;
		Tez.domClass = function (node, vars) {
			this._vars = vars = vars || {};
			if (vars.quickRender === undefined) {
				vars.quickRender = true;
			}
			var _opts = this._opt = {};
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
			createElement: function (tag, css, content) {
				var item,
				appendStore = this._appendStore,
				len = appendStore.length;
				appendStore[len] = {
					real: 'append',
					virtual: (item = _makeNode(tag, css, content)),
					diff: false,
					index: len
				};
				return item;
			},
			setProps: function (props) {
				for (var p in props) {
					this.props[p] = props[p];
				}
				return this;
			},
			createFunction: function (fn) {
				fn.call(this);
			},
			render: function () {
				var vars = this._vars;
				var append = this._appendStore;
				var _listOfNodes = this._listOfNodes;
				var _vattrs = vars.attrs;
				var _attrs = attrs(this._node);
				var _diff;
				if (_attrs !== _vattrs) {
					_diff = JSON.parse(_vattrs);
					for (var p in _diff) {
						this._node.setAttribute(p, _vattrs[p] || _attrs[p]);
					}
				}
				_vattrs = vars.styling;
				_attrs = this._node.style.cssText;
				if (_vattrs !== _attrs) {
					this._node.style.cssText = _vattrs;
				}
				_vattrs = vars.content;
				_attrs = this._node.innerHTML;
				for (var i = 0, len = _listOfNodes.length; i < len; i++) {
					var idx = append.length;
					append[idx] = {
						virtual: _listOfNodes[i],
						real: 'append',
						diff: false,
						index: idx
					}
				}
				if (append.length || _attrs !== _vattrs) {
					var _it1 = this._node;
					var _it2 = this._vnode;
					var _childs = _parseString(_vattrs),
					_childs2 = _parseString(_attrs);
					replaceChildrenByDiff(_it1, _it2, _childs, _childs2, append);
				}
				return this;
			},
			setNode: function (node) {
				this._listOfNodes.push(node);
				return this;
			},
			setAttrs: function (_attrs) {
				var attr,
				nattr = {},
				_attr = JSON.parse(this._vars.attrs);
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
			setStyling: function (cssText) {
				var styling = this._vars.styling,
				style = this._vnode.style;
				style.cssText = styling;
				for (var p in cssText) {
					style[p] = cssText[p];
				}
				this._vars.styling = style.cssText;
				return this._quickRender ? this.render() : this;
			},
			setInnerHTML: function (contents) {
				var content = this._vars.content;
				if (!contents) {
					return this._quickRender ? this.render() : this;
				}
				contents = typeof(contents) === "string" ? contents : contents.nodeType ? contents.outerHTML : contents;
				var rel = contents.indexOf("=") !== -1 ? contents.charAt(0) === "+" ? 1 : -1 : 0;

				if (rel === 0) {
					content = contents;
				} else if (rel === 1) {
					content += contents.substr(2);
				} else if (rel === -1) {
					var _getParsed = _parseString(contents.substr(2))[0];
					var _find = _getItem(_getParsed, this._node);
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
			var _self = this;
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
		var getDecPow = function (d) {
			return Math.pow(10, d || 4);
		};
		Tez.tezClass.prototype = {
			plugin: function (plug) {
				if (typeof plug === "string" && Tez.PluginManager[plug] !== undefined && Tez.PluginManager[plug].tez !== undefined) {
					Tez.PluginManager[plug].tez.call(this, this.lets, this.opts);
				}
				return this;
			},
			apply: function () {
				var _self = this,
				opts = _self.opts,
				lets = opts.lets,
				lets2 = opts.lets2,
				_lets = opts._lets;
				var _minVal = 0.001,
				_maxVal = 1
					this.mountedNodes.map(function (node, index) {
						var dom = new Tez.DOMManager(node);
						var now = Date.now(),
						render = opts.render,
						tweenable = opts.tweenable,
						round = tweenable.roundLets,
						limitDec = tweenable.limitLetsDecimals,
						start = tweenable && (typeof(tweenable.startTime) === "function" ? tweenable.startTime.call(_self, node, index) : tweenable.startTime) || 0,
						dur = tweenable && (typeof(tweenable.duration) === "function" ? tweenable.duration.call(_self, node, index) : tweenable.duration) || 1000,
						tween = Tez.TweenManager(lets, lets2),
						diff;

						if (tweenable) {
							diff = Tez.DiffManager(lets, lets2);
							dom.composite(function (e) {
								if (!diff)
									return e.state;
								var elapsed = Math.max(0, Math.min(((Date.now() - now) - start) / dur, 1));
								var timeElapsed = elapsed;
								if (tweenable.curve) {
									elapsed = tweenable.curve(timeElapsed);
								}
								_lets = tween(elapsed);
								for (var p in _lets) {
									if (round && round[p]) {
										_lets[p] = typeof(_lets[p]) === "number" ? (_lets[p] | 0) : _lets[p] !== undefined && _lets[p].push && _lets[p].slice ? _lets[p].map(Math.round) : _lets[p];
									} else if (limitDec && limitDec[p]) {
										var dv = getDecPow(limitDec[p]);
										_lets[p] = typeof(_lets[p]) === "number" ? (((_lets[p] * dv) | 0) / dv) : _lets[p] !== undefined && _lets[p].push && _lets[p].slice ? _lets[p].map(function (v) {
												return ((v * dv) | 0) / dv;
											}) : _lets[p];
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
			render: function (_lets, leaveLet) {
				var _self = this,
				opts = this.opts;
				_lets = _lets || opts.lets;
				var dm = Tez.DiffManager(opts.lets, _lets);
				if (!dm)
					return this;
				this.mountedNodes.map(function (node, index) {
					opts.render.call(_self, node, _lets || opts.lets, opts, index);
				});
				if (!leaveLet) {
					opts.lets = _lets;
				}
				return this;
			},
			mountNode: function (node) {
				node = ARRAY_SLICE.call(typeof(node) === "string" ? document.querySelectorAll(node) : node.length ? node : [node]);
				this.mountedNodes = this.mountedNodes.concat(node);
				return this;
			},
			nodeOn: function (event, on) {
				var _self = this;
				this.mountedNodes.map(function (node) {
					_self.node = node;
					node.addEventListener(event, function (e) {
						on.call(_self, e);
					});
				});
				return this;
			},
			nodeOff: function (event, off) {
				var _self = this;
				this.mountedNodes.map(function (node) {
					_self.node = node;
					node.removeEventListener(event, function (e) {
						off.call(_self, e);
					});
				});
				return this;
			},
			on: function (event, callback, unshift) {
				if (!this.events[event]) {
					this.events[event] = [];
				}
				this.events[event][unshift ? 'unshift' : 'push'](callback);
				return this;
			},
			off: function (event, callback) {
				if (!this.events[event].length) {
					delete this.events[event];
				}
				var i = 0;
				while (i < this.events[event].length) {
					if (this.events[event][i] === callback) {
						this.events[event].splice(i, 1);
					} else {
						i++
					}
				}
				return this;
			},
			dispatch: function (event, custom) {
				if (!this.events[event]) {
					return;
				}
				custom = custom || {};
				var _self = this,
				opts = _self.opts;
				this.events[event].map(function (event) {
					event.call(_self, Tez.extend(custom, {
							opts: opts,
							timestamp: Date.now(),
							type: event,
							target: _self
						}));
				});
				return this;
			}
		};
		return Tez;
	}));
