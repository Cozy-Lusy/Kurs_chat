var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

const clients = {};

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  console.log('a user connected');
  clients[socket.id] = {
    name: '',
  };

  socket.on('disconnect', function(){
    delete clients[socket.id]
    console.log('user disconnected');
  });

  socket.on('chat message', function(msg){
    console.log(msg);
    if (msg.body !== '') {
    io.emit('chat message', msg); }
  });

  socket.on('new user', function(user){
    for(id in clients) {
      if (clients[id].name === user) {
        console.log('Имя занято')
        io.emit('chek message', 'Имя занято');
        return;
      } 
    }

    clients[socket.id].name = user;
    io.emit('open chat ' + user, user);
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});