import fs from 'fs';
import { FormController } from '../../../../main/controllers';
import { mockRequest, mockResponse } from '../../mocks';
import { DataManagerDataObject } from './../../../../main/interfaces';
//import { ErrorMessages, Route } from './../../../../main/constants';

const dataProcessorResultJson: DataManagerDataObject[] = JSON.parse(
  fs.readFileSync(__dirname + '/../../data/data-processor-results.json', 'utf-8')
);

/* eslint-disable jest/expect-expect */
describe('FormController', () => {
  let formController: FormController;
  let mockedRequest = mockRequest(null);
  let mockedResponse = mockResponse();
  
  beforeEach(() => {
    formController = new FormController();
  });

  test('should display the form with forms/checkbox with valid flag', async () => {
    const parent:DataManagerDataObject = dataProcessorResultJson.filter((item:DataManagerDataObject) => item.id === 'RA0001')[0];

    const mockSession = {
      newmanager: {
        get: jest.fn().mockReturnValue(parent),
        getChildren: jest.fn().mockReturnValue(
          dataProcessorResultJson.filter((item:DataManagerDataObject) => parent._childIds.includes(item.id))
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
    const parent:DataManagerDataObject = dataProcessorResultJson.filter((item:DataManagerDataObject) => item.id === 'RA0001-RA0005-RA0010')[0];

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

  // test('should handle post request with valid flag and data', async () => {
  //   const parent:DataManagerDataObject = dataProcessorResultJson.filter((item:DataManagerDataObject) => item.id === 'RA0001')[0];
  //   const child:DataManagerDataObject[] = dataProcessorResultJson.filter((item:DataManagerDataObject) => parent._childIds.includes(item.id));
  //   // Set up mock data and session
  //   const mockSession = {
  //     newmanager: {
  //       get: jest.fn().mockReturnValue(parent),
  //       getChildren: jest.fn().mockReturnValue(child),
  //       save: jest.fn(),
  //       getNext: jest.fn(),
  //     },
  //   };

  //   mockedRequest = mockRequest(null);
  //   mockedResponse = mockResponse();

  //   mockedRequest.params = { id: 'someId' };
  //   mockedRequest.session = mockSession;

  //   const PostData = {
  //     'RA0001-RA0002':{
  //       'flagComment':'one'
  //     }
  //   }

  //   mockedRequest.body = {
  //     'form': {
  //       'data': PostData,
  //       'enabled': ['RA0001-RA0002']
  //     }
  //   }; // Mock request body

  //   await formController.post(mockedRequest, mockedResponse);

  //   // Assert expected behavior here
  //   // For example: expect(mockResponse.redirect).toHaveBeenCalledWith(Route.OVERVIEW);
  // });

  // Add more test cases for error scenarios and other functionality

  // Remember to clean up any mock functions using mockClear() or mockReset() after each test
});