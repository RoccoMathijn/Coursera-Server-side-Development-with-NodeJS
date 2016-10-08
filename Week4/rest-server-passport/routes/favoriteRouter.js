var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Verify = require('./verify');

var favoriteRouter = express.Router();

var Favorites = require('../models/favorites');

favoriteRouter.use(bodyParser.json());

favoriteRouter.route('/')

.get(Verify.verifyOrdinaryUser, function(req,res,next){
  Favorites.find({postedBy: req.decoded._doc._id})
    .populate('postedBy')
    .populate('dishes')
    .exec(function (err, favorite) {
    if (err) throw err;
    res.json(favorite);
  });
})

.post(Verify.verifyOrdinaryUser, function(req, res, next){
  Favorites.findOneAndUpdate({
  	postedBy: req.decoded._doc._id}, {}, {
    new: true,
		upsert: true
	}, function (err, favorite) {
    if(err) throw err;
    if(favorite.dishes.indexOf(req.body._id) > -1) {
      var err = new Error('Whoops, you already have this dish favorited');
      err.status = 403;
      return next(err);
    }
    favorite.dishes.push(req.body._id);
    favorite.save(function (err, favorite) {
      if (err) throw err;
      res.json(favorite);
    });
  });
})

.delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next){
  Favorites.remove({
  	postedBy: req.decoded._doc._id
  }, function (err, favorite) {
    if (err) throw err;
    res.json(favorite);
  });
});

favoriteRouter.route('/:dishId')

.delete(Verify.verifyOrdinaryUser, function (req, res, next) {
  Favorites.findOne({
  	postedBy: req.decoded._doc._id
  },
  function (err, favorite) {
    console.log
    favorite.dishes.pull(req.params.dishId);
    favorite.save(function(err, resp) {
      if(err) throw err;
      res.json(resp);
    });
  });
});


module.exports = favoriteRouter;