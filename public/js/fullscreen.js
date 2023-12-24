import { _scene } from "./scenes.js";
import { _console } from "./console.js";
export const _fullscreen = {
  full: false,
  nav: false,
  goFull: function () {
    const elem = document.documentElement;
    if (this.full === true) {
      if (document.exitFullscreen) {
        document.exitFullscreen(); this.full = false;
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen(); this.full = false;
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen(); this.full = false;
      } else if (document.msExitFullscreen) {
        window.top.document.msExitFullscreen(); this.full = false;
      }
    }
    else {
      if (elem.requestFullscreen) {
        elem.requestFullscreen(); this.full = true; this.nav = 'Who knows ??';
      } else if (elem.mozRequestFullScreen) { /* Firefox */
        elem.mozRequestFullScreen(); this.full = true; this.nav = 'Firefox';
      } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
        elem.webkitRequestFullscreen(); this.full = true; this.nav = 'Chrome, Safari or Opera';
      } else if (elem.msRequestFullscreen) { /* IE/Edge */
        elem = window.top.document.body; //To break out of frame in IE
        elem.msRequestFullscreen(); this.full = true; this.nav = 'IE/Edge';
      }
    }
    _console.log(this.nav)
  }
}