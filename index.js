var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var logger = require('morgan');
var path = require('path')
var twit = require('twit')
var mysql = require('mysql');



/********MYSQL**********/
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: ""
});

con.connect(function(err) {
  if (!err){
    console.log("Connected to database and ready to stream!");
  }else{
    console.log(err);
  }
});
/***********************/



/*********TWIT**********/
var config = require('./config.js');

var Twitter = new twit(config);
var stream;

//twitter stream functiontionality
var streamImages = function(params, socket) {

  // initialize the twitter stream with the supplied parameters.
  var stream = Twitter.stream('statuses/filter', params)

  // Output to console and webpage.
  console.log('Stream connected with supplied parameters')
  socket.emit('message', 'Searching with supplied parameters..')

  //Event handler for a tweet coming in from the stream.
  stream.on('tweet', function (tweet) {
    // console.log(tweet.entities) // DEBUG

    //Check if the tweet has media.
    if(tweet.entities.hasOwnProperty('media')){

      // Log the tweet if true.
      console.log(tweet.user.screen_name)
      console.log(tweet.entities.media[0])

      // Display the tweet on the webpage.
      socket.emit('result', {
        UserName: tweet.user.screen_name,
        TweetURL: tweet.entities.media[0].media_url
      })

      // Insert the tweet into the database for parsing.
      var sql = `INSERT INTO twitter_bot.tb_twitter_pictures (TwitterUsername, TwitterPicURL, TweetURL, ApprovedPic) VALUES (${"'"+tweet.user.screen_name+"'"}, ${"'"+tweet.entities.media[0].media_url+"'"}, ${"'"+tweet.entities.media[0].url+"'"}, 0);`
      con.query(sql, function (err, result) {
        if (!err){
          console.log("Result: " + result);
        }else{
          console.log(err);
        }
      });
    }else{
      // Log the tweet and state that it had no media.
      console.log(tweet.user.screen_name + " tweeted with no media.")
    }
  })
}

var stopStream = function(){
  stream.stop();
}
/***********************/

/***Express & Socket***/
app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'source')));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

// Log socket connection
io.on('connection', function(socket){
  console.log('a user connected');
});

// Log socket disconnection
io.on('connection', function(socket){
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});

// Accept query from user and call streamImages to begin watching the tweet stream.
io.on('connection', function(socket){
  socket.on('search', function(msg){
    streamImages(msg, socket)
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
/**********************/
