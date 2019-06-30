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
const RoomManager = require('./RoomManager').default;

const io = socketio.listen(server)
// 클라이언트가 접속했을 때의 이벤트 설정 --- (※4)

io.on('connection', (socket) => {
  console.log('사용자 접속:', socket.client.id)

  RoomManager.addListeners(socket);
})
