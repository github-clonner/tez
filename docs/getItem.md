# Docs for Tez

## _getItem

### Usage

```javascript

	import { _getItem } from './getItem';

	let node = document.querySelector('.node1');

	let nodeChild = node.children[0].cloneNode();

	console.log(nodeChild.parentNode) // null;

	let getChild = _getItem(nodeChild /* child that need find */, node /* parent that need check their childrens for match */);

	console.log(getChild); 
	/*
		{
			matched: node.children[0],
			matchParent: node
	*/

```

### Returns

* Match item or null