var express = require('express');
var router = express.Router();
var indx = express();
var cookieParser = require('cookie-parser');
var mysql = require('mysql');

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'VLtest'
});
connection.connect();
//connection.end();
indx.use(cookieParser());


/* GET home page. */
router.get('/', function(req, res) {

  //console.log('load main page: ' + req.cookies.isLogged);
  connection.query('SELECT * FROM `offenders`', function(err, rows) {
    if (err) throw err;
    console.log(rows);
    res.render('index', {title: 'Express', isLogged: req.cookies.isLogged, list: rows});
  });
});
router.get('/offender', function(req, res) {
  //console.log('load main page: ' + req.cookies.isLogged);
  connection.query('SELECT * FROM `offenders`', function(err, rows) {
    if (err) throw err;
    console.log(rows);
    res.render('index', {title: 'Express', isLogged: req.cookies.isLogged, list: rows});
  });
});
router.post('/', function(req, res) {
  var login = req.body.login;
  var password = req.body.password;
  connection.query('SELECT * FROM `user`', function(err, rows) {
    if (err) throw err;
    for (key in rows) {
      if (rows[key].login == login) {
        if (rows[key].pwd == password) {
          res.cookie('isLogged', 1, {});
          //console.log('set cookie when authorised ' +req.cookies.isLogged);
          res.render('index', {title: 'Express', isLogged: req.cookies.isLogged});
        }
      }
    }
    res.end('Access denied');
  });
});
router.post('/logout', function(req, res) {
  res.cookie('isLogged', 0, {});
  //console.log('logout cookie: ' + req.cookies.isLogged);
  res.render('index', {title: 'Express', isLogged: req.cookies.isLogged});
});
router.post('/update', function(req, res) {
  var id = req.body.id;
  var fullName = req.body.fullName.toLocaleString();
  var number = req.body.number;
  var block = req.body.block;
  var room = req.body.room;
  var date = new Date(req.body.date);
  date = date.toString();
  console.log(date);
  var offender = req.body.offender;
  connection.query("update offenders set id="+id+", fullname='"+fullName+"', number="+number+", block="+block+", room="+room+", date='"+date+"', offender='"+offender+"' where id="+id+"");
});
router.post('/insert', function(req, res) {
  var fullName = req.body.fullName.toLocaleString();
  var number = req.body.number;
  var block = req.body.block;
  var room = req.body.room;
  var date = new Date(req.body.date);
  date = date.toString();
  console.log(date);
  var offender = req.body.offender;
  connection.query("insert into offenders (fullName, number, block, room, date, offender) values ('"+fullName+"',"+number+","+block+","+room+",'"+date+"','"+offender+"')");
});
router.post('/remove', function(req, res) {
  var id = req.body.id;
  connection.query('DELETE FROM `offenders` WHERE `id`='+id+'');
});

module.exports = router;
