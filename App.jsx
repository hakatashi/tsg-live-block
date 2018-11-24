const React = require('react');

require('./index.pcss');

module.exports = class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	render() {
		return <svg width="100%" height="100%" viewBox="0 0 100 200"/>;
	}
};
