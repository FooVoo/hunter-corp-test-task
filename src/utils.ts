import { CircleObject, IPosition, IVector, IDelta } from "./models";
import { useState } from "react";


export const canvasDimensions = {
	width: 650,
	height: 700,
}

export const resistance = 0.15;

export const getPositionFromEvent = (event: any): IPosition => {
	let rect = event.target.getBoundingClientRect();
	return {
		x: event.clientX - rect.left,
		y: event.clientY - rect.top,
	};
}

export const getVectorDiffs = (positionA: IPosition, positionB: IPosition): IVector => {
	const positionsDelta: IDelta = {
		dx: positionA.x - positionB.x,
		dy: positionA.y - positionB.y
	};

	return {
		vx: positionsDelta.dx * resistance,
		vy: positionsDelta.dy * resistance,
	};
}

export const isMouseCollision = (eventPosition: IPosition, object: CircleObject, threshold: number = 0): boolean => {
	return object.position.x + object.radius - threshold > eventPosition.x
		&& object.position.x - object.radius + threshold < eventPosition.x
		&& object.position.y + object.radius - threshold > eventPosition.y
		&& object.position.y - object.radius + threshold < eventPosition.y
}

export const useMouseMoveHandler = (): [IPosition, (event: MouseEvent) => void] => {
	const [coords, setMouseCoords] = useState<IPosition>({x: 0, y: 0});
	const handleMouseMove = (event: MouseEvent) => {
		setMouseCoords(getPositionFromEvent(event));
	}

	return [coords, handleMouseMove]
}

export default useMouseMoveHandler;
