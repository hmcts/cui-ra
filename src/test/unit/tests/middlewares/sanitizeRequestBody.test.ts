import { Request, Response, NextFunction } from 'express';

import { SanitizeRequestBody } from './../../../../main/middlewares';
import { assert } from 'chai';
import { sinon } from 'sinon';

describe('SanitizeRequestBody', () => {
  let sanitizeRequestBody: SanitizeRequestBody;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNextFunction: NextFunction;

  beforeEach(() => {
    // Create the SchemaValidator instance
    sanitizeRequestBody = new SanitizeRequestBody();

    // Mock the Request, Response, and NextFunction objects
    mockRequest = {
      body: {
        // Provide valid data t
        name: 'Hello World',
      },
    };

    mockResponse = {} as Response;
    mockNextFunction = jest.fn();
  });

  test('should ignore empty', () => {
    mockRequest.body.name = ' ';
    sanitizeRequestBody.sanitize(mockRequest, mockResponse, mockNextFunction);
    assert.equal(mockRequest.body.name, '');
  });

  test('should ignore simple text', function () {
    mockRequest.body.name = 'hello world';
    sanitizeRequestBody.sanitize(mockRequest, mockResponse, mockNextFunction);
    assert.equal(mockRequest.body.name, 'hello world');
  });

  test('should remove open tag', function () {
    mockRequest.body.name = '<hello world';
    sanitizeRequestBody.sanitize(mockRequest, mockResponse, mockNextFunction);
    assert.equal(mockRequest.body.name, '');
  });

  test('should remove closed tag', function () {
    mockRequest.body.name = 'hello<script/> world';
    sanitizeRequestBody.sanitize(mockRequest, mockResponse, mockNextFunction);
    assert.equal(mockRequest.body.name, 'hello world');
  });

  test('should remove tag and its content', function () {
    mockRequest.body.name = 'hello<script>alert("hello again!");</script> world';
    sanitizeRequestBody.sanitize(mockRequest, mockResponse, mockNextFunction);
    assert.equal(mockRequest.body.name, 'hello world');
  });

  test('should ignore close tag', function () {
    mockRequest.body.name = '>hello world';
    sanitizeRequestBody.sanitize(mockRequest, mockResponse, mockNextFunction);
    assert.equal(mockRequest.body.name, '>hello world');
  });

  test('should ignore close tag', function () {
    req.body?.getReader.name = 'hello world>';
    sanitizeRequestBody.sanitize(mockRequest, mockResponse, mockNextFunction);
    assert.equal(req.body?.getReader.name, 'hello world>');
  });

  test('should ignore non string field', function () {
    mockRequest.body.name = 'hello world';
    sanitizeRequestBody.sanitize(mockRequest, mockResponse, mockNextFunction);
    assert.equal(mockRequest.body.name, 'hello world');
  });

  test('should ignore close tag', function () {
    mockRequest.body.name = 'hello world>';
    sanitizeRequestBody.sanitize(mockRequest, mockResponse, mockNextFunction);
    assert.equal(mockRequest.body.name, 'hello world>');
  });
});
