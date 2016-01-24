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

function testData() {

	var subjList = ['trump', 'sanders', 'cruz', 'clinton', 'democrat', 'republican']
		
	var index = Math.floor(Math.random()*subjList.length);
	var subj = [subjList[index]];

	var dummyData = {
	  loc: {
	    state: Math.floor(Math.random() * 51) + ""
	  }, 
	  sent: Math.random()*2 - 1,
	  subj: subj
	}

	module.exports.emitData(dummyData);

	setTimeout(testData, 100);
}

module.exports = {
	emitData: function(data) {
		console.log(data)
		io.emit('serverToClient', data); 
	}
}

testData();