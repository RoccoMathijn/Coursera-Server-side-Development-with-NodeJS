var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Verify = require('./verify');

var Leaders = require('../models/leaders')

var leaderRouter = express.Router();

leaderRouter.use(bodyParser.json());

leaderRouter.route('/')

.get(Verify.verifyOrdinaryUser, function(req,res,next){
  Leaders.find({}, function(err, leaders) {
    if (err) throw err;
    res.json(leaders);
  });
})

.post(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next){
  Leaders.create(req.body, function(err, leader) {
    if (err) throw err;

    console.log('Created leader');
    var id = leader._id;
    res.writeHead(200, {
      'Content-Type': 'text/plain'
    });

    res.end('Added the leader with id: ' + id);
  });
})

.delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next){
  Leaders.remove({}, function (err, leader) {
    if (err) throw err;
    res.json(leader);
  });
})

leaderRouter.route('/:leaderId')

.get(Verify.verifyOrdinaryUser, function(req,res,next){
  Leaders.findById(req.params.leaderId, function (err, leader) {
    if (err) throw err;
    res.json(leader);
  })
})

.put(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next){
  Leaders.findByIdAndUpdate(req.params.leaderId, {
       $set: req.body
  }, {
    new: true
  }, function (err, leader) {
    if(err) throw err;

    res.json(leader);
  });
})

.delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next){
  Leaders.remove (req.params.leaderId, function (err, leader) {
    if (err) throw err;

    res.json(leader);
  });
})

module.exports = leaderRouter;
