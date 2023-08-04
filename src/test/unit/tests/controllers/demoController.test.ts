import { DemoController } from '../../../../main/controllers';
import { mockRequest, mockResponse } from '../../mocks';

/* eslint-disable jest/expect-expect */
describe('Demo Controller', () => {
  const controller = new DemoController();
  test('Should render demo page', async () => {
    // eslint-disable-line @typescript-eslint/no-empty-function
    const req = mockRequest(null);
    const res = mockResponse();
    controller.get(req, res);
    expect(res.render).toBeCalledWith('demo');
  });
});
