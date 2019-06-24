// --------------------------------------------------------
// 실시간 채팅 서버
// --------------------------------------------------------
// HTTP 서버 생성(애플리케이션 전송 전용) --- (※1)
const express = require('express')
const app = express()
const server = require('http').createServer(app)
const portNo = 3001

server.listen(portNo, () => {
  console.log('서버 실행 완료:', 'http://localhost:' + portNo)
})

// index.html을 공개합니다.  --- (※2)
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

// // 웹 소켓 서버를 실행합니다. --- (※3)
const socketio = require('socket.io')
const io = socketio.listen(server)
// 클라이언트가 접속했을 때의 이벤트 설정 --- (※4)

io.on('connection', (socket) => {
  console.log('사용자 접속:', socket.client.id)

  socket.on('join-room', (msg) => {
    console.log('join room', msg)
    socket.join(msg.roomId)
    io.to(msg.roomId).emit('chat-msg',{name:'',message:`${msg.roomId} 에 접속`})
  })

  socket.on('create-room', (msg) => {
    console.log('create room', msg)
    let roomId = new Date().getTime();
    io.emit('chat-msg', roomId)
    io.to(roomId).emit('chat-msg',{name:'',message:`${msg.roomId} 에 접속`})
  })

  socket.on('chat-msg', (msg) => {
    msg.id = socket.client.id;
    console.log('chat-msg', msg)
    io.to(msg.roomId).emit('chat-msg', msg)
  })

  socket.on('game-info', (msg) => {
    console.log('game-info', msg)
    if(msg.type === 'end'){
      io.to(msg.roomId).emit('game-info', {
        type: 'start',
        answer: '',
        drawer: '',
        timeout: 120
      })
    }
    else{
      io.to(msg.roomId).emit('game-info', msg)
    }
  })

  socket.on('get-players', (msg, ack) => {
    console.log('get players', msg);
    // TODO(jylee) use RoomManager.getPlayers()
    io.to(msg.roomId).clients((err, clients) => {
      if (err) throw err;
      // TODO (jylee): ack(client => clients.map(SocketService.get(client)))
      ack(clients);
    })
  })

  socket.on('ready', (msg) => {

  });
})
