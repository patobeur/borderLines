import { _console } from "./console.js";
export const _wakeLock = {
    tryKeepScreenAlive: (minutes) => {
        if ('navigator', navigator.wakeLock) {
            _console.log(navigator.wakeLock)
            navigator.wakeLock.request("screen").then(lock => {
                setTimeout(() => lock.release(), minutes * 60 * 1000);
            });
        }
    },
	requestWakeLock: async () => {
        try {
            const wakeLock = await navigator.wakeLock.request("screen");
        } catch (err) {
            // The wake lock request fails - usually system-related, such as low battery.
            _console.log(`${err.name}, ${err.message}`);
        }
    }
};