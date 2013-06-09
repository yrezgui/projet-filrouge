SOCKET.IO

var socket = io.connect('http://localhost:8010');
socket.join('2013-05');
socket.emit('2013-05', {day: 5, count: 25});

matin : 8h-12h (4h - 16 consultations)
après-midi: 13h-17h (4h - 16 consultations)
32 consultations à la journée