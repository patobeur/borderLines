export const _front = {
	createDiv: function (params) {
		let element = document.createElement(params.tag);
		if (params.attributes) {
			for (const key in params.attributes) {
				if (Object.hasOwnProperty.call(params.attributes, key))
					element[key] = params.attributes[key];
				if (params.style) {
					for (const key2 in params.style) {
						if (Object.hasOwnProperty.call(params.style, key2))
							element.style[key2] = params.style[key2];
					}
				}
			}
		}
		return element;
	},
	addCss: function (string) {
		let stringcss = string;
		let style = document.createElement("style");
		style.textContent = stringcss;
		style.id = "css";
		document.getElementsByTagName("head")[0].appendChild(style);
	},
};