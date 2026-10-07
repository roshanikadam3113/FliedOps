import { io } from 'socket.io-client';

let socket = null;

export const getSocket = () => {
  if (!socket) {
    // Connect to backend server on current host or port 5000
    const serverUrl = window.location.origin.includes('localhost')
      ? 'http://localhost:5000'
      : window.location.origin;

    const token = localStorage.getItem('fieldops_token');

    socket = io(serverUrl, {
      autoConnect: true,
      transports: ['websocket', 'polling'],
      auth: { token }
    });

    socket.on('connect', () => {
      console.log('Socket connected successfully:', socket.id);
      
      // Auto join user room if user saved in localStorage
      const savedUser = localStorage.getItem('fieldops_user');
      if (savedUser) {
        try {
          const user = JSON.parse(savedUser);
          if (user?._id) {
            socket.emit('join', user._id);
          }
        } catch (err) {
          console.error('Socket join parse error:', err);
        }
      }
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });
  }

  return socket;
};

export const joinUserRoom = (userId) => {
  const s = getSocket();
  if (s && userId) {
    s.emit('join', userId);
  }
};

export const subscribeToEvent = (eventName, callback) => {
  const s = getSocket();
  if (s) {
    s.on(eventName, callback);
    return () => {
      s.off(eventName, callback);
    };
  }
  return () => {};
};
