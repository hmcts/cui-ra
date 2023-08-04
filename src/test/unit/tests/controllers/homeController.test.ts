import { HomeController } from '../../../../main/controllers';
import { mockRequest, mockResponse } from '../../mocks';

/* eslint-disable jest/expect-expect */
describe('Home Controller', () => {
  const controller = new HomeController();
  test('Should render home page', async () => {
    // eslint-disable-line @typescript-eslint/no-empty-function
    const req = mockRequest(null);
    const res = mockResponse();
    controller.get(req, res);
    expect(res.render).toBeCalledWith('home');
  });

  test('Should render overview page', async () => {
    // eslint-disable-line @typescript-eslint/no-empty-function
    const req = mockRequest(null);
    const res = mockResponse();
    controller.overview(req, res);
    expect(res.render).toBeCalledWith('overview');
  });

  test('Should render intro page', async () => {
    // eslint-disable-line @typescript-eslint/no-empty-function
    const req = mockRequest(null);
    const res = mockResponse();
    controller.intro(req, res);
    expect(res.render).toBeCalledWith('intro');
  });

  test('Should render review page', async () => {
    // eslint-disable-line @typescript-eslint/no-empty-function
    const req = mockRequest(null);
    const res = mockResponse();
    controller.review(req, res);
    expect(res.render).toBeCalledWith('review', expect.any(Object));
  });
});
