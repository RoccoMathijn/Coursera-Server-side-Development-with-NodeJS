var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var Promotion = require('../models/promotions');

var promoRouter = express.Router();

promoRouter.use(bodyParser.json());

promoRouter.route('/')

.get(function(req,res,next){
  Promotion.find({}, function(err, promotions) {
    if (err) throw err;
    res.json(promotions);
  });
})

.post(function(req, res, next){
  Promotion.create(req.body, function(err, promotion) {
    if (err) throw err;

    console.log('Promotion created');
    var id = promotion._id;
    res.writeHead(200, {
      'Content-Type': 'text/plain'
    });

    res.end('Added the promotion with id: ' + id);
  })
})

.delete(function(req, res, next){
  Promotion.remove({}, function(err, promotions) {
    if (err) throw err;
    req.json(promotions);
  });
})

promoRouter.route('/:promotionId')

.get(function(req,res,next){
  Promotion.findById(req.params.promotionId, function (err, promotion) {
    if (err) throw err;
    res.json(promotion);
  });
})

.put(function(req, res, next){
  Promotion.findByIdAndUpdate(req.params.promotionId, {
    $set: req.body
  }, {
    new: true
  }, function (err, promotion) {
    if(err) throw err;

    res.json(promotion);
  });
})

.delete(function(req, res, next){
  Promotion.remove(req.params.promotionId, function(err, promotion) {
    if (err) throw err;
    res.json(promotion);
  });
})

module.exports =  promoRouter;
