# WebRTC-demo

A Webrtc simplest usage sample, providing signaling server side and client side.

check the project and npm install package.json in two directories separately. then read the following.

**server side:**

run `server` script in the package.json

change your local client test site address in ``IOOptions.cors``

**client side:**

run `dev` script in the package.json

open your address postfix with /RTCBasic.html in the browser

beware I set only `two` user by user-agent detection, that means you can only using one `web` device and one `mobile` device to access this site, i.e. first user access from the web and another one come from the mobile.

ensure your media devices( both camera and microphone ) connected and working stably. access the test site over https protocol.


you can check all log outputs in the devtool console.
