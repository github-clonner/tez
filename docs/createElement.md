# Docs for Tez

## createElement

### Usage

```javascript

	import { createElement } from './makeNode';

	const _myNode = createElement({
		tag: 'p',
		css: 'font-size: 14px; font-family: Arial',
		attr: {id: 'p01'},
		content: '<p>I am here</p>'
	});

	console.log(_myNode);

	/*
	<p id="p01" style="font-size: 14px; font-family: Arial">
		<p>I am here</p>
	</p>
	*/

```

### Returns

* DOM Node