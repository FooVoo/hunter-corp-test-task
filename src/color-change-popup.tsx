import { CircleObject } from "./models";
import { CSSProperties, useState } from "react";

interface ColorChangePopupProps {
	ballRef: CircleObject,
	onPopupClose: Function
}

export default function ColorChangePopup (props: ColorChangePopupProps) {
	const [selectedColor, selectColor] = useState(props.ballRef.color);
	const getPosition = (): CSSProperties => {
		return {
			left: `${props.ballRef.position.x}px`,
			top: `${props.ballRef.position.y}px`
		};
	}

	const onColorChange = (event: any) => {
		selectColor(event.target.value);
	}

	return (
		<div
			className={'popup'}
			style={getPosition()}
		>
			<input
				defaultValue={selectedColor}
				pattern={'#[0-F]{3}'}
				maxLength={7}
				minLength={4}
				onChange={e => onColorChange(e)}
			></input>
			<button onClick={() => {
					props.ballRef.color = selectedColor
					props.onPopupClose()
				}
			}>Select</button>
		</div>
	);
}
