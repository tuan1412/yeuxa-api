let socket = io("http://localhost:9000/");
socket.emit('test');

socket.on('test', ()=> {
  console.log('test');
}); 