// DEPENDENCIES
const app = require('./app');

// CONFIGURATION
require('dotenv').config()
const PORT = process.env.PORT || 3000

const http = require('http').Server(app);

// ATTACH HTTP SERVER TO THE SOCKET.IO
const io = require('socket.io')(http);

// CONNECTION
app.listen(PORT, (error) => {
	if(!error)
		console.log("Server is Successfully Running, and App is listening on port "+ PORT)
	else
		console.log("Error occurred, server can't start", error);
	}
)

// CREATE A NEW CONNECTION
io.on('connection', socket => {
  const id = socket.handshake.query.id
  socket.join(id)

  socket.on('send-message', ({ recipients, text }) => {
    recipients.forEach(recipient => {
      const newRecipients = recipients.filter(res => res !== recipient)
      newRecipients.push(id)
      io.to(recipient).emit('receive-message', {
        recipients: newRecipients, sender: id, text
      });
    });
  });

  socket.on('error', error => {
	console.log(`Socket connection error: ${error}`);
  });
});