/**
	@author: Amol Kapoor
	@date: 1-23-16
	@version: 0.1

	Description: Server for sending requests to user
*/

var io = require('socket.io').listen(8010);

//On an io socket connection...
//Main
io.sockets.on('connection', function(socket) {
	console.log("CONNECTED");

	socket.on('disconnect', function() {
     	console.log('Got disconnect!');
   	});
});

function emitData(data) {
	io.emit('serverToClient', data); 
}


function testData() {

	var subjList = ['trump', 'sanders', 'cruz', 'clinton', 'democrat', 'republican']
		
	var index = Math.floor(Math.random()*subjList.length)

	var dummyData = {
	  loc: {
	    state: Math.floor(Math.random() * 50) + ""
	  }, 
	  sent: Math.random(),
	  subj: subj 
	}


	setTimeout(testData, 1);
}