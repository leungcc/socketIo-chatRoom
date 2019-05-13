const static = require('node-static');
const http = require('http');
const file = new (static.Server)();
const app = http.createServer(function(req, res) {
  file.serve(req, res);
  res.end('Hello socket.io server part..');
}).listen(2019);

const io = require('socket.io').listen(app);

io.sockets.on('connection', socket => {
  const username = socket.handshake.query.name;
  console.log(`${username} on connection....`)

  //log工具函数
  function log() {
    const array = ['>>> Message from server: '];
    for(let i=0; i<arguments.length; i++) {
      array.push(arguments[i]);
    }
    socket.emit('log', array);
  }

  //监听'message'
  socket.on('message', message => {
    var roomId = Object.keys(socket.rooms)[0];
    var result = {
      socketId: socket.id,
      username,
      message
    };
    log('Got', message);
    io.sockets.in(roomId).emit('message', result);
  });

  //监听'create or join'
  socket.on('create or join', room => {
    var clientsInRoom = io.sockets.adapter.rooms[room];
    var numClients = clientsInRoom ? Object.keys(clientsInRoom.sockets).length : 0; //房间人数
    log(`Room ${room} has ${numClients} client(s)`);
    log('Request to create or join room ' + room);
    //逻辑业务
    if(numClients === 0) {
      socket.join(room);
      socket.emit('created', room);
    } else if(numClients > 0 && numClients <= 3) {
      io.sockets.in(room).emit('join', room);
      socket.join(room);
      socket.emit('full', room);
    } else {
      socket.emit('full', room);
    }
  });

  //监听'disconnect'
  socket.on('disconnect', () => {
    console.log(`${username} 已下线`);
    var clientsInRoom = io.sockets.adapter.rooms[room];
    var numClients = clientsInRoom ? Object.keys(clientsInRoom.sockets).length : 0; //房间人数
    console.log(`numClients=${numClients}`)
  });
})

console.log('server is already start');

