import { NextFunction, Request, Response } from 'express';
import { sanitizeRequest } from './../../../../main/middlewares/sanitizeRequestBody';
import { assert } from 'chai';

describe('sanitizeRequestBody', () => {
  let req: Request;
  let res: Response;
  let next: NextFunction;

  beforeEach(() => {
    req = { body: {} } as Request;

    res = {} as Response;
    next = jest.fn();
  });

  test('does not change field without html tags', () => {
    req = {
      body: {
        test: 'test',
      },
    } as Request;
    sanitizeRequest(req, res, next);

    assert.equal(req.body.test, 'test');
  });

  test('removes script html tags', () => {
    req = {
      body: {
        test: "<script>alert('test')</script>test2",
      },
    } as Request;
    sanitizeRequest(req, res, next);

    assert.equal(req.body.test, "alert('test')test2");
  });

  test('removes comment html tags but left elements inside tags', () => {
    req = {
      body: {
        test: "<comment>alert('test')</comment>test3",
      },
    } as Request;
    sanitizeRequest(req, res, next);

    assert.equal(req.body.test, "alert('test')test3");
  });

  test('removes embed html tags but left elements inside tags', () => {
    req = {
      body: {
        test: "<embed>alert('test')</embed>test4",
      },
    } as Request;
    sanitizeRequest(req, res, next);

    assert.equal(req.body.test, "alert('test')test4");
  });

  test('remove whole elements with open tag', () => {
    req = {
      body: {
        test: '<hello world',
      },
    } as Request;
    sanitizeRequest(req, res, next);

    assert.equal(req.body.test, '');
  });

  test('does not remove close tags', () => {
    req = {
      body: {
        test: 'hello world>',
      },
    } as Request;
    sanitizeRequest(req, res, next);

    assert.equal(req.body.test, 'hello world>');
  });

  test('remove open close tags and elemnts inside it', () => {
    req = {
      body: {
        test: '<hello world>',
      },
    } as Request;
    sanitizeRequest(req, res, next);

    assert.equal(req.body.test, '');
  });

  test('removes p html tags', () => {
    req = {
      body: {
        test: '<p>abc<iframe//src=jAva&Tab;script:alert(3)>def</p>',
      },
    } as Request;
    sanitizeRequest(req, res, next);

    assert.equal(req.body.test, 'abcdef');
  });

  test('removes image html tags', () => {
    req = {
      body: {
        test: '<img src=x onerror=alert(1)//>',
      },
    } as Request;
    sanitizeRequest(req, res, next);

    assert.equal(req.body.test, '');
  });

  test('remove math html tags', () => {
    req = {
      body: {
        test: '<math><mi//xlink:href="data:x,<script>alert(4)</script>">',
      },
    } as Request;
    sanitizeRequest(req, res, next);

    assert.equal(req.body.test, '');
  });

  test('test table html tags', () => {
    req = {
      body: {
        test: '<TABLE><tr><td>HELLO</tr></TABL>',
      },
    } as Request;
    sanitizeRequest(req, res, next);

    assert.equal(req.body.test, 'HELLO');
  });

  test('remove svg html tags', () => {
    req = {
      body: {
        test: '<svg><g/onload=alert(2)//<p>',
      },
    } as Request;
    sanitizeRequest(req, res, next);

    assert.equal(req.body.test, '');
  });

  test('handles multiple fields', () => {
    req = {
      body: {
        test: 'test 1',
        test2: 'test 2',
      },
    } as Request;
    sanitizeRequest(req, res, next);

    assert.equal(req.body.test, 'test 1');
    assert.equal(req.body.test2, 'test 2');
  });

  test('trims form field', () => {
    req = {
      body: {
        test: '    test\n\t',
      },
    } as Request;
    sanitizeRequest(req, res, next);

    assert.equal(req.body.test, '    test\n\t');
  });

  test('remove complicated html tags', () => {
    req = {
      body: {
        test: '<script>alert(Hello<script>alert("Hello"</script></script>">',
      },
    } as Request;
    sanitizeRequest(req, res, next);

    assert.equal(req.body.test, 'alert(Helloalert("Hello"">');
  });

  test('remove complicated html tags test1', () => {
    req = {
      body: {
        test: '<script>alert(Hello<script>alert("Hello"">',
      },
    } as Request;
    sanitizeRequest(req, res, next);

    assert.equal(req.body.test, 'alert(Helloalert("Hello"">');
  });

  test('remove complicated html tags test2', () => {
    req = {
      body: {
        test: '<test<script>alert(Hello<script>alert("Hello""',
      },
    } as Request;
    sanitizeRequest(req, res, next);

    assert.equal(req.body.test, '');
  });

  test('escaped html tags test', () => {
    req = {
      body: {
        test: '&lt;script&gt;alert("Test")&lt;/script&gt;Test2',
      },
    } as Request;
    sanitizeRequest(req, res, next);

    assert.equal(req.body.test, 'alert("Test")Test2');
  });

  test('non string value', () => {
    req = {
      body: {
        test: '',
        number: 123
      },
    } as Request;
    sanitizeRequest(req, res, next);

    assert.equal(req.body.number, 123);
  });
});
