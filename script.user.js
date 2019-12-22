// ==UserScript==
// @name         WebSocket Data Viewer
// @namespace    https://github.com/Lemons1337/WebSocket-Data-Viewer
// @version      0.1.1
// @description  try to take over the world!
// @author       Lemons
// @match        *://*/*
// @run-at       document-start
// @grant        none
// ==/UserScript==

var send = WebSocket.prototype.send;

function parseData(data) {

    if (data instanceof DataView) {
        data = new Uint8Array(data.buffer);
    } else if (data instanceof ArrayBuffer) {
        data = new Uint8Array(data);
    } else {
        try {
            data = JSON.parse(data);
        } catch(err) {}
    }

    return data;
}

window.WebSocket = new Proxy(WebSocket, {
    construct(target, args) {
        var ws = window.wsHook = new target(...args);

        ws.addEventListener('message', function(message) {
            var data = message.data;

            data = parseData(data);

            console.log('Incoming ->', data);
        });

        return ws;
    }
});

WebSocket.prototype.send = function(data) {

    data = parseData(data);

    console.log('Outgoing ->', data);

    return send.apply(this, arguments);
}
