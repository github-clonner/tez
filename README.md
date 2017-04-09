# tez
[![Tez App][tez-image]][tez-url]

Lightweight, Flexible, Fast, Memory and Power Effecient Animation, Function, Component and DOM Manager

[![NPM Version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][downloads-url]
[![Travis](https://img.shields.io/travis/dalisoft/tez.svg)](http://github.com/dalisoft/tez)
[![Greenkeeper badge](https://badges.greenkeeper.io/dalisoft/tez.svg)](https://greenkeeper.io/)
[![GitHub issues](https://img.shields.io/github/issues/dalisoft/tez.svg)](http://github.com/dalisoft/tez/issues)
[![Beerpay](https://img.shields.io/beerpay/dalisoft/tez.svg)](https://beerpay.io/dalisoft/tez/)
[![license](https://img.shields.io/github/license/dalisoft/tez.svg)](https://github.com/dalisoft/tez/blob/master/LICENSE)
[![Flattr this][flattr-image]][flattr-url]

# Note
Dear users, this is not framework, just library that renders diffed (patched) element. This script inspired by amazing "React" and this script has own diff manager, not uses "VDOM" script.

# Installation

### `npm` or `yarn`

```bash
$ npm install --save tez.js
# or
# yarn add tez.js
```

### CDN Links
* `<script src="https://cdn.jsdelivr.net/tez.js/latest/Tez.min.js"></script>`
* Check out at [here](https://cdnjs.com/libraries/tez.js) for `version/release`

### Script loading

```html
<script src="https://unpkg.com/tez.js/Tez.min.js"></script>
```

or via [jsdelivr](http://www.jsdelivr.com/) (Thanks to jsdelivr)
```html
<script src="https://cdn.jsdelivr.net/tez.js/latest/Tez.min.js"></script>
```

# Docs
* Some docs can be seen at <a href="https://github.com/dalisoft/tez/tree/master/docs">HERE</a>

# For what
* Fast Mobile apps
* Fast Desktop apps
* Best UI Expierence
* Smooth rendering
* Large applications
* Apps Low-end powered device
* Cross-browser apps
* Super-fast Web-apps (on Chrome runs almost without redraw)

# What it does
* Avoids duplicated rendering
* Minimizes reflow as possible and keeps as low as can
* Minimize relayout
* Optimizes page responsiveness
* Avoids fully-rerendering of page by changing just changed nodes
* Inline Worker function calls
* Inline rAF function calls
* Inline instant function calls
* Composite Management
* Logic Management
* Call Management
* DOM Management

# Example of What it does

### Example 1

```javascript
// SuperAnimation.js is for example, but plug-in included for my private stuff
new SuperAnimation.Tween('.container', {
	xp: 0
}).to({
	xp: 200,
	tez: {
		render: function (node, props) {
			node.setContent(`<div class=\"ball\" style=\"transform:translate3d(${ props.xp }px, 0px, 0px)\"></div>`); // #1
			//node._node.innerHTML = `<div class=\"ball\" style=\"transform:translate3d(${ props.xp }px, 0px, 0px)\"></div>` #2
		}
	}
}, 2000).start();

```
* \#1: Effective way changing content, redraws only changed stuffs, not entire layer or html (inner, outer) or may change html once if needed, but very fast and power effecient.
* \#2: Default html way, innerHTML changes entire layer and redraws, this affects to performance too and this is ineffecient.

### Example 2

```javascript
var dc = new Tez.domClass('body');

	dc.setContent("+=<div id=\"loader\"></div>");

	// Uses appendChild for you, like innerHTML syntax for effective
```

# Methods
* `FunctionManager`
* `CompositeManager`
* `LogicManager`
* `CallManager`
* `DOMManager`
* `TweenManager`
* `DiffManager`
* `Collector`
* `domClass`
* `tezClass`

# Compatibility

### Note
This library works nice at IE10+, Chrome 35+, Firefox 35+, Opera 15+ and works partly at starting supported browsers.
I am recommend you render at page-load so you never see issues. Change interval check at 300-ms for better result

### Supported browsers (UPDATED)

* Android 5+
* iOS 9+
* Internet Explorer 11+
* Chrome 45+
* Firefox 40+
* Opera 18+


# Shims required in some cases
* `window.Class`
* `window.Worker`
* and much more

# License
* Apache 2.0

[tez-image]: https://raw.githubusercontent.com/dalisoft/tez/master/tez-logo.png
[tez-url]: https://github.com/dalisoft/tez/
[npm-image]: https://img.shields.io/npm/v/tez.js.svg
[npm-url]: https://npmjs.org/package/tez.js
[downloads-image]: https://img.shields.io/npm/dm/tez.js.svg
[downloads-url]: https://npmjs.org/package/tez.js
[flattr-image]: https://api.flattr.com/button/flattr-badge-large.png
[flattr-url]: https://flattr.com/thing/0bfc4bbb6273be0e5abeb8fa5e0c71a8
