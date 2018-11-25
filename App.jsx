const React = require('react');
const inRange = require('lodash/inRange');

require('./index.pcss');

require('@babel/polyfill');
require('core-js/stage/4');
require('core-js/stage/3');
require('core-js/stage/2');
require('core-js/stage/1');

module.exports = class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			mouse: 50,
			ballX: null,
			ballY: null,
			ballVX: -8,
			ballVY: -10,
		};
		setInterval(this.handleTick, 1000 / 30);
		setTimeout(() => {
			this.handleMouseDown();
		}, 1000);
	}

	handleMouseMove = (event) => {
		this.point.x = event.clientX;
		this.point.y = event.clientY;
		const point = this.point.matrixTransform(this.ctm.inverse());
		this.setState({
			mouse: Math.clamp(15, point.x, 85),
		});
	};

	handleMouseDown = () => {
		this.setState(({mouse}) => ({
			ballX: mouse,
			ballY: 180,
			ballVX: -8,
			ballVY: -10,
		}));
	};

	handleRef = (node) => {
		this.svg = node;
		this.point = node.createSVGPoint();
		this.ctm = node.getScreenCTM();
	};

	handleTick = () => {
		if (this.state.ballY !== null) {
			this.setState(({ballX, ballVX, ballY, ballVY, mouse}) => {
				let newY = ballY;
				let newVY = ballVY;
				let newX = ballX;
				let newVX = ballVX;

				newY += ballVY;
				newX += ballVX;

				if (newY < 0) {
					newY = -newY;
					newVY = -newVY;
				}

				if (inRange(newY, 180, 185) && inRange(newX, mouse - 15, mouse + 15)) {
					newY = 360 - newY;
					newVY = -newVY;
				}

				if (newX < 0) {
					newX = -newX;
					newVX = -newVX;
				}

				if (newX > 100) {
					newX = 200 - newX;
					newVX = -newVX;
				}

				return {
					ballY: newY,
					ballVY: newVY,
					ballX: newX,
					ballVX: newVX,
				};
			});
		}
	};

	render() {
		return (
			<svg
				width="100%"
				height="100%"
				viewBox="0 0 100 200"
				onMouseMove={this.handleMouseMove}
				ref={this.handleRef}
				onMouseDown={this.handleMouseDown}
			>
				<rect
					x="0"
					y="0"
					width="100"
					height="200"
					fill="white"
					stroke="black"
					strokeWidth="1"
				/>
				<rect
					x={this.state.mouse - 15}
					y="180"
					width="30"
					height="5"
					fill="black"
				/>
				<circle
					cx={this.state.ballX - 1.5}
					cy={this.state.ballY - 1.5}
					r="3"
					fill="black"
				/>
			</svg>
		);
	}
};
