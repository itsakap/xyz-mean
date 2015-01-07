// server.js
var bcrypt = require('bcryptjs');
var bodyParser = require('body-parser');
var cors = require('cors');
var express = require('express');
var jwt = require('jwt-simple');
var moment = require('moment');
var mongoose = require('mongoose');
var path = require('path');
var request = require('request');
var compress = require('compression');

var config = require('./config');

var User = mongoose.model("User", new mongoose.Schema({
  instagramId: { type: String, index: true },
  username: String,
  fullName: String,
  picture: String,
  accessToken: String,
  collections: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Collection' }],
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Favorite' }]
}));
var Post = mongoose.model('Post', new mongoose.Schema({
  instagramId: { type: String, index: true },
  collections: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Collection' }]
}));
var Collection = mongoose.model("Collection", new mongoose.Schema({
  name: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }]
}));
mongoose.connect(config.db);

var app = express();

// use cors with corsOptions in order to allow a separate client to access
var corsOptions = {
  origin: process.env.origin || 'http://localhost:8000',
  credentials: true
};

var oneMonth = 2628; // 2628 units of time evaluates to approx. one month
 
app.set('port', process.env.PORT || 3000);
app.use(compress());
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public'), { maxAge: oneMonth }));

function createToken(user) {
  var payload = {
    exp: moment().add(14, 'days').unix(),
    iat: moment().unix(),
    sub: user._id
  };
  
  return jwt.encode(payload, config.tokenSecret);
}

function isAuthenticated(req, res, next) {
  if (!(req.headers && req.headers.authorization)) {
    return res.status(400).send({ message: 'You did not provide a JSON Web Token in the Authorization header.' });
  }

  var header = req.headers.authorization.split(' ');
  var token = header[1];
  var payload = jwt.decode(token, config.tokenSecret);
  var now = moment().unix();
  if (now > payload.exp) {
    return res.status(401).send({ message: "Token has expired."  });
  }

  User.findById(payload.sub, function(err, user) {
    if(!user) {
      return res.status(400).send({ message: 'User no longer exists.' });
    }

    req.user = user;
    next();
  })
}
function checkForAuthentication(req, res, next){
  if(req.headers && req.headers.authorization){
    var header = req.headers.authorization.split(' ');
    var token = header[1];
    var payload = jwt.decode(token, config.tokenSecret);
    var now = moment().unix();
  
    if (now > payload.exp) {
      return res.status(401).send({ message: "Token has expired."  });
    }
    User.findById(payload.sub, function(err, user) {
      if(user) { req.user = user; }
      next();
    })
  }
  else { next(); }
}

