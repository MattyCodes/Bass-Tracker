var port       = process.env.PORT || 8080;
var express    = require('express');
var app        = express();
var morgan     = require('morgan');
var mongoose   = require('mongoose');
var bodyParser = require('body-parser');
var router     = express.Router();
var appRoutes  = require('./app/routes/api')(router);
var path       = require('path');
var passport   = require('passport');
var social     = require('./app/passport/passport')(app, passport);

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, sid");
  res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE, PUT");
  next();
});

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.use('/api', appRoutes);

// var promise = mongoose.connect('mongodb://MattyCodes:Micron12@ds127034.mlab.com:27034/bassdb', {
//   useMongoClient: true
// }, function(err) {
//     if (err)  {
//       console.log('Not connected to MongoDB: ' + err);
//     } else {
//       console.log('Connected to MongoDB...');
//     }
// });

var options = { server: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } },
                replset: { socketOptions: { keepAlive: 300000, connectTimeoutMS : 30000 } } };

var mongodbUri = 'mongodb://bassdata:bassmaster@ds127034.mlab.com:27034/bassdb';

mongoose.connect(mongodbUri, options);
var conn = mongoose.connection;

conn.on('error', console.error.bind(console, 'connection error:'));

conn.once('open', function() {
  console.log('Connected to MongoDB...');
});

app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname + '/public/app/views/index.html'));
});

app.listen(port, function() {
  console.log("Running node server...");
});
