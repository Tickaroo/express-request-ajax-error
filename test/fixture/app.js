var ajax = require('request-ajax');
var express = require('express');
var Backbone = require('backbone');
var requestAjaxError = require('../../');

Backbone.ajax = ajax;
var app = express();

app.use(function(req, res, next) {
  // bind error handler to `res.locals`
  res.locals.apiError = requestAjaxError(req, res, next);
  res.locals.apiErrorLogout = requestAjaxError(req, res, next, function(){
    res.redirect('/');
  });
  res.locals.backboneApiErrorLogout = requestAjaxError.backbone(req, res, next, function(){
    res.redirect('/');
  });
  next();
});

app.get('/', function(req, res, next){
  res.send('home');
});

app.get('/data', function(req, res, next){
  ajax({
    url: 'http://localhost:1235/data',
    accessToken: true,
    error: res.locals.apiError,
    success: function (data) {
      res.send('has data: ' + data.data);
    }
  });
});

app.get('/impossible', function(req, res, next){
  res.locals.apiError();
});

app.get('/error', function(req, res, next){
  ajax({
    url: 'http://localhost:1235/does_not_matter',
    error: res.locals.apiError,
    success: function () {
      res.send('yo');
    }
  });
});

app.get('/api_error', function(req, res, next){
  ajax({
    url: 'http://localhost:1235/error',
    accessToken: true,
    error: res.locals.apiError,
    success: function () {
      res.send('yo');
    }
  });
});

app.get('/api_error_dont_logout', function(req, res, next){
  ajax({
    url: 'http://localhost:1235/error',
    accessToken: true,
    error: res.locals.apiErrorLogout,
    success: function () {
      res.send('yo');
    }
  });
});

app.get('/unauthorized', function(req, res, next){
  ajax({
    url: 'http://localhost:1235/forbidden',
    accessToken: true,
    error: res.locals.apiError,
    success: function () {
      res.send('yo');
    }
  });
});

app.get('/unauthorized_logout', function(req, res, next){
  ajax({
    url: 'http://localhost:1235/unauthorized',
    accessToken: true,
    error: res.locals.apiErrorLogout,
    success: function () {
      res.send('yo');
    }
  });
});


app.get('/concurrent', function(req, res, next){
  ajax({
    url: 'http://localhost:1235/unauthorized?a=1',
    accessToken: true,
    error: res.locals.apiErrorLogout
  });
  ajax({
    url: 'http://localhost:1235/unauthorized?a=2',
    accessToken: true,
    error: res.locals.apiErrorLogout
  });
});


app.get('/backbone/auth_error', function(req, res, next){
  var model = new Backbone.Model()
  model.url = 'http://localhost:1235/error'
  model.fetch({
    error: res.locals.backboneApiErrorLogout
  });
});


app.get('/backbone/api_error', function(req, res, next){
  var model = new Backbone.Model()
  model.url = 'http://localhost:1235/error?foo=bar'
  model.fetch({
    accessToken: true,
    error: res.locals.backboneApiErrorLogout
  });
});


app.get('/backbone/unauthorized_logout', function(req, res, next){
  var model = new Backbone.Model()
  model.url = 'http://localhost:1235/unauthorized'
  model.fetch({
    accessToken: true,
    error: res.locals.backboneApiErrorLogout
  });
});



app.use(function(err, req, res, next) {
  var detail = err.message || err.text || err.toString();
  res.status(err.status || 500)
  res.send(detail + err.url + err.status);
  next();
});

module.exports = app;