app.post("/register", function(req, res){
  User.findOne({ email: req.body.email }, function(err, existingUser){
    if (existingUser) {
      return res.status(409).send({ message: {email: 'Email is already taken.'} });
    }
    var user = new User({
      email: req.body.email,
      password: req.body.password
    });

    bcrypt.genSalt(10, function(err, salt) {
      bcrypt.hash(user.password, salt, function(err, hash) {
        user.password = hash;

        user.save(function(){
          var token = createToken(user);
          res.send({ token: token, user: user });
        });
      });
    });
  });
});
app.post('/auth/instagram', function(req, res) {
  var accessTokenUrl = 'https://api.instagram.com/oauth/access_token';

  var params = {
    client_id: req.body.clientId,
    redirect_uri: req.body.redirectUri,
    client_secret: config.clientSecret,
    code: req.body.code,
    grant_type: 'authorization_code'
  };
 
 // Step 1. Exchange authorization code for access token.
  request.post({ url: accessTokenUrl, form: params, json: true }, function(error, response, body) {
   // Step 2a. Link user accounts.
    if (req.headers.authorization) {
      User.findOne({ instagramId: body.user.id }, function(err, existingUser) {
       
        var token = req.headers.authorization.split(' ')[1];
        var payload = jwt.decode(token, config.tokenSecret);
       
        User.findById(payload.sub, '+password', function(err, localUser) {
          if (!localUser) {
            return res.status(400).send({ message: 'User not found.' });
          }
       
          // Merge two accounts.
          if (existingUser) {
       
            existingUser.email = localUser.email;
            existingUser.password = localUser.password;
       
            localUser.remove();
       
            existingUser.save(function() {
              var token = createToken(existingUser);
              return res.send({ token: token, user: existingUser });
            });
       
          } else {
            // Link current email account with the Instagram profile information.
            localUser.instagramId = body.user.id;
            localUser.username = body.user.username;
            localUser.fullName = body.user.full_name;
            localUser.picture = body.user.profile_picture;
            localUser.accessToken = body.access_token;
       
            localUser.save(function() {
              var token = createToken(localUser);
              res.send({ token: token, user: localUser });
            });
       
          }
        });
      });
    } else { // Step 2b. Create a new user account or return an existing one.
      User.findOne({ instagramId: body.user.id }, function(err, existingUser) {
        if (existingUser) {
          var token = createToken(existingUser);
          return res.send({ token: token, user: existingUser });
        }

        var user = new User({
          instagramId: body.user.id,
          username: body.user.username,
          fullName: body.user.full_name,
          picture: body.user.profile_picture,
          accessToken: body.access_token
        });

        user.save(function() {
          var token = createToken(user);
          res.send({ token: token, user: user });
        });
      });
    }
 });
});
app.get('/api/media/search/', checkForAuthentication, function(req, res) {
  var mediaUrl = 'https://api.instagram.com/v1/media/search/';
  var accessToken;
  if (req.user){ accessToken = req.user.accessToken };
  var params = { access_token: accessToken || process.env.XYZ_INSTAGRAM_ACCESS_TOKEN,
                 lat: req.query.lat,
                 lng: req.query.lng,
                 min_timestamp: req.query.minTime,
                 max_timestamp: req.query.maxTime,
                 distance: req.query.dist || 5000,
                 count: req.query.maxResults || 100 };
  request.get({ url: mediaUrl, qs: params, json: true }, function(error, response, body) {
    var posts = {}, tags={}, range = {earliest: Infinity, latest: 0};
    body.data.forEach(function(post, index){
      var caption = post.caption || {text:''};
      if(post.type == 'image'){
        posts[post.id] = {
          idKey: post.id,
          latitude: post.location.latitude,
          longitude: post.location.longitude,
          mediaSmall: post.images.thumbnail.url,
          mediaLarge: post.images.standard_resolution.url,
          caption: caption.text,
          link: post.link,
          liked: post.user_has_liked
        };
        if(range.earliest > parseInt(post.created_time)) {range.earliest = parseInt(post.created_time);}
        if(range.latest < parseInt(post.created_time)) {range.latest = parseInt(post.created_time);}
        post.tags.forEach(function(tag, index){
          // the 'tag' key is associated with a count (# of posts the tag appears in), AND reference to the post
          if(tags[tag] != undefined){
            tags[tag]['count'] += 1;
            tags[tag]['posts'].push(post.id);
          }
          else tags[tag] = {count: 1, posts: [post.id]};

        })
      }
    });
    //convert epochs to dates before sending
    earliestDate = new Date(range.earliest*1000);
    latestDate = new Date(range.latest*1000);
    var formatDate = function(date){
      var month = date.getMonth() + 1;
      var hour = date.getHours();
      var minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
      return month + '/' + date.getDate() + '/' + date.getFullYear() + ", " + hour + ":" + minutes;
    }
    range.earliest = formatDate(earliestDate);
    range.latest = formatDate(latestDate);
    var toSend = {data:posts, tags:tags, range:range};
    res.send(toSend);
  })
});
app.put('/collections/:id', isAuthenticated, function(req,res, next){
  Collection.findById(req.params.id, function(err, collection){
    if(!err){
      collection.name = req.body.name;
      collection.save(function(err, coll){
        res.json(coll);
      })
    }
  });
});
// might want to add one more thing to check that the user owns the collection
app.get('/collections', isAuthenticated, function(req, res) {
  // search db for all collections belonging to the authenticated user, and return
  var user = req.user;
  Collection.find(user.collections, function(err, collections){
    if(!err){ res.send(collections); }
  });
});
app.post('/collections', isAuthenticated, function(req, res, next){
  var collection = new Collection(req.body), user = req.user;

  /*if(req.post) { /* add post to collection }*/
  collection.user = user;

  collection.save(function(err, post){

    if(err){ return next(err); }
    req.user.collections.push(collection);
    req.user.save(function(err, user){
      if(err){ return next(err); }
      Collection.find(user.collections, function(err, collections){

        if(!err) { res.json(collections); }
      })
    })
  });
});
// route for adding a post to a collection... use some sort of find or create query w/ mongoose
// app.put('/collection/:collection/post/:post', isAuthenticated, function(req, res, next){
  // find the collection
  // find or create the post
  // add the post to the collection if it's not already in the collection
// });
// route for changing the name of a collection

// route for deleting a collection.
app.delete('/collections/:id', isAuthenticated, function(req, res){
  var user = req.user;
  Collection.findById(req.params.id).remove().exec();
  Collection.find(user.collections, function(err, collections){
    if(!err){ res.send(collections); }
  })
});
app.get('/api/feed', isAuthenticated, function(req, res) {
  var feedUrl = 'https://api.instagram.com/v1/users/self/feed';
  var params = { access_token: req.user.accessToken };
 
  request.get({ url: feedUrl, qs: params, json: true }, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      res.send(body.data);
    }
  });
});
app.get('/api/media/:id', isAuthenticated, function(req, res, next) {
  var mediaUrl = 'https://api.instagram.com/v1/media/' + req.params.id;
  var params = { access_token: req.user.accessToken };
 
  request.get({ url: mediaUrl, qs: params, json: true }, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      res.send(body.data);
    }
  });
});
app.post('/api/like', isAuthenticated, function(req, res, next) {
  var mediaId = req.body.mediaId;
  var accessToken = { access_token: req.user.accessToken };
  var likeUrl = 'https://api.instagram.com/v1/media/' + mediaId + '/likes';
 
  request.post({ url: likeUrl, form: accessToken, json: true }, function(error, response, body) {
    if (response.statusCode !== 200) {
      return res.status(response.statusCode).send({
        code: response.statusCode,
        message: body.meta.error_message
      });
    }
    res.status(200).end();
  });
});

app.listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});