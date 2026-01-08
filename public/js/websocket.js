// FENIX Project Manager - WebSocket Client
// Real-time communication client using Socket.io

export class WebSocketClient {
  constructor(url = window.location.origin) {
    this.url = url;
    this.socket = null;
    this.connected = false;
    this.handlers = {
      progress: [],
      status: [],
      notification: [],
    };
  }

  /**
   * Connect to WebSocket server
   */
  connect() {
    if (this.socket) {
      console.log('[WebSocket] Already connected');
      return;
    }

    // Load Socket.io client from CDN
    if (!window.io) {
      const script = document.createElement('script');
      script.src = 'https://cdn.socket.io/4.6.1/socket.io.min.js';
      script.onload = () => this.initializeSocket();
      document.head.appendChild(script);
    } else {
      this.initializeSocket();
    }
  }

  /**
   * Initialize Socket.io connection
   */
  initializeSocket() {
    this.socket = window.io(this.url, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    this.socket.on('connect', () => {
      console.log('[WebSocket] Connected:', this.socket.id);
      this.connected = true;
    });

    this.socket.on('disconnect', () => {
      console.log('[WebSocket] Disconnected');
      this.connected = false;
    });

    this.socket.on('connect_error', (error) => {
      console.error('[WebSocket] Connection error:', error);
    });

    // Set up event listeners
    this.socket.on('progress', (data) => {
      console.log('[WebSocket] Progress event:', data);
      this.handlers.progress.forEach(handler => handler(data));
    });

    this.socket.on('status', (data) => {
      console.log('[WebSocket] Status event:', data);
      this.handlers.status.forEach(handler => handler(data));
    });

    this.socket.on('notification', (data) => {
      console.log('[WebSocket] Notification event:', data);
      this.handlers.notification.forEach(handler => handler(data));
    });
  }

  /**
   * Subscribe to workflow updates
   */
  subscribe(workflowId) {
    if (!this.socket) {
      console.error('[WebSocket] Not connected');
      return;
    }

    console.log('[WebSocket] Subscribing to workflow:', workflowId);
    this.socket.emit('subscribe', workflowId);
  }

  /**
   * Unsubscribe from workflow updates
   */
  unsubscribe(workflowId) {
    if (!this.socket) {
      console.error('[WebSocket] Not connected');
      return;
    }

    console.log('[WebSocket] Unsubscribing from workflow:', workflowId);
    this.socket.emit('unsubscribe', workflowId);
  }

  /**
   * Register event handler
   */
  on(event, handler) {
    if (this.handlers[event]) {
      this.handlers[event].push(handler);
    }
  }

  /**
   * Remove event handler
   */
  off(event, handler) {
    if (this.handlers[event]) {
      this.handlers[event] = this.handlers[event].filter(h => h !== handler);
    }
  }

  /**
   * Disconnect from server
   */
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.connected = false;
    }
  }

  /**
   * Check if connected
   */
  isConnected() {
    return this.connected;
  }
}
