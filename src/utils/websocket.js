let ws;
const listeners = new Set();

export const connectWebSocket = () => {
  if (ws && (ws.readyState === WebSocket.CONNECTING || ws.readyState === WebSocket.OPEN)) {
    return ws;
  }

  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  // Connect to the same host in prod or localhost:5000 in dev
  const host = window.location.hostname === 'localhost' ? 'localhost:5000' : window.location.host;
  
  try {
    ws = new WebSocket(`${protocol}//${host}`);
    console.log(`Connecting to WebSocket: ${protocol}//${host}`);

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        console.log('WS Message received:', message);
        listeners.forEach((listener) => listener(message));
      } catch (err) {
        console.error('Error parsing WS message:', err);
      }
    };

    ws.onclose = () => {
      console.log('WebSocket connection closed. Reconnecting in 3 seconds...');
      setTimeout(connectWebSocket, 3000);
    };

    ws.onerror = (err) => {
      console.error('WebSocket encountered an error:', err);
      ws.close();
    };
  } catch (err) {
    console.error('Failed to establish WebSocket connection:', err);
  }

  return ws;
};

export const subscribeToWebSocket = (callback) => {
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
};
