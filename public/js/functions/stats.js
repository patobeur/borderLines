import { Stats } from "../vendor/stats.js/src/Stats.js";
export let _stats = {
	stats: null,
	init: function() {
		this.stats = new Stats();
		this.stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
		document.body.appendChild(this.stats.dom);
	},
	begin: function() {
		this.stats.begin();
	},
	end: function() {
		this.stats.end();
	},
}