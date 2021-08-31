const fs = require('fs');
const https = require('https');
const SI = require('socket.io');
const options = {
    key : fs.readFileSync('key.pem'),
    cert : fs.readFileSync('cert.pem')
};
const httpsServer = https.createServer(options);

const IOOptions = {
    cors : {
        // origin: "*",
        origin : '192.168.0.123:8083',
        methods : ['GET', 'POST']
    }
};
const io = SI(httpsServer, IOOptions);

const userMap = {};

const UserDisconnectHandler = (socket) => {

};

const SpreadOffer = ({ studentId, offer }) => {
    // console.log('SpreadOffer');
    Object.values(userMap)
          .map(user => {
              if(studentId !== user.studentId){
                  user.socket.emit('offer', {
                      from : studentId,
                      offer
                  });
              }
          });
    // console.log('this', this);
    // console.log(offer);
};

const SpreadICE = ({ studentId, ice }) => {
    // console.log('SpreadICE');
    Object.values(userMap)
          .map(user => {
              if(studentId !== user.studentId){
                  user.socket.emit('ice', {
                      from : studentId,
                      ice
                  });
              }
          });
};

const SendAnswer = ({ answer, from, to }) => {
    let targetUser = userMap[to];
    if(!targetUser){
        return;
    }
    targetUser.socket.emit('answer', {
        from,
        answer
    });
    // console.log('SendAnswer',message);
};

const UserJoinHandler = (socket, { studentId }) => {
    userMap[studentId] = {
        studentId,
        socket
    };

    // console.log(userMap);
};

io.on('connection', socket => {
    // socket.join('classroom');
    // console.log(socket.id);
    socket.on('disconnect', UserDisconnectHandler);
    socket.on('apply-join', (data) => {
        UserJoinHandler(socket, data);
        // socket.emit('hello', 'world', 'bitch');
        // io.emit('new-member', idList);
    });

    socket.on('offer', SpreadOffer);

    socket.on('answer', SendAnswer);

    socket.on('ice', SpreadICE);

});

httpsServer.listen(3000);