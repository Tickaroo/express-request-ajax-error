var express = require('express');

var app = express();

app.get('/data', function(req, res, next){
  res.json({data: true});
});

app.get('/error', function(req, res, next){
  res.status(500);
  res.json({error: true});
});

app.get('/unauthorized', function(req, res, next){
  res.status(401);
  res.json({access: false});
});

app.get('/forbidden', function(req, res, next){
  res.status(403);
  res.json({forbidden: true});
});

app.get('/not_found', function(req, res, next){
  res.status(404);
  res.json({not_found: true});
});

module.exports = app;
