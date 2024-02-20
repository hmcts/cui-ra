import { Request, Response, NextFunction } from 'express';

import { SanitizeRequestBody } from './../../../../main/middlewares';
import { assert } from 'chai';

describe('SanitizeRequestBody', () => {
  let sanitizeRequestBody: SanitizeRequestBody;
  let mockRequest: Request;
  let mockResponse: Response;
  let mockNextFunction: NextFunction;

  beforeEach(() => {
    // Create the SchemaValidator instance
    sanitizeRequestBody = new SanitizeRequestBody();

    // Mock the Request, Response, and NextFunction objects
    mockRequest = {
      body: {
        // Provide valid data t
        name: '',
      },
    };

    mockResponse = {} as Response;
    mockNextFunction = jest.fn();
  });

  test('should ignore empty', () => {
    sanitizeRequestBody.sanitize(mockRequest, mockResponse, mockNextFunction);
    assert.equal(mockRequest.body.name, '');
  });

  test('should ignore simple text', () => {
    mockRequest.body.name = 'hello world';
    sanitizeRequestBody.sanitize(mockRequest, mockResponse, mockNextFunction);
    assert.equal(mockRequest.body.name, 'hello world');
  });

  test('should remove open tag', () => {
    mockRequest.body.name = '<hello world';
    sanitizeRequestBody.sanitize(mockRequest, mockResponse, mockNextFunction);
    assert.equal(mockRequest.body.name, '');
  });

  test('should remove closed tag', () => {
    mockRequest.body.name = 'hello<script/> world';
    sanitizeRequestBody.sanitize(mockRequest, mockResponse, mockNextFunction);
    assert.equal(mockRequest.body.name, 'hello world');
  });

  test('should remove tag and its content', () => {
    mockRequest.body.name = 'hello<script>alert("hello again!");</script> world';
    sanitizeRequestBody.sanitize(mockRequest, mockResponse, mockNextFunction);
    assert.equal(mockRequest.body.name, 'hello world');
  });

  test('should ignore close tag', () => {
    mockRequest.body.name = '>hello world';
    sanitizeRequestBody.sanitize(mockRequest, mockResponse, mockNextFunction);
    assert.equal(mockRequest.body.name, '>hello world');
  });

  test('should ignore close tag', () => {
    mockRequest.body.name = 'hello world>';
    sanitizeRequestBody.sanitize(mockRequest, mockResponse, mockNextFunction);
    assert.equal(mockRequest.body.name, 'hello world>');
  });

  test('should ignore non string field', () => {
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
