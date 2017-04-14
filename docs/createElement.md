# Docs for Tez

## createElement

### Usage

```javascript

	import Tez, { createElement } from 'tez.js';
	/** @jsx createElement */

	const _myNode = <p id="p01" style="font-size: 14px; font-family: Arial">
		<p>{I am here}</p>
	</p>;

	console.log(_myNode.nodeType); // true

```

### Returns

* DOM Node