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
			blocks: Array(25)
				.fill()
				.map((_, index) => ({
					id: index,
					x: 10 + Math.floor(index / 5) * 20,
					y: 10 + (index % 5) * 20,
					width: 10,
					height: 10,
				})),
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
			ballVX: -4,
			ballVY: -5,
		}));
	};

	handleRef = (node) => {
		this.svg = node;
		this.point = node.createSVGPoint();
		this.ctm = node.getScreenCTM();
	};

	handleTick = () => {
		if (this.state.ballY !== null) {
			this.setState(({ballX, ballVX, ballY, ballVY, mouse, blocks}) => {
				let newY = ballY;
				let newVY = ballVY;
				let newX = ballX;
				let newVX = ballVX;
				let newBlocks = blocks;

				newY += ballVY;
				newX += ballVX;

				if (newY < 0) {
					newY = -newY;
					newVY = -newVY;
				}

				if (inRange(newY, 180, 190) && inRange(newX, mouse - 15, mouse + 15)) {
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

				for (const block of newBlocks) {
					if (
						inRange(
							newX,
							block.x - block.width / 2,
							block.x + block.width / 2
						) &&
						inRange(
							newY,
							block.y - block.height / 2,
							block.y + block.height / 2
						)
					) {
						newBlocks = newBlocks.filter(({id}) => id !== block.id);
						newVY = -newVY;
					}

					newBlocks = newBlocks.map((block) => ({
						...block,
						x: block.x + 0.03,
					}));
				}

				return {
					ballY: newY,
					ballVY: newVY,
					ballX: newX,
					ballVX: newVX,
					blocks: newBlocks,
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
				{this.state.ballX !== null && (
					<circle
						cx={this.state.ballX - 1.5}
						cy={this.state.ballY - 1.5}
						r="3"
						fill="black"
					/>
				)}
				{this.state.blocks.map(({x, y, width, height}, index) => (
					<rect
						key={index}
						x={x - width / 2}
						y={y - height / 2}
						width={width}
						height={height}
					/>
				))}
			</svg>
		);
	}
};
