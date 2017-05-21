import Tez, { Component } from 'tez.js';

class Dumy extends Component {
	constructor () {
		super();
	}
	render () {
		return 'Wow really good';
	}
}

class Dummy extends Component {
	constructor (view) {
		super(view);
		this.params = view.props;
	}
	changed () {
		//setTimeout(() => this.setProps(), 1000);
	}
	init () {
		//setTimeout(() => this.setProps(), 1000);
	}
	marked () {
		return 'While now ' + Date.now();
	}
	Render () {
		return <detail>How and <b>Wow</b><summary>{this.marked()}</summary> and this is amazing, <Dumy/></detail>;
	}
}

const body = document.body;
new Tez(body).setContent(<Dummy sanitize={false}/>);