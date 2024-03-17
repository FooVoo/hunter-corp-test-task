import { CSSProperties, useCallback, useEffect, useRef, useState } from "react";
import { CircleObject } from "./models";
import { getPositionFromEvent, getVectorDiffs, isMouseCollision, useMouseMoveHandler } from "./utils";
import ColorChangePopup from "./color-change-popup";

interface CanvasContainerParams {
	id: string;
	width: number;
	height: number;
	styles?: CSSProperties
}

const defaultStyles: CSSProperties = {
	backgroundColor: 'red'
}

export default function CanvasContainer(props: CanvasContainerParams) {
	const [balls, setBalls] = useState<CircleObject[]>([]);
	const [selectedBall, selectBall] = useState<CircleObject | null>(null);
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const [canvasContext, setCanvasContext] = useState<any>(null);
	const [mouseCoords, mouseHandler] = useMouseMoveHandler();

	const drawBall = useCallback((ball: Partial<CircleObject>, context: any) => {
		if (!canvasContext) return;
		context.beginPath();
		context.fillStyle = ball.color;
		context.arc(ball.position!.x, ball.position!.y, ball.radius!, 0, 2*Math.PI);
		context.fill();
	}, [canvasContext]);

	const clearCanvas = useCallback(() => {
		if (!canvasContext) return;
		canvasContext.clearRect(0, 0, props.width, props.height);
	}, [canvasContext, props.height, props.width]);

	const redrawObjects = useCallback(() => {
		if (!canvasContext) return;
		clearCanvas();
		balls.forEach((ball, idx, ballsArr) => {
			ballsArr.filter(ballB => ballB.id !== ball.id).forEach(ballB => {
				if (ball.checkCollision(ballB)) {
					ball.updatePosition(getVectorDiffs(ball.position, ballB.position));
					ballB.updatePosition(getVectorDiffs(ballB.position, ball.position));
				}
				if (isMouseCollision(mouseCoords, ball, 30)) {
					ball.updatePosition(getVectorDiffs(ball.position, mouseCoords));
				}
			});
			drawBall(ball, canvasContext);
		});
	}, [balls, canvasContext, clearCanvas, drawBall, mouseCoords]);

	const onCanvasClick = (event: any) => {
		let position = getPositionFromEvent(event);
		if (balls.length < 5) {
			let ball: CircleObject = new CircleObject(
				'#000',
				balls.length,
				60 + balls.length,
				position
			);
			setBalls((balls) => [...balls, ball]);
			drawBall(ball, canvasContext);
		} else {
			balls.forEach(ball => {
				if (isMouseCollision(position, ball)) {
					selectBall(ball);
				} else {
					selectBall(null);
				}
			});
		}
	}

	const onPopupClose = () => {
		selectBall(null);
	}

	useEffect(() => {
		setCanvasContext(canvasRef.current!.getContext('2d'));
		requestAnimationFrame(redrawObjects);
	}, [canvasContext, mouseCoords, redrawObjects]);

	return (
		<div>
			<canvas
				ref={canvasRef}
				id={props.id}
				width={props.width}
				height={props.height}
				style={Object.assign(defaultStyles, props.styles)}
				onClick={onCanvasClick}
				onMouseMove={(event) => {
					mouseHandler(event as unknown as MouseEvent);
				}}
			>
			</canvas>
			{selectedBall ? <ColorChangePopup ballRef={selectedBall} onPopupClose={onPopupClose}></ColorChangePopup> : null}
		</div>
	)
}
