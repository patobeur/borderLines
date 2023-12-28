import { _fullscreen } from "./fullscreen.js";
import { _front } from "./front.js";
import { _wakeLock } from "./wakeLock.js";
export const _console = {
	cookieName: 'consoleCurrentSize',
	maxMessage: 20,
	id: new Number(0),
	counter: new Number(0),
	messages: {},
	consoleDiv: null,
	optionsDiv: null,
	emojis: ['💬', '👁️‍🗨️', '⬜', '◻️', '◽', '👁️','🆗'],
	sizes: [
		{ t: 'small', em: '👁️' },
		{ t: 'normal', em: '👁️' },
		{ t: 'middle', em: '👁️' },
		{ t: 'big', em: '👁️' },
	],
	currentSize: new Number(0),
	loadCurrentSize: function () {
		const savedSize = localStorage.getItem(this.cookieName);
		if (savedSize !== null) {
			this.currentSize = parseInt(savedSize, 10);
			let cssName = this.sizes[new Number(this.currentSize)].t
			this.log('🍪 Valeur récupéré en session. Taille console = ' + cssName,)
			this.consoleDiv.classList.add(this.sizes[new Number(this.currentSize)].t);
		} else {
			this.consoleDiv.classList.add(this.sizes[0].t);
		}
	},
	saveCurrentSize: function () {
		localStorage.setItem(this.cookieName, this.currentSize);
	},
	createSendMessageContainer: function () {
		this.sendercontainer = _front.createDiv({
			tag: 'div',
			attributes: {
				id: 'sendercontainer',
				className: 'sender-container'
			},
		})
		this.formsender = _front.createDiv({
			tag: 'form',
			attributes: {
				id: 'formsender',
				className: 'form-sender'
			},
		})
		this.inputsender = _front.createDiv({
			tag: 'div',
			attributes: {
				className: 'inputsender'
			},
		})
		this.messageInput = _front.createDiv({
			tag: 'input',
			attributes: {
				id: 'message',
				className: 'message'
			},
		})
		this.messageInput.setAttribute('type', "text")
		// this.messageInput.setAttribute('placeholder', "Type your message...")

		this.sendMessage = _front.createDiv({
			tag: 'button',
			attributes: {
				id: 'sendMessage',
				className: 'message',
				textContent: 'Send'
			},
		})

		this.inputsender.appendChild(this.messageInput)
		this.formsender.appendChild(this.inputsender)
		this.formsender.appendChild(this.sendMessage)
		this.sendercontainer.appendChild(this.formsender)

		// <div id="sendercontainer" class="sender-container">
		// 	<form id="formsender" class="form-sender">
		// 		<div class="inputsender">
		// 			<input id="message" type="text" placeholder="Type your message...">
		// 		</div>
		// 		<button class="button" id="sendMessage" type="submit" class="send-message">Send</button>
		// 	</form>
		// </div>

		// const joinform = document.getElementById('sendercontainer')
		// if(joinform){
		// 	joinform.remove
		// }
		this.messagesDiv.appendChild(this.sendercontainer)

	},
	create: function () {
		this.consoleDiv = _front.createDiv({
			tag: 'div',
			attributes: {
				id: 'console',
				title: 'console',
				className: 'console',
			},
			style: {
				position: 'absolute'
			}
		})
		this.optionsDiv = _front.createDiv({
			tag: 'div',
			attributes: {
				id: 'consoleOptions',
				className: 'options',
			},
		})
		this.options1 = _front.createDiv({
			tag: 'div',
			attributes: {
				id: 'consoleOption1',
				className: 'option ',
				textContent: this.emojis[1],
				title: 'change size'
			},
		})
		this.options2 = _front.createDiv({
			tag: 'div',
			attributes: {
				id: 'consoleOption2',
				className: 'option',
				textContent: this.emojis[0],
				title: 'full screen'
			},
		})
		this.options3 = _front.createDiv({
			tag: 'div',
			attributes: {
				id: 'consoleOption3',
				className: 'option',
				textContent: this.emojis[6],
				title: 'minimize console'
			},
		})
		this.messagesDiv = _front.createDiv({
			tag: 'div',
			attributes: {
				id: 'consoleMessages',
				className: 'messages'
			},
		})
		this.scrollerDiv = _front.createDiv({
			tag: 'div',
			attributes: {
				id: 'messageScroller',
				className: 'scroller'
			},
		})
		// -------------------------------------------------
		this.messagesDiv.appendChild(this.scrollerDiv)



		this.optionsDiv.appendChild(this.options1)
		this.optionsDiv.appendChild(this.options2)
		this.optionsDiv.appendChild(this.options3)

		this.consoleDiv.appendChild(this.optionsDiv)
		this.consoleDiv.appendChild(this.messagesDiv)
		// -------------------------------------------------
		this.options1.addEventListener('click', () => {
			this.changeSize()
		})
		this.options2.addEventListener('click', () => {
			_fullscreen.goFull()
		})
		this.options3.addEventListener('click', () => {
			this.changeSize(true)
		})
		
	},
	changeSize: function (size=false) {
		let old = this.currentSize + 0;

		if(!size) this.currentSize = (this.currentSize + 1 > this.sizes.length - 1) ? 0 : this.currentSize + 1;
		if(size) this.currentSize = 0

		this.consoleDiv.classList.remove(this.sizes[old].t)
		this.consoleDiv.classList.add(this.sizes[this.currentSize].t)

		this.log('Console set to : ' + this.sizes[this.currentSize].t);
		this.saveCurrentSize();

	},
	log: function () {
		if (arguments.length > 0) {
			let a = arguments
			if (a.length > 1) {
				let fullmess = ''
				for (const key in a) {
					if (Object.hasOwnProperty.call(a, key)) {
						const element = a[key];
						let mess = ''
						if (typeof element === 'string' || typeof element === 'number' || typeof element === 'boolean') {
							mess = element + ''
						}
						else if (element.message && (typeof element.message === 'string' || typeof element.message === 'number' || typeof element.message === 'boolean')) {
							mess = element.message + ''
						}
						if (mess != '') {
							let virgule = (fullmess != '') ? ', ' : ''
							fullmess = fullmess + virgule + mess
						}
					}
				}


				if (fullmess != '') {
					fullmess = _front.sanitize(fullmess)
					this.addLogMessage(fullmess)
				}





			}
			else if (a.length === 1) {
				let mess = ''
				if (typeof a[0] === 'string' || typeof a[0] === 'number' || typeof a[0] === 'boolean') {
					mess = a[0]
				}
				else if (a[0].message) {
					if (typeof a[0].message === 'string' || typeof a[0] === 'number' || typeof a[0] === 'boolean') {
						mess = a[0].message
					}
				}
				if (mess != '') {
					this.addLogMessage(_front.sanitize(mess))
				}
			}

		}
	},
	addLogMessage: function (message) {
		let newMess = _front.createDiv({
			tag: 'div',
			attributes: {
				id: 'message_' + this.id,
				className: 'message',
			}
		});
		let newSpan = _front.createDiv({
			tag: 'span',
			attributes: {
				textContent: '[' + (this.counter<10?'0':'') + this.counter + '] ' + message
			}
		});
		newSpan.classList.add('new')

		setTimeout(() => {
			newSpan.classList.remove('new')
		}, 1000);

		newMess.appendChild(newSpan)

		this.messages[this.id] = newMess;
		this.id++;
		this.counter++;
		this.scrollerDiv.appendChild(newMess)
		// this.scrollerDiv.scroll(0, 10000)
		this.scrollerDiv.scroll(0,this.scrollerDiv.scrollHeight)
	},
	trashMessages: function () {
		this.messages = {};
		this.id = 0;
		this.counter = 0;
		this.scrollerDiv.innerHTML = '';
	},
	addcss: function () {
		_front.addCss(this.cssString(), 'Console')
	},
	cssString: function () {
		return `:root{
			--bgcolor: rgba(3, 22, 1,.5);
			--fontsize:.9rem;
			--ofontsize:1rem;
			--w:100%;
			--h:70px;
			--ow:24px;
			--mw:calc(100% - var(--ow));
			--oh:var(--h);
			--mh:var(--h);
		}
		#console{
			position: absolute;
			bottom:0;
			left:0;
			background-color: var(--bgcolor);
			color:white;
			width:var(--w);
			height:var(--h);
			display:flex;
			flex-direction: row;
			z-index:999999999;
			transition: height 1s ease-out;
			box-shadow: inset 0 7px 9px -3px rgba(0,0,0,0.4);
			.messages {
				position: relative;
				width:var(--mw);
				height: 100%;
				display:flex;
				flex-direction: column;
				justify-content: flex-end;
				.scroller {
					flex-grow: 1;
					// min-height: 100%;
					overflow-y: scroll;
					cursor: pointer;
					width:100%;
					.message {
						cursor: auto;
						width:100%;
						padding-left:.2rem;
						&:hover{
							background-color: rgb(24, 51, 16);
						}
						span {
							font-size: var(--fontsize);
							padding: 0;
							margin: 0;
							line-height: 1rem;
							transition: color 1s;
							&.new {
								color:rgb(101, 126, 13)
							};
						}
					}
				}
			}
			.options {
				width: var(--ow);
				height: 100%;
				background-color: rgb(0, 0, 0);
				z-index: 9999;
				cursor: auto;
				.option {
					width: 100%;
					 aspect-ratio: 1/1;
					background-color: rgb(76, 76, 153);
					font-size: var(--ofontsize);
					cursor: pointer;
					&:hover {
						background-color: rgb(76, 76, 153);
					}
				}
			}
			&.small{
				--h:24px;
				--w:24px;
			}
			&.middle{
				--h:30%;
			}
			&.big{
				--h:60%;
			}
		}`
	},
	init: function () {
		this.addcss()
		this.create();
		this.createSendMessageContainer();
		this.loadCurrentSize(); // Load the saved currentSize
		document.body.appendChild(this.consoleDiv)
	}
};