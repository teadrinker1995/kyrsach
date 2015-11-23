var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
//var users = require('./routes/users');

var app = express();

//session
var mysql      = require('mysql');
var session = require('express-session');
var SessionStore = require('express-mysql-session');

var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'VLtest'
});

var sessionStore = new SessionStore({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'VLtest',
    schema: {
        tableName: 'session_test',
        columnNames: {
            session_id: 'session_id',
            expires: 'expires_column_name',
            data: 'data_column_name'
        }
    }
}, connection);
//app.use(session({
//    key: 'session_cookie_name',
//    secret: 'session_cookie_secret',
//    store: sessionStore,
//    resave: true,
//    saveUninitialized: true
//}));
//if (sessionStore) console.log(sessionStore);
//app.use(function (req, res, next) {
//    req.sessionStore['name'] = 'Ivan';
//    console.log(req.sessionStore);
//    next();
//});
//end session
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
//app.use('/users', users);
app.get('/admin', function (req, res, next) {
    res.send('GET request to admin');
});
app.get('/signUp', function (req, res, next) {
    res.send('GET request to signUp');
});

connection.connect();
app.post('/index', function (req, res){

    var login = req.body.login;
    var password = req.body.password;

    connection.query('SELECT * FROM `user`', function(err, rows, fields) {
        if (err) throw err;
        for (key in rows) {
            if (rows[key].login == login) {
                if (rows[key].pwd == password) {
                    session({
                        key: 'session_cookie_name',
                        secret: 'session_cookie_secret',
                        store: sessionStore,
                        resave: true,
                        saveUninitialized: true
                    });
                    if (sessionStore) console.log('Session success');
                    console.log('Login success');
                }
            }
        }
    });

    res.redirect('/');

});

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
