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

  test.each([
    ['does not change field without html tags', 'test', 'test'],
    ['removes script html tags', "<script>alert('test')</script>test2", "alert('test')test2"],
    [
      'removes comment html tags but left elements inside tags',
      "<comment>alert('test')</comment>test3",
      "alert('test')test3",
    ],
    [
      'removes embed html tags but left elements inside tags',
      "<embed>alert('test')</embed>test4",
      "alert('test')test4",
    ],
    ['remove whole elements with open tag', '<hello world', ''],
    ['does not remove close tags', 'hello world>', 'hello world>'],
    ['remove open close tags and elemnts inside it', '<hello world>', ''],
    ['removes p html tags', '<p>abc<iframe//src=jAva&Tab;script:alert(3)>def</p>', 'abcdef'],
    ['removes image html tags', '<img src=x onerror=alert(1)//>', ''],
    ['remove math html tags', '<math><mi//xlink:href="data:x,<script>alert(4)</script>">', ''],
    ['test table html tags', '<TABLE><tr><td>HELLO</tr></TABL>', 'HELLO'],
    ['remove svg html tags', '<svg><g/onload=alert(2)//<p>', ''],
    ['trims form field', '    test\n\t', '    test\n\t'],
    [
      'remove complicated html tags',
      '<script>alert(Hello<script>alert("Hello"</script></script>">',
      'alert(Helloalert("Hello"">',
    ],
    ['remove complicated html tags test1', '<script>alert(Hello<script>alert("Hello"">', 'alert(Helloalert("Hello"">'],
    ['remove complicated html tags test2', '<test<script>alert(Hello<script>alert("Hello""', ''],
    ['escaped html tags test', '&lt;script&gt;alert("Test")&lt;/script&gt;Test2', 'alert("Test")Test2'],
  ])('%s', (_description, input, expected) => {
    req.body = { test: input };
    sanitizeRequest(req, res, next);
    assert.equal(req.body.test, expected);
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

  test('non string value', () => {
    req = {
      body: {
        test: '',
        number: 123,
      },
    } as Request;
    sanitizeRequest(req, res, next);

    assert.equal(req.body.number, 123);
  });
});
