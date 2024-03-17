import { canvasDimensions, resistance } from "./utils";

export interface IVector {
	// velocity
	vx: number;
	vy: number;
}

export interface IDelta {
	dx: number;
	dy: number;
}

export interface IPosition {
	x: number;
	y: number;
}

export interface ICanvasObject {
	color: string,
	position: IPosition,
	vector: IVector,
	id: number,
	checkCollision: Function;
}

export class CircleObject implements ICanvasObject {
	color: string;
	id: number;
	position: IPosition;
	vector: IVector;
	radius: number;

	constructor(color: string, id: number, radius: number, position: IPosition) {
		this.color = color;
		this.id = id;
		this.position = position;
		this.radius = radius;
		this.vector = {
			vx: 0,
			vy: 0
		}
	}

	checkCollision(collsionObject: CircleObject): boolean {
		let combinedRadius = this.radius + collsionObject.radius;
		let xDiff = this.position.x - collsionObject.position.x;
		let yDiff = this.position.y - collsionObject.position.y;
		return combinedRadius > Math.sqrt((xDiff * xDiff) + (yDiff * yDiff));
	}

	updateVectorVelocity(xDiff: number = 0, yDiff: number = 0): void {
		this.vector = {
			vx: xDiff * resistance,
			vy: yDiff * resistance,
		}
	}

	updatePosition(vectorDiff: IVector): void {
		this.position = {
			x: this.position.x + this.vector.vx,
			y: this.position.y + this.vector.vy,
		}
		if (this.position.x - this.radius < 0) {
			this.position.x = this.radius;
		}
		if (this.position.y - this.radius < 0) {
			this.position.y = this.radius;
		}
		if (this.position.x + this.radius > canvasDimensions.width) {
			this.position.x = canvasDimensions.width - this.radius;
		}
		if (this.position.y + this.radius > canvasDimensions.height) {
			this.position.y = canvasDimensions.height - this.radius;
		}
		this.updateVectorVelocity(vectorDiff.vx, vectorDiff.vy);
	}
}
