const tape = require('tape');

const managementApiClientMiddleware = require('../../src/middlewares').managementApiClient;

tape('managementApiClient should attach client to the request', function(t) {
  const options = {
    domain: 'me.auth0.com',
    accessToken: 'ey'
  };

  const mw = managementApiClientMiddleware(options);
  t.ok(mw);

  const req = { };
  mw(req, { }, function() {
    t.ok(req);
    t.ok(req.auth0);
    t.ok(req.auth0.users);
    t.ok(req.auth0.users.getAll);
    t.end();
  });
});

tape('managementApiClient errors should bubble up in the middleware', function(t) {
  const options = {
    domain: 'me.auth0.com',
    clientId: 'foo',
    clientSecret: 'bar'
  };

  const mw = managementApiClientMiddleware(options);
  t.ok(mw);

  const req = { };
  mw(req, { }, function(err) {
    t.ok(err);
    t.notOk(req.auth0);
    t.end();
  });
});

tape('managementApiClient should attach client to the request with headers', function(t) {
  const options = {
    domain: 'me.auth0.com',
    accessToken: 'ey',
    headers: { customHeader: 'custom' }
  };

  const mw = managementApiClientMiddleware(options);
  t.ok(mw);

  const req = { };
  mw(req, { }, function() {
    t.ok(req);
    t.ok(req.auth0);
    const keys = Object.keys(req.auth0);
    keys.forEach(key => req.auth0[key].resource && t.equal(req.auth0[key].resource.restClient.options.headers.customHeader, 'custom'));
    t.end();
  });
});
