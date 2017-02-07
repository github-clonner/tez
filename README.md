# tez
Lightweight, Flexible, Fast, Memory and Power Effecient Animation, Function and Class Manager

# What it does
* Avoids duplicated rendering
* Avoids fully-rerendering of page by changing just changed nodes
* Inline Worker function calls
* Inline rAF function calls
* Inline instant function calls
* Composite Management
* Logic Management
* Call Management
* DOM Management

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
