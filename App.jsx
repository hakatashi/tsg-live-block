const React = require('react');

require('./index.pcss');

require('@babel/polyfill');
require('core-js/stage/4');
require('core-js/stage/3');
require('core-js/stage/2');
require('core-js/stage/1');

module.exports = class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {test: true};
	}

	render() {
		return <svg width="100%" height="100%" viewBox="0 0 100 200"/>;
	}
};
