export let _colors = {
	donneUneCouleur:function () {
		const red = Math.floor(Math.random() * 256);
		const green = Math.floor(Math.random() * 256);
		const blue = Math.floor(Math.random() * 256);
		
		const redHex = red.toString(16).padStart(2, '0');
		const greenHex = green.toString(16).padStart(2, '0');
		const blueHex = blue.toString(16).padStart(2, '0');
	  
		const couleurHex = `#${redHex}${greenHex}${blueHex}`;
		const couleurRgb = `rgb(${red},${green},${blue})`;

		return {hex:couleurHex,rgb:couleurRgb};
	},
	getAColor: function () {
		return this.donneUneCouleur();
	}
};

