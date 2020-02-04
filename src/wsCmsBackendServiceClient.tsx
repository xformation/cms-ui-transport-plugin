
const cfg = {
    URL: "ws://localhost:4000/websocket/tracker/websocket"
}

const wsCmsBackendServiceSingletonClient = (function () {
    let instance: any;

    function createInstance() {
        const socket = new WebSocket(cfg.URL);
        return socket
    }

    return {
        getInstance: function () {
            // if (!instance) {
                instance = createInstance();
            // }
            return instance; 
        }
    };
})();

export default wsCmsBackendServiceSingletonClient;