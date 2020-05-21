// ==UserScript==
// @name         WebSocket Data Viewer
// @namespace    https://github.com/Lemons1337/WebSocket-Data-Viewer
// @version      0.1.2
// @description  try to take over the world!
// @author       Lemons
// @match        *://*/*
// @run-at       document-start
// @require      https://cdnjs.cloudflare.com/ajax/libs/msgpack-lite/0.1.26/msgpack.min.js
// @grant        none
// ==/UserScript==

window.msgpack = msgpack;

window.wsData = {};

function parseData(data) {

    if (data instanceof DataView) {
        data = new Uint8Array(data.buffer);
    } else if (data instanceof ArrayBuffer) {
        data = new Uint8Array(data);
    } else {
        try {
            data = JSON.parse(data);
        } catch (err) {}
    }

    try {
        data = msgpack.decode(data);
    } catch (err) {}

    try {
        var bson = new BSON();
        data = bson.deserialize(data);
    } catch (err) {}

    return data;
}

window.WebSocket = new Proxy(WebSocket, {
    construct(target, args) {
        var ws = window.wsHook = new target(...args);

        var domain = new URL(ws.url).origin;

        window.wsData[domain] = {
            received: [],
            sent: []
        };

        var send = ws.send;

        ws.send = function(data) {
            var ret = send.apply(this, arguments);

            data = parseData(data);
            window.wsData[domain].sent.push(data);

            console.log('Outgoing ->', data);

            return ret;
        }

        ws.addEventListener('message', function(message) {
            var data = message.data;

            data = parseData(data);
            window.wsData[domain].received.push(data);

            console.log('Incoming ->', data);
        });

        return ws;
    }
});
