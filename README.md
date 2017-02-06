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

# Compatibility
* Android 5.1+
* iOS 9.3.4+
* Internet Explorer 10+
* Chrome 45+
* Firefox 40+
* Opera 20+

# Shims required in some cases
* `Array.prototype.map`
* `Array.prototype.filter`
* `window.Worker`
* `window.requestAnimationFrame`

# NOTE FOR SYNTAX
I am new on ES6 syntax, so i partly used ES6 stuffs for easy to read, if you not understand or your browser doesn't support it, please convert script to ES5 and older with <a href="https://babeljs.io/repl/">Babel REPL</a>

# License
* Apache 2.0
