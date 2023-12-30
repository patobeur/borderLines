export let _names = {
	name: null,
	lettreParFrequences: [
		['E', 14.71],['A', 9.24],['I', 8.66],['O', 7.11],
		['U', 7.10],//5.73
		['N', 6.63],['R', 6.37],['T', 6.13],['S', 5.99],
		// ['U', 5.73],//5.73
		['L', 5.45],['D', 3.47],['M', 3.11],['C', 3.11],['P', 2.89],['V', 1.42],
		['G', 1.21],['B', 0.96],['F', 0.95],['H', 0.92],['J', 0.68],['Q', 0.65],
		['K', 0.05],['W', 0.04],['X', 0.03],['Y', 0.03],['Z', 0.01],
	],
	donneUneLettre:function () {
		// Choisir la lettre en fonction de sa fréquence 
		const frequenceTotal = this.lettreParFrequences.reduce((sum, [lettre, frequence]) => sum + frequence, 0)
		const randomValue = Math.random() * frequenceTotal
		let cumulativefrequence = 0
		for (const [lettre, frequence] of this.lettreParFrequences) {
			cumulativefrequence += frequence
			if (randomValue <= cumulativefrequence) {
				return lettre
			}
		}
		return '_' // en cas d'erreur '_' 
	},
	getAName: function () {

		const nameLength = Math.floor(Math.random() * 4) + 5 // Longueur aléatoire entre 5 et 8 caractères
		let firstName = ''
		for (let i = 0; i < nameLength; i++) {
			firstName += this.donneUneLettre()
		}
		return firstName
	}
};

