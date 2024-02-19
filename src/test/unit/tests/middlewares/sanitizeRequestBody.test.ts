import { SanitizeRequestBody } from './../../../../main/middlewares';
import { assert } from 'chai';
import { sinon } from 'sinon';

describe('SanitizeRequestBody', () => {
  let sanitizeRequestBody: SanitizeRequestBody;
  let req: Request;
  let res: Response;
  let next: NextFunction;

  beforeEach(() => {
    // Create the SchemaValidator instance
    sanitizeRequestBody = new SanitizeRequestBody();
    req = {} as Request;
    res = {} as Response;
    req = {
      body: {
        name: '',
      },
    };
    next = sinon.spy();
  });

  test('should ignore empty', function () {
    sanitizeRequestBody.sanitize(req, res, next);
    assert.equal(req.body?.getReader.name, '');
  });

  test('should ignore simple text', function () {
    req.body?.getReader.name = 'hello world';
    sanitizeRequestBody.sanitize(req, res, next);
    assert.equal(req.body?.getReader.name, 'hello world');
  });

  test('should remove open tag', function () {
    req.body?.getReader.name = '<hello world';
    sanitizeRequestBody.sanitize(req, res, next);
    assert.equal(req.body?.getReader.name, '');
  });

  test('should remove closed tag', function () {
    req.body?.getReader.name = 'hello<script/> world';
    sanitizeRequestBody.sanitize(req, res, next);
    assert.equal(req.body?.getReader.name, 'hello world');
  });

  test('should remove tag and its content', function () {
    req.body?.getReader.name = 'hello<script>alert("hello again!");</script> world';
    sanitizeRequestBody.sanitize(req, res, next);
    assert.equal(req.body?.getReader.name, 'hello world');
  });

  test('should ignore close tag', function () {
    req.body?.getReader.name = '>hello world';
    sanitizeRequestBody.sanitize(req, res, next);
    assert.equal(req.body?.getReader.name, '>hello world');
  });

  test('should ignore close tag', function () {
    req.body?.getReader.name = 'hello world>';
    sanitizeRequestBody.sanitize(req, res, next);
    assert.equal(req.body?.getReader.name, 'hello world>');
  });

  test('should ignore non string field', function () {
    req.body?.getReader.name = 'hello world';
    sanitizeRequestBody.sanitize(req, res, next);
    assert.equal(req.body?.getReader.name, 'hello world');
  });

  test('should ignore close tag', function () {
    req.body?.getReader.name = 'hello world>';
    sanitizeRequestBody.sanitize(req, res, next);
    assert.equal(req.body?.getReader.name, 'hello world>');
  });
});
