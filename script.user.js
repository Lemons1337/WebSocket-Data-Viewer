// ==UserScript==
// @name         WebSocket Data Viewer
// @namespace    https://github.com/Lemons1337/WebSocket-Data-Viewer
// @version      0.1
// @description  try to take over the world!
// @author       Lemons
// @match        *://*/*
// @run-at       document-start
// @grant        none
// ==/UserScript==

var send = WebSocket.prototype.send;

window.WebSocket = new Proxy(WebSocket, {
    construct(target, args) {
        var ws = new target(...args);

        ws.addEventListener('message', function(message) {
            var data = message.data;

            if (data instanceof DataView) {
                data = new Uint8Array(data.buffer);
            } else if (data instanceof ArrayBuffer) {
                data = new Uint8Array(data);
            }

            console.log('Incoming ->', data);
        });

        return ws;
    }
});

WebSocket.prototype.send = new Proxy(function(data) {

    if (data instanceof DataView) {
        data = new Uint8Array(data.buffer);
    } else if (data instanceof ArrayBuffer) {
        data = new Uint8Array(data);
    }

    console.log('Outgoing ->', data);

    return send.apply(this, arguments);
}, {});
