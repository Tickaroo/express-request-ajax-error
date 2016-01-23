function requestAjaxError(req, res, next, logoutCallback) {
  return function(moduleError, apiResponse, statusCode) {
    var err;
    if (res.locals._requestAjaxErrorHandled) {
      return;
    }
    res.locals._requestAjaxErrorHandled = true;
    if (logoutCallback && statusCode === 401) {
      logoutCallback(req, res, next);
      return;
    }
    if (moduleError) {
      err = moduleError;
    }
    else {
      err = new Error(
        'API request returned with status: ' + statusCode +
        "\n" +
        (apiResponse ? apiResponse.body : '')
      );
      if (apiResponse && apiResponse.request && apiResponse.request.uri && apiResponse.request.uri.href) {
        err.url = apiResponse.request.uri.href;
      }
    }
    if (statusCode === 403) { // for security resons
      err.status = 404;
    }
    else {
      err.status = statusCode || 500;
    }
    return next(err);
  };
}

module.exports = requestAjaxError;

module.exports.backbone = function(req, res, next, logoutCallback){
  return function(model, error, options) {
    var errorHanlder = requestAjaxError(req, res, next, logoutCallback);
    if (options && options.xhr && options.xhr.response) {
      return errorHanlder(error, options.xhr.response, options.xhr.response.statusCode);
    }
    else {
      return errorHanlder(error);
    }
  };
};
