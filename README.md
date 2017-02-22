# tez
Lightweight, Flexible, Fast, Memory and Power Effecient Animation, Function and Class Manager

# Note
Dear users, this is not framework, just library that renders diffed (patched) element. This script inspired by amazing "React" and this script has own diff manager, not uses "VDOM" script.

# Installation
```sh
// Install
npm install tez.js

// Build again
npm run source // or npm run build

// Test
npm run test // Coming soon
```

or

```html
<script src="https://unpkg.com/tez.js/Tez.min.js"></script>
```


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
* Android 4+
* iOS 7+
* Internet Explorer 9+
* Chrome
* Firefox
* Opera 12+

# Shims required in some cases
* `Array.prototype.map` [INCLUDED IN JS, You can use method anywhere after adding our script]
* `Array.prototype.filter` [INCLUDED IN JS, You can use method anywhere after adding our script]
* `window.Worker` 
* `window.requestAnimationFrame` [INCLUDED IN JS, You can use method anywhere after adding our script]

# License
* Apache 2.0
