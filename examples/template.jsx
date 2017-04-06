import { domClass, createElement } from '../src/index.js';

/** @jsx createElement */

// Component example
class JSXTemplate {
	static get count () {
		return this._count || 0;
	}
	static set count (count) {
		this._count = count;
	}
	constructor () {
		this.count = 0;
	}
	onClick (e) {
		this.setView(JSXTemplate);
	}
	init () {
		this.super.setEvent('click', this.onClick);
	}
	render () {
		return <div>Counted: { Counter.count++ } times</div>;
	}
}

// Initialize
const imm = new domClass('.container');

imm.setView(Counter);