var assert = require( 'assert' );
var webcap = require( './nodify-webcap' );

var _test_dispatch = {
  _options: function( request, response, callback ) {
    response.statusCode = 200;
    response.write( 'test response' );
    callback( request, response );
  },
  _get: function( request, response, callback ) {
    response.statusCode = 200;
    response.write( '{"success": true}' );
    callback( request, response );
  },
  _post: function( request, response, callback ) {
    response.statusCode = 201;
    response.write( '{"success": true}' );
    callback( request, response );
  },
  _put: function( request, response, callback ) {
    response.statusCode = 200;
    callback( request, response );
  },
  _delete: function( request, response, callback ) {
    response.statusCode = 200;
    response.write( '{"success": true}' );
    callback( request, response );
  }
}

var _other_dispatch = {
  _get: function( request, response, callback ) {
    response.statusCode = 200;
    response.write( '{"success": true}' );
    callback( request, response );
  },
  _put: function( request, response, callback ) {
    response.statusCode = 200;
    callback( request, response );
  },
}

var router_options = {
  "/test/": _test_dispatch,
  "/other/": _other_dispatch
};

var router = new webcap( router_options );

function TestResponse() {
  this.responseBody = "";
  this.status = 200;
  this.headers = {};
}

TestResponse.prototype.writeHead = function( status, headers ) {
  this.status = status;
  if( headers ) {
    for( var i in headers ) {
      this.headers[i] = headers[i];
    }
  }
};

TestResponse.prototype.write = function ( chunk ) {
  this.responseBody += chunk;
};

TestResponse.prototype.end = function ( data ) {
  if( data ) {
    this.write( data );
  }
};

var test_requests = [
  {
    method: 'OPTIONS',
    url: '/test/fa24db8b-b1ea-47c1-abf1-445a34d373c5',
    response: 'test response'
  },
  {
    method: 'HEAD',
    url: '/test/7f012b6c-34ca-40b7-be2b-04167ae02304',
    status: 405
  },
  {
    method: 'GET',
    url: '/test/8692bfb1-2fa3-47cb-8759-bb5793e76e68',
    response: '{"success": true}'
  },
  {
    method: 'PUT',
    url: '/test/35748bad-3b69-41f1-bca7-9bf9e12659bd',
    body: '{"username":"foo" }'
  },
  {
    method: 'POST',
    url: '/test/d9a85f00-d84f-4df9-870a-51537e98fc0f',
    response: '{"success": true}',
    status: 201
  },
  {
    method: 'DELETE',
    url: '/test/b22b4fb0-43d9-4360-97e2-ca5711e895cd',
    response: '{"success": true}'
  },
  {
    method: 'GET',
    url: '/nonexistent/8692bfb1-2fa3-47cb-8759-bb5793e76e68',
    status: 404
  },
  {
    method: 'GET',
    url: '/other/8692bfb1-2fa3-47cb-8759-bb5793e76e68',
    response: '{"success": true}'
  },
  {
    method: 'PUT',
    url: '/other/35748bad-3b69-41f1-bca7-9bf9e12659bd',
    body: '{"username":"foo" }'
  }
];

var i = 0, il = test_requests.length;

console.log( 'trying ' + test_requests[i].method + " " + test_requests[i].url );
router.dispatch( test_requests[i], new TestResponse(), _response );

function _response( request, response ) {
  if( test_requests[i].response ) {
    assert.equal( response.responseBody, test_requests[i].response );
  }
  assert.equal( response.statusCode, test_requests[i].status?test_requests[i].status:200 );
  i++;
  if( i < il ) {
    console.log( 'trying ' + test_requests[i].method + " " + test_requests[i].url );
    router.dispatch( test_requests[i], new TestResponse(), _response );
  }
}

