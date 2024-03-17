import React from 'react';
import './App.css';
import CanvasContainer from "./canvas-container";
import { canvasDimensions } from "./utils";

function App() {
	return (
		<div className="App">
			<CanvasContainer
				id={'table'}
				width={canvasDimensions.width}
				height={canvasDimensions.height}
			></CanvasContainer>
		</div>
	);
}

export default App;
