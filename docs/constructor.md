# Docs for Tez

## Constructor

### Usage

```javascript

	import { createElement }, Tez from 'tez.js';

/** @jsx createElement */

// Component example
class JSXTemplate {
	constructor () {
		this.count = 0;
	}
	onClick (e) {
		this.super.setView(this);
	}
	init () {
		this.super.setEvent('click', this.onClick.bind(this));
	}
	render () {
		return <div>Counted: { this.count++ } times</div>;
	}
}

// Initialize
const imm = new Tez('.container');

imm.setView(Counter);

```