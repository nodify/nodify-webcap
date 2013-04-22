( function () {
  var url = require( 'url' );

  function Webcap ( endpoints ) {
    this.endpoints = endpoints;
  }

  Webcap.prototype.dispatch = function( request, response, callback ) {
    request.parsedUrl = url.parse( request.url );
    for( var current in this.endpoints ) {
      if( current == request.parsedUrl.pathname.substr(0, current.length) ) {
        var _f = this.endpoints[current]['_' + request.method.toLowerCase()];
        if( _f ) {
          request.pathElements = request.parsedUrl.pathname.substr(current.length).split('/');
          return _f.call( this.endpoints[current], request, response, callback );
        } else {
          response.statusCode = 405;
          return callback( request, response );
        }
      }
    }

    response.statusCode = 404;
    return callback( request, response );
  };

  if( module && module.exports ) {
    module.exports = Webcap;
  }
} )();