const chai = require('chai');
const { spec } = require('pactum');
const { Given, When, Then, Before, After } = require('@cucumber/cucumber');
const {
  localhost,
  defaultExpectedResponseTime,
  contentTypeHeader,
  clientCreateEndpoint,
  clientResponseSchema,
} = require('./helpers/helpers');

chai.use(require('chai-json-schema'));

let specClientCreate;

const baseUrl = localhost + clientCreateEndpoint;
const endpointTag = { tags: `@endpoint=/${clientCreateEndpoint}` };

Before(endpointTag, () => {
  specClientCreate = spec();
});

// Scenario: The new client is successfully added to the Open ID Connect (OIDC) smoke type test
Given(
  'The user wants to add the new client to the Open ID Connect \\(OIDC)',
  () => 'The user wants to add the new client to the Open ID Connect (OIDC)'
);

When(
  'User sends POST request with given {string} as requestTime, {string} as clientId, {string} as clientName, {string} as relyingPartyId, {string} as logoUri, empty object as publicKey, {string} as authContextRefs, {string} as userClaims, {string} as grantTypes, {string} as clientAuthMethods',
  (
    requestTime,
    clientId,
    clientName,
    relyingPartyId,
    logoUri,
    authContextRefs,
    userClaims,
    grantTypes,
    clientAuthMethods
  ) =>
    specClientCreate.post(baseUrl).withJson({
      requestTime: requestTime,
      request: {
        clientId: clientId,
        clientName: clientName,
        relyingPartyId: relyingPartyId,
        logoUri: logoUri,
        publicKey: {},
        authContextRefs: [authContextRefs],
        userClaims: [userClaims],
        grantTypes: [grantTypes],
        clientAuthMethods: [clientAuthMethods],
      },
    })
);

Then(
  'User receives a response from the POST \\/client-mgmt\\/oidc-client endpoint',
  async () => await specClientCreate.toss()
);

Then(
  'The POST \\/client-mgmt\\/oidc-client endpoint response should be returned in a timely manner 15000ms',
  () =>
    specClientCreate
      .response()
      .to.have.responseTimeLessThan(defaultExpectedResponseTime)
);

Then(
  'The POST \\/client-mgmt\\/oidc-client endpoint response should have status 200',
  () => specClientCreate.response().to.have.status(200)
);

Then(
  'The POST \\/client-mgmt\\/oidc-client endpoint response should have content-type: application\\/json header',
  () =>
    specClientCreate
      .response()
      .should.have.header(contentTypeHeader.key, contentTypeHeader.value)
);

Then(
  'The POST \\/client-mgmt\\/oidc-client endpoint response should match json schema',
  () => {
    clientResponseSchema.properties.response.errors = [];
    chai
      .expect(specClientCreate._response.json)
      .to.be.jsonSchema(clientResponseSchema);
  }
);

Then(
  'The POST \\/client-mgmt\\/oidc-client endpoint response should contain {string} as clientId',
  (clientId) =>
    chai
      .expect(specClientCreate._response.json.response.clientId)
      .to.be.equal(clientId)
);

// Scenario Outline: The new client is successfully added to the Open ID Connect (OIDC)
// Given, Then for this scenario are written in the aforementioned example
When(
  'User sends POST request with given {string} as requestTime, {string} as clientId, {string} as clientName, {string} as relyingPartyId, {string} as logoUri, empty object as publicKey, {string} as authContextRefs, {string} as userClaims, {string} as grantTypes, {string} as clientAuthMethods, {string} as redirectUris',
  (
    requestTime,
    clientId,
    clientName,
    relyingPartyId,
    logoUri,
    authContextRefs,
    userClaims,
    grantTypes,
    clientAuthMethods,
    redirectUris
  ) =>
    specClientCreate.post(baseUrl).withJson({
      requestTime: requestTime,
      request: {
        clientId: clientId,
        clientName: clientName,
        relyingPartyId: relyingPartyId,
        logoUri: logoUri,
        publicKey: {},
        authContextRefs: [authContextRefs],
        userClaims: [userClaims],
        grantTypes: [grantTypes],
        clientAuthMethods: [clientAuthMethods],
        redirectUris: redirectUris,
      },
    })
);

// Scenario: Not able to add the new client to the Open ID Connect (OIDC) because of invalid requestTime
// Given, Then for this scenario are written in the aforementioned example
When(
  'User sends POST request with given {string} as invalid requestTime',
  (requestTime) =>
    specClientCreate.post(baseUrl).withJson({
      requestTime: requestTime,
      request: {
        clientId: 'e-health-service',
        clientName: 'Health Service',
        relyingPartyId: 'bharath-gov',
        logoUri: 'http://example.com',
        publicKey: {},
        authContextRefs: ['idbb:acr:generated-code'],
        userClaims: ['name'],
        grantTypes: ['authorization_code'],
        clientAuthMethods: ['private_key_jwt'],
      },
    })
);

Then(
  'The POST \\/client-mgmt\\/oidc-client endpoint response should match json schema with error code and error message',
  () =>
    chai
      .expect(specClientCreate._response.json)
      .to.be.jsonSchema(clientResponseSchema)
);

// Scenario: Not able to add the new client to the Open ID Connect (OIDC) because of invalid authContextRefs
// Given, Then for this scenario are written in the aforementioned example
When(
  'User sends POST request with given {string} as invalid authContextRefs',
  (authContextRefs) =>
    specClientCreate.post(baseUrl).withJson({
      requestTime: '2011-10-05T14:48:00.000Z',
      request: {
        clientId: 'e-health-service',
        clientName: 'Health Service',
        relyingPartyId: 'bharath-gov',
        logoUri: 'http://example.com',
        publicKey: {},
        authContextRefs: [authContextRefs],
        userClaims: ['name'],
        grantTypes: ['authorization_code'],
        clientAuthMethods: ['private_key_jwt'],
      },
    })
);

