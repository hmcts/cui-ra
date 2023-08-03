import { FormController } from '../../../../main/controllers';
import { mockRequest, mockResponse } from '../../mocks';

/* eslint-disable jest/expect-expect */
describe('Form Controller', () => {
  describe('Dynamic Form', () => {
    const controller = new FormController();
    test('Should render dynamic form page', async () => {
      // eslint-disable-line @typescript-eslint/no-empty-function
      const req = mockRequest(null);
      const res = mockResponse();
      controller.get(req, res);
      expect(res.render).toBeCalledWith('dynamic-form');
    });
  });
});
