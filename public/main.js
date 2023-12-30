import { Core } from "./mainCore.js";
const socket = io('ws://192.168.1.105:3500')
Core.init({socket:socket})