// Scenario: Not able to add the new client to the Open ID Connect (OIDC) because of invalid userClaims
// Given, Then for this scenario are written in the aforementioned example
When(
  'User sends POST request with given {string} as invalid userClaims',
  (userClaims) =>
    specClientCreate.post(baseUrl).withJson({
      requestTime: '2011-10-05T14:48:00.000Z',
      request: {
        clientId: 'e-health-service',
        clientName: 'Health Service',
        relyingPartyId: 'bharath-gov',
        logoUri: 'http://example.com',
        publicKey: {},
        authContextRefs: ['idbb:acr:generated-code'],
        userClaims: [userClaims],
        grantTypes: ['authorization_code'],
        clientAuthMethods: ['private_key_jwt'],
      },
    })
);

// Scenario: Not able to add the new client to the Open ID Connect (OIDC) because of invalid grantTypes
// Given, Then for this scenario are written in the aforementioned example
When(
  'User sends POST request with given {string} as invalid grantTypes',
  (grantTypes) =>
    specClientCreate.post(baseUrl).withJson({
      requestTime: '2011-10-05T14:48:00.000Z',
      request: {
        clientId: 'e-health-service',
        clientName: 'Health Service',
        relyingPartyId: 'bharath-gov',
        logoUri: 'http://example.com',
        publicKey: {},
        authContextRefs: ['idbb:acr:generated-code'],
        userClaims: ['name'],
        grantTypes: [grantTypes],
        clientAuthMethods: ['private_key_jwt'],
      },
    })
);

// Scenario: Not able to add the new client to the Open ID Connect (OIDC) because of invalid clientAuthMethods
// Given, Then for this scenario are written in the aforementioned example
When(
  'User sends POST request with given {string} as invalid clientAuthMethods',
  (clientAuthMethods) =>
    specClientCreate.post(baseUrl).withJson({
      requestTime: '2011-10-05T14:48:00.000Z',
      request: {
        clientId: 'e-health-service',
        clientName: 'Health Service',
        relyingPartyId: 'bharath-gov',
        logoUri: 'http://example.com',
        publicKey: {},
        authContextRefs: ['idbb:acr:generated-code'],
        userClaims: ['name'],
        grantTypes: ['authorization_code'],
        clientAuthMethods: [clientAuthMethods],
      },
    })
);

// Scenario: Not able to add the new client to the Open ID Connect (OIDC) because of invalid clientName
// Given, Then for this scenario are written in the aforementioned example
When(
  'User sends POST request with given {string} as invalid clientName',
  (clientName) =>
    specClientCreate.post(baseUrl).withJson({
      requestTime: '2011-10-05T14:48:00.000Z',
      request: {
        clientId: 'e-health-service',
        clientName: clientName,
        relyingPartyId: 'bharath-gov',
        logoUri: 'http://example.com',
        publicKey: {},
        authContextRefs: ['idbb:acr:generated-code'],
        userClaims: ['name'],
        grantTypes: ['authorization_code'],
        clientAuthMethods: ['private_key_jwt'],
      },
    })
);

// Scenario: Not able to add the new client to the Open ID Connect (OIDC) because of invalid relyingPartyId
// Given, Then for this scenario are written in the aforementioned example
When(
  'User sends POST request with given {string} as invalid relyingPartyId',
  (relyingPartyId) =>
    specClientCreate.post(baseUrl).withJson({
      requestTime: '2011-10-05T14:48:00.000Z',
      request: {
        clientId: 'e-health-service',
        clientName: 'e-health-service',
        relyingPartyId: relyingPartyId,
        logoUri: 'http://example.com',
        publicKey: {},
        authContextRefs: ['idbb:acr:generated-code'],
        userClaims: ['name'],
        grantTypes: ['authorization_code'],
        clientAuthMethods: ['private_key_jwt'],
      },
    })
);

// Scenario: Not able to add the new client to the Open ID Connect (OIDC) because of invalid logoUri
// Given, Then for this scenario are written in the aforementioned example
When(
  'User sends POST request with given {string} as invalid logoUri',
  (logoUri) =>
    specClientCreate.post(baseUrl).withJson({
      requestTime: '2011-10-05T14:48:00.000Z',
      request: {
        clientId: 'e-health-service',
        clientName: 'e-health-service',
        relyingPartyId: 'bharath-gov',
        logoUri: logoUri,
        publicKey: {},
        authContextRefs: ['idbb:acr:generated-code'],
        userClaims: ['name'],
        grantTypes: ['authorization_code'],
        clientAuthMethods: ['private_key_jwt'],
      },
    })
);

// Scenario: Not able to add the new client to the Open ID Connect (OIDC) because of invalid clientId
// Given, Then for this scenario are written in the aforementioned example
When(
  'User sends POST request with given {string} as invalid clientId',
  (clientId) =>
    specClientCreate.post(baseUrl).withJson({
      requestTime: '2011-10-05T14:48:00.000Z',
      request: {
        clientId: clientId,
        clientName: 'e-health-service',
        relyingPartyId: 'bharath-gov',
        logoUri: 'http://example.com',
        publicKey: {},
        authContextRefs: ['idbb:acr:generated-code'],
        userClaims: ['name'],
        grantTypes: ['authorization_code'],
        clientAuthMethods: ['private_key_jwt'],
      },
    })
);

After(endpointTag, () => {
  specClientCreate.end();
});
