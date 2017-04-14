import Data from './data';

class State {
	constructor(state = {}) {
		this.state = new Data(state);
		return this;
	}
	setState (p, v) {
		if ( typeof p === "function" ) {
			p(this.state);
		} else if ( typeof p === "string" || Array.isArray(p) ) {
			this.state.set(p, typeof v === "function" ? v(this.state.get(p)) : v);
		}
		return this;
	}
	getState ( prop ) {
		return prop ? this.state.get(prop) : this.state;
	}
}

export default State;
