# express-request-ajax-error [![npm version](https://badge.fury.io/js/express-request-ajax-error.svg)](https://www.npmjs.com/package/express-request-ajax-error) [![Build Status](https://travis-ci.org/Tickaroo/express-request-ajax-error.svg?branch=master)](https://travis-ci.org/Tickaroo/express-request-ajax-error)

request-ajax error handler for express

## Install

```bash
$ npm install --save express-request-ajax-error
```

## Usage

Below is a example of usage. [test/fixture/app.js](https://github.com/tickaroo/express-request-ajax-error/blob/master/test/fixture/app.js) also
have a similar example.

```javascript
var express = require('express');
var ajax = require('request-ajax');
var requestAjaxError = require('express-request-ajax-error');

var app = express();
app.use(function(req, res, next) {
  // bind error handler to `res.locals`
  res.locals.apiError = requestAjaxError(req, res, next);
});

app.get('/', function(req, res, next){
  ajax({
    url: 'http://my-api.com/test.json'
    // use as callback
    error: res.locals.apiError,
    success: function(){
      res.send('ok');
    }
  });
});
```

## Logout Callback
If the API returns a 401 code you should logout the user. Provide a logout callback and the module will do it for you.

```javascript
res.locals.apiError = requestAjaxError(req, res, next, function(){
  // logout user here
  res.clearCookie('my_login_cookie');
  res.redirect('/');
});
```

## Thrown Error Object

Variables provided with the error object:

- `err.url` API url that has caused it
- `err.status` API HTTP request statusCode


## `backbone`

Backbone.ajax error handler that maps this module according to Backbone.sync. Below is a example of usage.

```javascript
// one time setup
Backbone.ajax = require('request-ajax');

// ...

// bind to express request
var backboneRequestAjaxError = require('express-request-ajax-error').backbone(req, res, next, function(){
  res.redirect('/');
});

// ...

// use
var model = new Backbone.Model();
model.fetch({
  error: backboneRequestAjaxError
});
```
