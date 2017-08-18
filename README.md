# tez
[![Tez App][tez-image]][tez-url]

Lightweight, Clean, Optimized Virtual DOM & UI Library

[![size](http://img.badgesize.io/http://unpkg.com/tez.js?cache=false)](http://unpkg.com/tez.js)
[![gzipsize](http://img.badgesize.io/http://unpkg.com/tez.js?compression=gzip&cache=false)](http://unpkg.com/tez.js)
[![CDNJS](https://img.shields.io/cdnjs/v/tez.js.svg)](https://cdnjs.com/libraries/tez.js)
[![jsdelivr](https://img.shields.io/badge/cdn-jsdelivr-brightgreen.svg)](https://cdn.jsdelivr.net/npm/tez.js)  [![unpkg](https://img.shields.io/badge/cdn-unpkg-brightgreen.svg)](https://unpkg.com/tez.js)  [![npmcdn](https://img.shields.io/badge/cdn-npmcdn-brightgreen.svg)](https://npmcdn.com/tez.js)
[![NPM Version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][downloads-url]
[![Travis](https://img.shields.io/travis/dalisoft/tez.svg)](http://github.com/dalisoft/tez)
[![Greenkeeper badge](https://badges.greenkeeper.io/dalisoft/tez.svg)](https://greenkeeper.io/)
[![GitHub issues](https://img.shields.io/github/issues/dalisoft/tez.svg)](http://github.com/dalisoft/tez/issues)
[![Beerpay](https://img.shields.io/beerpay/dalisoft/tez.svg)](https://beerpay.io/dalisoft/tez/)
[![license](https://img.shields.io/github/license/dalisoft/tez.svg)](https://github.com/dalisoft/tez/blob/master/LICENSE)
[![Flattr this][flattr-image]][flattr-url]

# Note!
Users, Tez.js is alternative fan library to React.js, Preact, Inferno and etc. But this is lightweight and faster than they (load-time and render time), while has no events or feature, if you wish you can do it with PR

# *IMPORTANT*
* Hello, users. Who using this app, thanks. But i am highly recommend you move to "React.js" for better complexity, if you want simple and lightweight for minimal app, so continue use this app.

# Installation

### `npm` or `yarn`

```bash
$ npm install tez.js
# or
$ yarn add tez.js
```

### CDN

* Grab code at [jsdelivr](https://cdn.jsdelivr.net/npm/tez.js)
* Grab code at [unpkg](https://unpkg.com/tez.js)
* Grab code at [npmcdn](http://npmcdn.com/tez.js)
* See release at [cdnjs](https://cdnjs.com/libraries/tez.js)

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
// ES6
import { Component, DOM, html } from 'tez.js';
class Hello extends Component {
	constructor (props) {
		super(props);
	}
	render () {
		return html(`Hello ${this.props.name}`);
	}
}
DOM(MyDOMNode, new Hello({name:'World'}));

// ES6 Basic
const Hello = ({name}) => `Hello ${name}`
DOM(MyDOMNode, Hello({name:'World'})

// ES5/ES4
const { Component, DOM, html } = require('tez.js');
var Hello = function (props) {
	Component.call(this, props);
	return this;
};
Hello.prototype = Component.prototype;
Hello.prototype.render = function () {
	return html(`Hello ${this.props.name}`);
};
DOM(MyDOMNode, new Hello({name:'World'}));
```

# JSX
* You can set via `/** @jsx Tez.h */`
* or set via your transpiler configuration

# Compatibility
The code runs anywhere as possible due of there now no DOM comparision, just property comparision, it's faster and smarter.

### Supported browsers

* Android 5+
* iOS 9+
* Internet Explorer 10+
* Chrome 45+
* Firefox 35+
* Opera 15+

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
