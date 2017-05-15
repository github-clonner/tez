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

# *IMPORTANT*
* Hello, users. Who using this app, thanks. But i am highly recommend you move to "React.js" for better complexity, if you want simple and lightweight for minimal app, so continue use this app.

# Installation

### `npm` or `yarn`

```bash
$ npm install --save tez.js
# or
$ yarn add tez.js
```

### CDN Links

* `<script src="https://cdn.jsdelivr.net/tez.js/latest/Tez.min.js"></script>`
* Check out at [cdnjs version](https://cdnjs.com/libraries/tez.js) for `version/release`

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

# Example of What it does

### Example 1

```javascript
var dc = new Tez.domClass('body', { disableSafeParse: true });

	dc.setContent("+=<div id=\"loader\"></div>");

	// Uses appendChild for you, like innerHTML syntax for effective
```

# Methods
* `createElement` - for `JSX` element creation

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
