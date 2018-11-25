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
					type:
						Math.random() < 0.2
							? 'inverse'
							: Math.random() < 0.4
								? 'speed'
								: 'normal',
				})),
			scores: 0,
			isInversed: false,
			speedTurns: 0,
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
		this.setState(({isInversed}) => ({
			mouse: Math.clamp(15, isInversed ? 100 - point.x : point.x, 85),
		}));
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
			this.setState(
				({
					ballX,
					ballVX,
					ballY,
					ballVY,
					scores,
					mouse,
					blocks,
					isInversed,
					speedTurns,
				}) => {
					let newY = ballY;
					let newVY = ballVY;
					let newX = ballX;
					let newVX = ballVX;
					let newBlocks = blocks;
					let newScores = scores;
					let newIsInversed = isInversed;
					let newSpeedTurns = speedTurns;

					newY += ballVY;
					newX += ballVX;

					if (newSpeedTurns > 0) {
						newY += ballVY;
						newX += ballVX;
					}

					newSpeedTurns = Math.max(newSpeedTurns - 1, 0);

					if (newX < 0) {
						newX = -newX;
						newVX = -newVX;
					}

					if (newX > 100) {
						newX = 200 - newX;
						newVX = -newVX;
					}

					if (newY < 0) {
						newY = -newY;
						newVY = -newVY;
					}

					if (
						inRange(newY, 180, 190) &&
						inRange(newX, mouse - 15, mouse + 15)
					) {
						const vr = 5;
						const vtheta = (((newX - mouse) / 30) * Math.PI) / 2;
						newY = 360 - newY;
						newVX = Math.sin(vtheta) * vr;
						newVY = -Math.cos(vtheta) * vr;
					}

					if (newY > 210) {
						newX = null;
						newY = null;
						newScores -= 5;
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
							newScores++;
							newVY = -newVY;

							if (block.type === 'inverse') {
								newIsInversed = !newIsInversed;
							}

							if (block.type === 'speed') {
								newSpeedTurns += 15;
							}

							if (newBlocks.length === 0) {
								newX = null;
								newY = null;
							}
						}
					}

					newBlocks = newBlocks.map((block) => {
						const dx = block.x - 50;
						const dy = block.y - 50;

						const distance = Math.sqrt(dx ** 2 + dy ** 2);
						const theta = Math.atan2(dx, dy);

						return {
							...block,
							x: 50 + Math.sin(theta + 0.01) * distance,
							y: 50 + Math.cos(theta + 0.01) * distance,
						};
					});

					return {
						ballY: newY,
						ballVY: newVY,
						ballX: newX,
						ballVX: newVX,
						blocks: newBlocks,
						scores: newScores,
						isInversed: newIsInversed,
						speedTurns: newSpeedTurns,
					};
				}
			);
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
					fill={this.state.isInversed ? 'red' : 'black'}
				/>
				{this.state.ballX !== null && (
					<circle
						cx={this.state.ballX - 1.5}
						cy={this.state.ballY - 1.5}
						r="3"
						fill={this.state.speedTurns > 0 ? 'blue' : 'black'}
					/>
				)}
				{this.state.blocks.map(({x, y, width, height, type}, index) => (
					<rect
						key={index}
						x={x - width / 2}
						y={y - height / 2}
						width={width}
						height={height}
						fill={
							type === 'inverse' ? 'red' : type === 'speed' ? 'blue' : 'black'
						}
					/>
				))}
				<text
					x="50"
					y="190"
					fill="block"
					textAnchor="middle"
					fontSize="5"
					fontWeight="bold"
				>
					Score: {this.state.scores}
				</text>
				{this.state.blocks.length === 0 && (
					<text
						x="50"
						y="100"
						fill="red"
						fontWeight="bold"
						textAnchor="middle"
						fontSize="30"
					>
						CLEAR!
					</text>
				)}
			</svg>
		);
	}
};
