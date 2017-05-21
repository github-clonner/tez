export default class Component {
	constructor(view) {
		this.super = view;
	}
	setProps(props = {}, isView = false) {
		this.super.setProps(props);
		this.super[isView ? 'setView' : 'setContent'](this, props);
		if (this.changed) {
			this.changed(props);
		}
		return this;
	}
}
