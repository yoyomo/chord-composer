var proxy = require('http-proxy-middleware');
module.exports = function(app) {
  var apiRoutes = ['api','auth','stripe'];
  var apiPath = 'http://localhost:3001/';

  apiRoutes.map( function (apiRoute) {
    app.use(proxy('/'+apiRoute, { target: apiPath }));
  });
};