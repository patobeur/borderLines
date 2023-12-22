import * as THREE from 'three';
import { _formulas } from '../functions/formulas.js';
import { _front } from '../functions/front.js';
export class _Deck {
	constructor() {
		this.cat = 6
		this.cardsPerCat = 5
		this.nbCards = this.cat * this.cardsPerCat
		this.nbPlayers = 4
		this.deck = []
		this.playersDecks = [[], [], [], []]
		this.tempoDeck = []

		this.gametitle = this.createElement({ id: 'gametitle', textContent: 'DeckGenerator' })
		this.playground = this.createElement({ id: 'playground' })
		this.dcontainer = this.createElement({ id: 'decks' })
		this.createPlayersDiv()

	}
	createPlayersDiv() {
		for (let i = 0; i < this.nbPlayers; i++) {
			let name = 'containerP' + (i + 1)
			this[name] = this.createElement({ id: 'p_' + (i + 1) })
		}
	}
	createElement(attrs) {
		if (attrs) {
			let newElement = document.createElement(attrs.tagName || 'div')
			if (attrs.id) newElement.id = attrs.id;
			if (attrs.textContent) newElement.textContent = attrs.textContent;
			if (attrs.className) newElement.className = attrs.className || '';
			if (attrs.style) newElement.style = attrs.style;
			if (attrs.href) newElement.href = attrs.href; //new URL(attrs.href)
			return newElement
		}
	}
	addTo(element, target = false, before = false) {
		if (target != false && typeof target === 'object') {
			!before ? target.appendChild(element) : target.prepend(element);
		} else {
			!before ? document.body.appendChild(element) : document.body.prepend(element);
		}
	}
	getCssString(){
		return `:root{
			--_0: rgb(248, 201, 48);
			--_1: rgb(221, 122, 41);
			--_2: rgb(231, 21, 221);
			--_3: rgb(190, 221, 140);
			--_4: rgb(140, 221, 210);
			--_5: rgb(140, 155, 221);
			--_6: rgb(221, 140, 208);
			--_7: rgb(211, 51, 176);
		}
		
		#playground,#playground>*{
			margin:0;padding:0;box-sizing: border-box;
			color:black;
		}
		#playground{
			min-width: 100%;
			border: 1px solid rgba(0, 0, 0, 0.74);
		}
		#decks{
			position: absolute;
			top:50px;
			right:0;
			width: 55px;
			height: 55px;
			transform: translate(-50%, -50%);
		}
		#decks .card{
			position: absolute;
			width:55px;height: 88px;
			border: 1px solid rgba(0, 0, 0, 0.74);
			border-radius: .5rem;
			padding:5px;
		}
		.card{
			width:55px;height: 88px;
			border: 1px solid rgba(0, 0, 0, 1);
			border-radius: .5rem;
			padding:5px;
			background-color:rgb(165, 165, 165);
		}
		.card.cover {
			/* 
			background-image: url("https://cdn.pixabay.com/photo/2022/12/06/05/57/branch-7638340_960_720.jpg");
			background-image: url("https://cdn.pixabay.com/photo/2022/12/02/03/30/sky-7630185_960_720.png");
			background-image: url("https://cdn.pixabay.com/photo/2023/01/28/06/57/man-7750139_960_720.png"); 
			background-image: url("https://cdn.pixabay.com/photo/2022/11/15/12/23/winter-7593872_960_720.jpg"); */
			background-image: url("https://cdn.pixabay.com/photo/2022/12/02/03/30/sky-7630185_960_720.png");
			background-size: cover;
		}
		#decks .card.empty{
			background-color:rgb(165, 165, 165);
		}
		#decks .card.cat_0 {background-color: var(--_0);}
		#decks .card.cat_1 {background-color: var(--_1);}
		#decks .card.cat_2 {background-color: var(--_2);}
		#decks .card.cat_3 {background-color: var(--_3);}
		#decks .card.cat_4 {background-color: var(--_4);}
		#decks .card.cat_5 {background-color: var(--_5);}
		#decks .card.cat_6 {background-color: var(--_6);}
		#decks .card.cat_7 {background-color: var(--_7);}
		
		.card.cat_0 {background-color: var(--_0);}
		.card.cat_1 {background-color: var(--_1);}
		.card.cat_2 {background-color: var(--_2);}
		.card.cat_3 {background-color: var(--_3);}
		.card.cat_4 {background-color: var(--_4);}
		.card.cat_5 {background-color: var(--_5);}
		.card.cat_6 {background-color: var(--_6);}
		.card.cat_7 {background-color: var(--_7);}
		
		#p_1,
		#p_2,
		#p_3,
		#p_4 {
			position: absolute;
			border: 1px solid rgba(0, 0, 0, 0.74);
			background-color:rgb(0, 0, 0);
			border-radius: .5rem;
			display: flex;
			flex-wrap: wrap;
			gap:5px;
			min-width: max-content;
		
		}
		#p_1 {
			padding:5px;
			bottom:15px;
			left:50%;
			transform: translate(-50%);
		}
		
		#p_2 {
			width: content;
			padding:5px;
			top:50%;
			transform: translateY(-50%) rotate(90deg) ;
			left:-108px;
		}
		#p_3 {
			width: content;
			padding:5px;
			top:15px;
			left:50%;
			transform: translate(-50%) rotate(180deg);
		}
		
		#p_4 {
			width: content;
			padding:5px;
			top:50%;
			transform: translateY(-50%) rotate(-90deg);
			right:-108px;
		}
		`;
	}
	init() {
		this.cssString = this.getCssString()
		_front.addCss(this.cssString)
		this.createDeck()

		this.addTo(this.playground)
		this.addTo(this.dcontainer, this.playground)
		for (let i = 0; i < this.nbPlayers; i++) {
			let name = 'containerP' + (i + 1)
			this.addTo(this[name])
			this.setPlayerHand(i)
		}
	}
	getRandomNum(min = 0, max = 10) {
		return Math.floor(Math.random() * (max - min + 1) + min);
	}
	setPlayerHand(playerNum) {
		let newHand = []
		this.playersDecks[playerNum] = []
		for (let i = 0; i < this.cardsPerCat; i++) {
			let TempoDeck = [...this.deck]
			// get random number from 0 to TempoDeck.length
			let randNum = this.getRandomNum(0, TempoDeck.length - 1)
			// get the div from old card and clone it
			let div = TempoDeck[randNum].div
			// remove old
			let clone = div.cloneNode(true);
			TempoDeck[randNum].div.remove()
			let card = JSON.parse(JSON.stringify(TempoDeck[randNum]));
			card.div = clone

			card.div.style = ''
			if (playerNum === 0) {
				card.div.textContent = card.datas.textContent
				card.div.className = 'card cat_' + card.cat
			}
			newHand.push(card)
			this.playersDecks[playerNum].push(card)
			let name = 'containerP' + (playerNum + 1)
			this[name].appendChild(card.div)


			// let empty = this.createElement({ className: 'card empty', textContent: i + 1 })
			// this.dcontainer.appendChild(empty)

			TempoDeck.splice(randNum, 1)
			// mise à jour du Deck
			this.deck = TempoDeck
		}
		console.log('player P' + playerNum, this.deck)
	}
	setPlayersHand() {
		let newHand = []
		this.playersDecks[playerNum] = []
		for (let i = 0; i < this.cardsPerCat + 1; i++) {
			let TempoDeck = [...this.deck]
			// get random number from 0 to TempoDeck.length
			let randNum = this.getRandomNum(0, TempoDeck.length - 1)
			// get the div from old card and clone it
			let div = TempoDeck[randNum].div
			// remove old
			let clone = div.cloneNode(true);
			TempoDeck[randNum].div.remove()
			let card = JSON.parse(JSON.stringify(TempoDeck[randNum]));
			card.div = clone
			newHand.push(card)
			this.playersDecks[playerNum].push(card)
			let name = 'containerP' + (playerNum + 1)
			this[name].appendChild(card.div)

			// let empty = this.createElement({ className: 'card empty', textContent: i + 1 })
			// this.dcontainer.appendChild(empty)

			TempoDeck.splice(randNum, 1)
			// mise à jour du Deck
			this.deck = TempoDeck
		}
		console.log('player P' + playerNum, this.deck)
	}
	createDeck() {
		let cardsCounter = 0
		for (let numCat = 0; numCat < this.cat; numCat++) {
			for (let numCard = 0; numCard < this.cardsPerCat; numCard++) {
				let deg = this.getRandomNum(-20, 20)
				let card = {
					immat: cardsCounter,
					cat: numCat,
					numCard: numCard,
					attrs: {
						// id: 'c' + (cardsCounter),
						className: 'card cover',
						style: 'transform: rotate(' + deg + 'deg) translate(' + this.getRandomNum(-5, 5) + 'px,' + this.getRandomNum(-5, 5) + 'px);'
					},
					datas: {
						textContent: 'cat' + numCat + ' [' + (numCard + 1) + '/' + this.cardsPerCat + ']',
					}
				}
				card.div = this.createElement(card.attrs)

				cardsCounter++

				this.deck.push(card);
				this.dcontainer.appendChild(card.div)
			}
		}
	}

}
