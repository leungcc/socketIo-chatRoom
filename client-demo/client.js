//import io from './node_modules/socket.io-client/dist/socket.io.dev.js';
import io from './node_modules/socketio-client';

var room  = prompt('Enter Room Name:');

//与服务器建立socket连接
const socket = io.connect();

if(room !== '') {
  console.log('Joining room ' + room);
  socket.emit('create or join', room);
}

socket.on('empty', room => {
  console.log(`Room ${room} is empty`);
})

socket.on('join', room => {
  console.log(`Making request to join room ${room}`);
})

socket.on('log', array => {
  console.log(array)
})