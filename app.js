var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
// disable layout
  // disable layout
app.set("view options", {layout: false});

app.engine('html', require('ejs').renderFile);
app.set('view **engine**', 'html');

app.set('port', '3000');
// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;

var http = require('http');
var server = http.createServer(app),
io = require('socket.io').listen(server);

server.listen(app.get('port'),function(){
    console.log("RunningPOr"+app.get('port'));
});

var activeClient = 0;
io.sockets.on('connection', function(socket){
    activeClient++;
    socket.on('enter',function(data){
        var nickName = preventScript(data.nickName);
    
        io.sockets.emit('message',{nickName : nickName, clients:activeClient});
    });
     socket.on('newchat',function(data){
         var chat = preventScript(data.chat);
         var nickName = preventScript(data.nickName);
  
         io.sockets.emit('chat',{nickName : nickName, chat:chat});
    });
    socket.on('disconnect',function(data){
        activeClient--;
        io.sockets.emit('leave',{clients:activeClient});
    });
   
});

var preventScript = function(_str){
    var str = _str;
    str = str.replace(/</gi,'&lt;');
    str = str.replace(/>/gi,'&gt;');
    str = str.replace(/호우/gi,"천재");
    return str;
};

