/*!
 * @name Tez.js
 * @description Lightweight, Flexible, Fast, Memory and Power Effecient Animation, Function and Class Manager
 * @version v1.1.1
 * @author @dalisoft (https://github.com/dalisoft)
 * @license Apache 2.0
 */

(function (root, factory) {
	if (typeof define === "function") {
		define([], () => {
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
		@constructor Worker
		@description Use worker
		 */
		var MAX_WORKER_THREAD = 2,
		CURRENT_WORKER_THREAD = 0,
		LIST_WORKER_THREAD = [],
		ARRAY_SLICE = [].slice,
		FUNC_STR = Function.toString;
		var setWorker = function (force) {
			this._force = force;
			this._worker = null;
			this._id = 0;
			return this;
		};
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
					LIST_WORKER_THREAD.shift().close();
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

		/*
		@constructor RAF
		@description Use RAF
		 */
		var RAF_CALLS = [],
		RAF_UPDATE = (function (win) {
			win.requestAnimationFrame = win.requestAnimationFrame || win.setTimeout;
			var _run = "RUNNING";
			win.requestAnimationFrame(function update() {
				win.requestAnimationFrame(update);
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
			});
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
					return _item;
				},
				destroy: function (item) {
					var match = [].concat(RAF_CALLS).filter(function (item2) {
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
				this._mode = mode === "Worker" ? new setWorker(true) : mode === "raf" ? new setRAF(true) : new setFn(true);
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
				if (typeof plug === "string" && Tez.PluginManager[plug] !== undefined) {
					this.m = Tez.PluginManager[plug].call(this, this.m);
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
			return new Tez.FunctionManager(draw, "raf").run(args);
		};
		Tez.LogicManager = function (fn, args) {
			return new Tez.FunctionManager(fn, "Worker").run(args);
		};
		Tez.CallManager = function (fn, args) {
			return new Tez.FunctionManager(fn).run(args);
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
				return Object.keys(_diff).length ? _diff : i > 1;
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
		Tez.Collector = {
			DOMNode: {
				attrs: function (a) {
					var _a = a._collectedattrs || {},
					attr = ARRAY_SLICE.call(a.attributes || []).map(function (atr) {
							_a[atr.name] = atr.value;
						});
					a._collectedattrs = _a;
					return _a;
				},
				styles: function (a) {
					var _o = a._collectedStyle || {},
					_cssText = a.style.cssText;
					if (!_cssText) {
						return _o;
					}
					var rpl = _cssText.split(";").filter(function (p) {
							return p && p.length && p.indexOf(":") > -1;
						}).map(function (p, i) {
							var p2 = p.split(":");
							_o[p2[0].trim()] = p2[1].trim();
						});
					a._collectedStyle = _o;
					return _o;
				},
				content: function (a) {
					return a; // TO_DO: Some processing for performance
				}
			}
		};
		var _addRelMgr = Tez.addRelativeManager = function (content, fn) {
			if (content.indexOf("=") > -1 && content.charAt(0) === "+") {
				fn(content.substr(2), 1);
			} else if (content.indexOf("=") > -1 && content.charAt(0) === "-") {
				fn(content.substr(2), -1);
			} else {
				fn(content, 0);
			}
		};
		Tez.getItemWithin = function _giw(item, parent) {
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
		};
		Tez.replaceChildrenByDiff = function _rchd(_attrs, _vattrs, _childs, _childs2) {
			var _store = [];
			var i = 0,
			_max = Math.max(_childs.length, _childs2.length);
			if (_childs.length > 0) {
				while (i < _max) {
					if (_childs[i] && !_childs2[i]) {
						_store.push({
							index: i,
							diff: false,
							virtual: _childs[i],
							real: 'append'
						});
					} else if (_childs2[i] && ((_childs[i] && _childs[i]._remove) || !_childs[i])) {
						_store.push({
							index: i,
							diff: false,
							virtual: 'append',
							real: _childs2[i]
						});
					} else if (_childs[i] && _childs[i].isEqualNode(_childs2[i]) === false) {
						_store.push({
							index: i,
							diff: true,
							virtual: _childs[i],
							real: _childs2[i]
						});
					}
					i++;
				}
				_store.map(function (item) {
					var i = item.index,
					pi = i - 1,
					ni = i + 1,
					_tmp,
					vr = item.virtual,
					rr = item.real;
					if (!item.diff && rr === 'append') {
						_tmp = _childs2[ni];
						if (_tmp) {
							_tmp.parentNode.insertBefore(vr, _tmp);
						} else {
							_tmp = _childs2[0];
							if (_tmp) {
								_tmp.parentNode.appendChild(vr);
							}
						}
					} else if (!item.diff && vr === 'append') {
						_tmp = rr;
						_tmp.parentNode.removeChild(_tmp);

					} else if (item.diff) {
						_tmp = rr;
						_rchd(rr, vr, ARRAY_SLICE.call(vr.children), ARRAY_SLICE.call(rr.children));
					}
				});
			} else if (_attrs.innerHTML !== _vattrs.innerHTML) {
				_attrs.innerHTML = _vattrs.innerHTML;
			} else if (_attrs.style.cssText !== _vattrs.style.cssText) {
				_attrs.style.cssText = _vattrs.style.cssText;
			} else if (_attrs && _attrs.parentNode) {
				_attrs.parentNode.replaceChild(_vattrs, _attrs);
			}
		};
		Tez.domClass = function (node, vars) {
			this._vars = vars = vars || {};
			var _opts = this._opt = {};
			this._node = node;
			this._vnode = this._node.cloneNode(true);
			this._nodeElem = this._vnode;
			if (vars.content) {
				this.setContent(vars.content);
			}
			if (vars.attrs) {
				this.setAttrs(vars.attrs);
			}
			if (vars.styling) {
				this.setStyling(vars.styling);
			}
			return this;
		};
		Tez.domClass.prototype = {
			render: function () {
				var _dn = Tez.Collector.DOMNode;
				var _vattrs = _dn.attrs(this._nodeElem);
				var _attrs = _dn.attrs(this._node);
				var _diff = Tez.DiffManager(_vattrs, _attrs);
				if (_diff) {
					for (var p in _diff) {
						this._node.setAttribute(p, _vattrs[p] || _attrs[p]);
					}
				}
				_vattrs = _dn.styles(this._nodeElem);
				_attrs = _dn.styles(this._node);
				_diff = Tez.DiffManager(_vattrs, _attrs);
				if (_diff) {
					for (var p in _diff) {
						this._node.style[p] = _vattrs[p] || _attrs[p];
					}
				}
				_vattrs = _dn.content(this._nodeElem);
				_attrs = _dn.content(this._node);
				_diff = Tez.DiffManager(_vattrs, _attrs);
				if (_diff) {
					var _childs = ARRAY_SLICE.call(_vattrs.children),
					_childs2 = ARRAY_SLICE.call(_attrs.children);
					Tez.replaceChildrenByDiff(_attrs, _vattrs, _childs, _childs2);
				}
				return this;
			},
			setAttrs: function (_attrs) {
				_attrs = Tez.extend(_attrs || this._vars.attrs);
				for (var p in _attrs) {
					this._nodeElem.setAttribute(p, _attrs[p]);
				}
				this._vars.attrs = _attrs;
				return this.render();
			},
			setStyling: function (_styles) {
				_styles = Tez.extend(_styles || this._vars.styling);
				for (var p in _styles) {
					this._nodeElem.style[p] = _styles[p];
				}
				this._vars.styling = _styles;
				return this.render();
			},
			setCustom: function (fn) {
				this._nodeElem = fn.call(this, this._nodeElem);
				return this.render();
			},
			setContent: function (contents) {
				var _self = this;
				_addRelMgr(contents, function (content, rel) {
					if (rel === 1 || rel === -1) {
						var appendElem = document.createElement("div");
						appendElem.innerHTML = content;
						appendElem = appendElem.firstChild;
						if (!appendElem) {
							return;
						}
						if (rel === 1) {
							_self._nodeElem.appendChild(appendElem);
						} else if (rel === -1) {
							var _getRI = Tez.getItemWithin(appendElem, _self._nodeElem);
							if (_getRI && _getRI.matched) {
								/*_self._nodeElem.removeChild(_getRI.matched); // NOT WORKED WELL */
								_getRI.matched._remove = true;
							}
						}
					} else if (rel === 0) {
						_self._nodeElem.innerHTML = content;
					}
				});
				this._vars.content = contents;
				return this.render();
			}
		};
		Tez.tezClass = function (opts) {
			var _self = this;
			this.events = {};
			opts = Tez.extend(opts || {}, {
					lets: {},
					lets2: {},
					_lets: {},
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
		Tez.getDecPow = function (d = 4) {
			return Math.pow(10, d);
		};
		Tez.tezClass.prototype = {
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
										var dv = Tez.getDecPow(limitDec[p]);
										_lets[p] = typeof(_lets[p]) === "number" ? (((_lets[p] * dv) | 0) / dv) : _lets[p] !== undefined && _lets[p].push && _lets[p].slice ? _lets[p].map(function (v) {
												return ((v * dv) | 0) / dv;
											}) : _lets[p];
									}
								}
								if (timeElapsed > _minVal) {
									render.call(_self, node, _lets, opts, index, elapsed);
								}
								return timeElapsed < _maxVal ? e.state : 0;
							}).compositeArg({
								state: opts.state || "RUNNING"
							});
						} else if (opts.initState) {
							render.call(_self, node, lets, opts, index, elapsed);
						}

					});
				return this;
			},
			render: function (_lets) {
				var _self = this,
				opts = this.opts;
				_lets = _lets || opts.lets;
				var dm = Tez.DiffManager(opts.lets, _lets);
				if (!dm)
					return this;
				this.mountedNodes.map(function (node, index) {
					opts.render.call(_self, node, _lets || opts.lets, opts, index);
				});
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
			on: function (event, callback) {
				if (!this.events[event]) {
					this.events[event] = [];
				}
				this.events[event].push(callback);
				return this;
			},
			off: function (event, callback) {
				if (!this.events.length) {
					delete this.events[event];
				}
				var i = 0;
				while (i < this.events[event].length) {
					if (this.events[event][i] === callback) {
						this.events[event].splice(i, 1);
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
							timestamp: Date.now()
						}));
				});
				return this;
			}
		};
		return Tez;
	}));
