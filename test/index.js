var _ = require('lodash');
var expect = require('chai').expect;
var request = require('superagent');
var app = require('./fixture/app.js');
var api = require('./fixture/api.js');

describe('express-request-ajax-error', function() {
  this.slow(200);

  var serverApp;
  var serverApi;

  before(function(done) {
    var after = _.after(2, done);
    serverApp = app.listen(1234, after);
    serverApi = api.listen(1235, after);
  });

  after(function() {
    serverApp.close();
    serverApi.close();
  });

  it('checks the impossible', function(done) {
    return request.get('http://localhost:1234/impossible').end(function(err, res){
      expect(res.text).to.equal('API request returned with status: undefined\nundefined500');
      done();
    });
  });

  it('should throw an error', function(done) {
    return request.get('http://localhost:1234/error').end(function(err, res){
      expect(res.text).to.equal('no auth mechanism definedundefined500');
      done();
    });
  });

  it('should throw an error from api', function(done) {
    return request.get('http://localhost:1234/api_error').end(function(err, res){
      expect(res.text).to.equal('API request returned with status: 500\n{"error":true}http://localhost:1235/error500');
      done();
    });
  });

  it('should call logout callback', function(done) {
    return request.get('http://localhost:1234/unauthorized_logout').end(function(err, res){
      expect(res.text).to.equal('home');
      done();
    });
  });

  it('should not call logout callback', function(done) {
    return request.get('http://localhost:1234/api_error_dont_logout').end(function(err, res){
      expect(res.text).to.not.equal('home');
      done();
    });
  });

  it('should not show 403', function(done) {
    return request.get('http://localhost:1234/unauthorized').end(function(err, res){
      expect(res.statusCode).to.equal(404);
      expect(res.text).to.equal('API request returned with status: 403\n{"forbidden":true}http://localhost:1235/forbidden404');
      done();
    });
  });

  it('should not throw an error', function(done) {
    return request.get('http://localhost:1234/data').end(function(err, res){
      expect(res.text).to.equal('has data: true');
      done();
    });
  });

  it('should only redirect once', function(done) {
    return request.get('http://localhost:1234/concurrent').end(function(err, res){
      expect(res.text).to.equal('home');
      done();
    });
  });

  describe('Backbone.ajax', function() {

    it('should throw an error', function(done) {
      return request.get('http://localhost:1234/backbone/auth_error').end(function(err, res){
        expect(res.text).to.equal('no auth mechanism definedundefined500');
        done();
      });
    });

    it('should throw an api_error', function(done) {
      return request.get('http://localhost:1234/backbone/api_error').end(function(err, res){
        expect(res.statusCode).to.equal(500);
        expect(res.text).to.equal('API request returned with status: 500\n{"error":true}http://localhost:1235/error?foo=bar500');
        done();
      });
    });

    it('should redirect to home', function(done) {
      return request.get('http://localhost:1234/backbone/unauthorized_logout').end(function(err, res){
        expect(res.statusCode).to.equal(200);
        expect(res.text).to.equal('home');
        done();
      });
    });

  });

});
