import fs from 'fs';
import { FormController } from '../../../../main/controllers';
import { mockRequest, mockResponse } from '../../mocks';
import { DataManagerDataObject } from './../../../../main/interfaces';
import { UrlRoute } from '../../../../main/utilities';
import { Route } from '../../../../main/constants';

const dataProcessorResultJson: DataManagerDataObject[] = JSON.parse(
  fs.readFileSync(__dirname + '/../../data/data-processor-results.json', 'utf-8')
);
const host = 'www.test.com';
const protocol = 'https';

/* eslint-disable jest/expect-expect */
describe('FormController', () => {
  let formController: FormController;
  let mockedRequest = mockRequest(null);
  let mockedResponse = mockResponse();

  beforeEach(() => {
    formController = new FormController();
  });

  test('should display the form with forms/checkbox with valid flag', async () => {
    const parent: DataManagerDataObject = dataProcessorResultJson.filter(
      (item: DataManagerDataObject) => item.id === 'RA0001'
    )[0];

    const mockSession = {
      newmanager: {
        get: jest.fn().mockReturnValue(parent),
        getChildren: jest
          .fn()
          .mockReturnValue(
            dataProcessorResultJson.filter((item: DataManagerDataObject) => parent._childIds.includes(item.id))
          ),
      },
    };

    mockedRequest = mockRequest(null);
    mockedResponse = mockResponse();

    mockedRequest.params = { id: 'someId' };
    mockedRequest.session = mockSession;

    await formController.display(mockedRequest, mockedResponse);

    // Assert expected behavior here
    expect(mockedResponse.render).toHaveBeenCalledWith('forms/checkbox-group', expect.any(Object));
  });

  test('should display the form with forms/type-ahead with valid flag', async () => {
    const parent: DataManagerDataObject = dataProcessorResultJson.filter(
      (item: DataManagerDataObject) => item.id === 'RA0001-RA0005-RA0010'
    )[0];

    const mockSession = {
      newmanager: {
        get: jest.fn().mockReturnValue(parent),
        getChildren: jest.fn().mockReturnValue([]),
      },
    };

    mockedRequest = mockRequest(null);
    mockedResponse = mockResponse();

    mockedRequest.params = { id: 'someId' };
    mockedRequest.session = mockSession;

    await formController.display(mockedRequest, mockedResponse);

    // Assert expected behavior here
    expect(mockedResponse.render).toHaveBeenCalledWith('forms/type-ahead', expect.any(Object));
  });

  test('should handle post request with valid flag and data', async () => {
    const parent:DataManagerDataObject = dataProcessorResultJson.filter((item:DataManagerDataObject) => item.id === 'RA0001')[0];
    const child:DataManagerDataObject[] = dataProcessorResultJson.filter((item:DataManagerDataObject) => parent._childIds.includes(item.id));
    const next:DataManagerDataObject = dataProcessorResultJson.filter((item:DataManagerDataObject) => item.id === 'RA0001-RA0004')[0];
    // Set up mock data and session
    const mockSession = {
      newmanager: {
        get: jest.fn().mockReturnValue(parent),
        getChildren: jest.fn().mockReturnValue(child),
        save: jest.fn(),
        getNext: jest.fn().mockReturnValue(next),
      },
    };

    mockedRequest = mockRequest(null);
    mockedResponse = mockResponse();

    mockedRequest.params = { id: 'someId' };
    mockedRequest.session = mockSession;
    mockedRequest.protocol = protocol;
    mockedRequest.headers = {
      host: host
    }

    const PostData = {
      'RA0001-RA0002':{
        'flagComment':'one'
      }
    }

    mockedRequest.body = {
        'data': PostData,
        'enabled': ['RA0001-RA0004']
    }; // Mock request body

    await formController.post(mockedRequest, mockedResponse);

    // Assert expected behavior here
    expect(mockedResponse.redirect).toHaveBeenCalledWith(UrlRoute.make(Route.JOURNEY_DISPLAY_FLAGS, { id: next.id }, UrlRoute.url(mockedRequest)));
  });

});
