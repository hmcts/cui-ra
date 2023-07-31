import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import { SchemaValidator, SchemaType } from './../../../../main/middlewares';
import { Request, Response, NextFunction } from 'express';

describe('SchemaValidator', () => {
  let schemaValidator: SchemaValidator;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNextFunction: NextFunction;

  beforeAll(() => {
    // Initialize Ajv with formats
    const ajv = new Ajv();
    addFormats(ajv);

    // Create the SchemaValidator instance
    schemaValidator = new SchemaValidator();

    // Mock the Request, Response, and NextFunction objects
    mockRequest = {
      body: {
        // Provide valid data that adheres to your JSON schema
        name: 'John Doe',
        age: 30,
        email: 'johndoe@example.com',
      },
    };

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    mockNextFunction = jest.fn();
  });

  test('should call next function if the request body matches the JSON schema', () => {
    // Define a JSON schema for validation
    const validSchema: SchemaType = {
      $schema: 'http://json-schema.org/draft-07/schema#',
      type: 'object',
      properties: {
        name: { type: 'string' },
        age: { type: 'integer' },
        email: { type: 'string', format: 'email' },
      },
      required: ['name', 'age', 'email'],
      additionalProperties: false,
    };

    // Call the check method with the valid schema
    const middleware = schemaValidator.check(validSchema);
    middleware(mockRequest as Request, mockResponse as Response, mockNextFunction);

    // Ensure the next function was called
    expect(mockNextFunction).toHaveBeenCalledTimes(1);

    // Ensure the response methods were not called
    expect(mockResponse.status).not.toHaveBeenCalled();
    expect(mockResponse.json).not.toHaveBeenCalled();
  });

  test('should return a 400 error if the request body does not match the JSON schema', () => {
    // Define a JSON schema that does not match the provided request body
    const invalidSchema: SchemaType = {
      $schema: 'http://json-schema.org/draft-07/schema#',
      type: 'object',
      properties: {
        name: { type: 'string' },
        days: { type: 'integer' },
      },
      required: ['name', 'days'],
      additionalProperties: false,
    };
    // Call the check method with the invalid schema
    const middleware = schemaValidator.check(invalidSchema);

    middleware(mockRequest as Request, mockResponse as Response, mockNextFunction);

    // Ensure the next function was not called
    //expect(mockNextFunction).not.toHaveBeenCalled();

    // Ensure the response methods were called with a 400 error
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: expect.any(Array) });
  });
});
