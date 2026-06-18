import fs from 'fs';
import { NextFunction } from 'express';
import { FormController } from '../../../../main/controllers';
import { mockRequest, mockResponse } from '../../mocks';
import { DataManagerDataObject } from './../../../../main/interfaces';
import { NewFlagsManager } from '../../../../main/managers';
import { UrlRoute } from '../../../../main/utilities';
import { ErrorMessages, Route } from '../../../../main/constants';
import { HTTPError } from './../../../../main/HttpError';
import { FormProcessor } from '../../../../main/processors';
import { FormValidator } from '../../../../main/validators';

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
  let mockNext: NextFunction;

  beforeEach(() => {
    mockNext = jest.fn();
    formController = new FormController();
  });

  test('should display the form with forms/checkbox with valid flag', async () => {
    const parent: DataManagerDataObject = dataProcessorResultJson.filter(
      (item: DataManagerDataObject) => item.id === 'PF0001-RA0001'
    )[0];

    const mockSession = {
      newmanager: {
        get: jest.fn().mockReturnValue(parent),
        hasUnaswered: jest.fn().mockReturnValue(false),
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
    mockedRequest.query = { change: 'true' };
    mockedRequest.session = mockSession;

    await formController.display(mockedRequest, mockedResponse, mockNext);

    // Assert expected behavior here
    expect(mockedResponse.render).toHaveBeenCalledWith('forms/checkbox-group', expect.any(Object));
  });

  test('should use the first id when multiple ids are provided on display', async () => {
    const parent: DataManagerDataObject = dataProcessorResultJson.filter(
      (item: DataManagerDataObject) => item.id === 'PF0001-RA0001'
    )[0];

    const mockSession = {
      newmanager: {
        get: jest.fn().mockReturnValue(parent),
        hasUnaswered: jest.fn().mockReturnValue(false),
        getChildren: jest.fn().mockReturnValue([]),
      },
    };

    mockedRequest = mockRequest(null);
    mockedResponse = mockResponse();

    mockedRequest.params = { id: ['someId', 'otherId'] };
    mockedRequest.session = mockSession;

    await formController.display(mockedRequest, mockedResponse, mockNext);

    expect(mockSession.newmanager.get).toHaveBeenCalledWith('someId');
    expect(mockedResponse.render).toHaveBeenCalledWith('forms/checkbox-group', expect.any(Object));
  });

  test('should fail to display the form', async () => {
    const parent: DataManagerDataObject = dataProcessorResultJson.filter(
      (item: DataManagerDataObject) => item.id === 'PF0001-RA0001'
    )[0];

    const mockSession = {
      newmanager: {
        get: jest.fn().mockReturnValue(null),
        hasUnaswered: jest.fn().mockReturnValue(false),
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
    mockedRequest.query = { change: 'true' };
    mockedRequest.session = mockSession;

    await formController.display(mockedRequest, mockedResponse, mockNext);

    // Assert expected behavior here
    expect(mockNext).toHaveBeenCalledWith(new HTTPError(ErrorMessages.UNEXPECTED_ERROR, 404));
  });

  test('should display the form with forms/type-ahead with valid flag', async () => {
    const parent: DataManagerDataObject = dataProcessorResultJson.filter(
      (item: DataManagerDataObject) => item.id === 'PF0001-PF0015'
    )[0];

    const mockSession = {
      newmanager: {
        get: jest.fn().mockReturnValue(parent),
        hasUnaswered: jest.fn().mockReturnValue(false),
        getChildren: jest.fn().mockReturnValue([]),
      },
    };

    mockedRequest = mockRequest(null);
    mockedResponse = mockResponse();

    mockedRequest.params = { id: 'someId' };
    mockedRequest.session = mockSession;

    await formController.display(mockedRequest, mockedResponse, mockNext);

    // Assert expected behavior here
    expect(mockedResponse.render).toHaveBeenCalledWith('forms/type-ahead', expect.any(Object));
  });

  test('should display the form with forms/radio-group with valid flag', async () => {
    const parent: DataManagerDataObject = dataProcessorResultJson.filter(
      (item: DataManagerDataObject) => item.id === 'PF0001-PF1115'
    )[0];

    const mockSession = {
      newmanager: {
        get: jest.fn().mockReturnValue(parent),
        hasUnaswered: jest.fn().mockReturnValue(false),
        getChildren: jest.fn().mockReturnValue([]),
      },
    };

    mockedRequest = mockRequest(null);
    mockedResponse = mockResponse();

    mockedRequest.params = { id: 'someId' };
    mockedRequest.session = mockSession;

    await formController.display(mockedRequest, mockedResponse, mockNext);

    // Assert expected behavior here
    expect(mockedResponse.render).toHaveBeenCalledWith('forms/radio-group', expect.any(Object));
  });

  test('should handle post request with valid flag and data', async () => {
    const parent: DataManagerDataObject = dataProcessorResultJson.filter(
      (item: DataManagerDataObject) => item.id === 'PF0001-RA0001'
    )[0];
    const child: DataManagerDataObject[] = dataProcessorResultJson.filter((item: DataManagerDataObject) =>
      parent._childIds.includes(item.id)
    );
    const next: DataManagerDataObject = dataProcessorResultJson.filter(
      (item: DataManagerDataObject) => item.id === 'PF0001-RA0001-RA0004'
    )[0];
    // Set up mock data and session
    const mockSession = {
      newmanager: {
        get: jest.fn().mockReturnValue(parent),
        hasUnaswered: jest.fn().mockReturnValue(false),
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
      host: host,
    };

    const PostData = {
      'PF0001-RA0001-RA0002': {
        flagComment: 'one',
      },
    };

    mockedRequest.body = {
      data: PostData,
      enabled: ['PF0001-RA0001-RA0004'],
    }; // Mock request body

    await formController.post(mockedRequest, mockedResponse, mockNext);

    // Assert expected behavior here
    expect(mockedResponse.redirect).toHaveBeenCalledWith(
      UrlRoute.make(Route.JOURNEY_DISPLAY_FLAGS, { id: next.id }, UrlRoute.url(mockedRequest))
    );
  });

  test('should append new query when new journey is requested', async () => {
    const parent: DataManagerDataObject = dataProcessorResultJson.filter(
      (item: DataManagerDataObject) => item.id === 'PF0001-RA0001'
    )[0];
    const child: DataManagerDataObject[] = dataProcessorResultJson.filter((item: DataManagerDataObject) =>
      parent._childIds.includes(item.id)
    );
    const next: DataManagerDataObject = dataProcessorResultJson.filter(
      (item: DataManagerDataObject) => item.id === 'PF0001-RA0001-RA0004'
    )[0];
    const mockSession = {
      newmanager: {
        get: jest.fn().mockReturnValue(parent),
        hasUnaswered: jest.fn().mockReturnValue(false),
        getChildren: jest.fn().mockReturnValue(child),
        save: jest.fn(),
        getNext: jest.fn().mockReturnValue(next),
      },
    };

    mockedRequest = mockRequest(null);
    mockedResponse = mockResponse();

    mockedRequest.query = { new: true };
    mockedRequest.params = { id: ['someId', 'otherId'] };
    mockedRequest.session = mockSession;
    mockedRequest.protocol = protocol;
    mockedRequest.headers = {
      host: host,
    };

    mockedRequest.body = {
      data: {
        'PF0001-RA0001-RA0002': {
          flagComment: 'one',
        },
      },
      enabled: ['PF0001-RA0001-RA0004'],
    };

    await formController.post(mockedRequest, mockedResponse, mockNext);

    expect(mockSession.newmanager.get).toHaveBeenCalledWith('someId');
    expect(mockedResponse.redirect).toHaveBeenCalledWith(
      `${UrlRoute.make(Route.JOURNEY_DISPLAY_FLAGS, { id: next.id }, UrlRoute.url(mockedRequest))}?new=true`
    );
  });

  test('should re-render the form when validation errors are returned', async () => {
    const parent: DataManagerDataObject = dataProcessorResultJson.filter(
      (item: DataManagerDataObject) => item.id === 'PF0001-RA0001'
    )[0];

    const mockSession = {
      newmanager: {
        get: jest.fn().mockReturnValue(parent),
        hasUnaswered: jest.fn().mockReturnValue(false),
        getChildren: jest.fn().mockReturnValue([]),
        save: jest.fn(),
        getNext: jest.fn(),
      },
    };

    mockedRequest = mockRequest(null);
    mockedResponse = mockResponse();

    mockedRequest.params = { id: 'someId' };
    mockedRequest.session = mockSession;
    mockedRequest.protocol = protocol;
    mockedRequest.headers = {
      host: host,
    };

    mockedRequest.body = {
      data: {
        'PF0001-RA0001-RA0002': {
          flagComment: 'one',
        },
      },
      enabled: ['PF0001-RA0001-RA0004'],
    };

    const validationErrors = { some: 'error' };
    const validateBodySpy = jest.spyOn(FormValidator, 'validateBody').mockResolvedValue([true, {}]);
    const processSpy = jest.spyOn(FormProcessor, 'process').mockReturnValue([parent]);
    const validateSpy = jest.spyOn(FormValidator, 'validate').mockResolvedValue([validationErrors, parent, null]);

    await formController.post(mockedRequest, mockedResponse, mockNext);

    expect(mockedResponse.render).toHaveBeenCalledWith(
      'forms/checkbox-group',
      expect.objectContaining({ validationErrors })
    );

    validateBodySpy.mockRestore();
    processSpy.mockRestore();
    validateSpy.mockRestore();
  });

  test('should handle post request with valid flag and data - changed = true | unAswered true', async () => {
    const parent: DataManagerDataObject = dataProcessorResultJson.filter(
      (item: DataManagerDataObject) => item.id === 'PF0001-RA0001'
    )[0];
    const child: DataManagerDataObject[] = dataProcessorResultJson.filter((item: DataManagerDataObject) =>
      parent._childIds.includes(item.id)
    );
    const next: DataManagerDataObject = dataProcessorResultJson.filter(
      (item: DataManagerDataObject) => item.id === 'PF0001-RA0001-RA0004'
    )[0];
    // Set up mock data and session
    const mockSession = {
      newmanager: {
        get: jest.fn().mockReturnValue(parent),
        hasUnaswered: jest.fn().mockReturnValue(true),
        getChildren: jest.fn().mockReturnValue(child),
        save: jest.fn(),
        getNext: jest.fn().mockReturnValue(next),
      },
    };

    mockedRequest = mockRequest(null);
    mockedResponse = mockResponse();

    mockedRequest.query = { change: true };
    mockedRequest.params = { id: 'someId' };
    mockedRequest.session = mockSession;
    mockedRequest.protocol = protocol;
    mockedRequest.headers = {
      host: host,
    };

    const PostData = {
      'PF0001-RA0001-RA0002': {
        flagComment: 'one',
      },
    };

    mockedRequest.body = {
      data: PostData,
      enabled: ['PF0001-RA0001-RA0004'],
    }; // Mock request body

    await formController.post(mockedRequest, mockedResponse, mockNext);

    // Assert expected behavior here
    expect(mockedResponse.redirect).toHaveBeenCalledWith(
      `${UrlRoute.make(Route.JOURNEY_DISPLAY_FLAGS, { id: next.id }, UrlRoute.url(mockedRequest))}?change=true`
    );
  });

  test('should handle post request with valid flag and data - changed = true | unAswered false', async () => {
    const parent: DataManagerDataObject = dataProcessorResultJson.filter(
      (item: DataManagerDataObject) => item.id === 'PF0001-RA0001'
    )[0];
    const child: DataManagerDataObject[] = dataProcessorResultJson.filter((item: DataManagerDataObject) =>
      parent._childIds.includes(item.id)
    );
    const next: DataManagerDataObject = dataProcessorResultJson.filter(
      (item: DataManagerDataObject) => item.id === 'PF0001-RA0001-RA0004'
    )[0];
    // Set up mock data and session
    const mockSession = {
      newmanager: {
        get: jest.fn().mockReturnValue(parent),
        hasUnaswered: jest.fn().mockReturnValue(false),
        getChildren: jest.fn().mockReturnValue(child),
        save: jest.fn(),
        getNext: jest.fn().mockReturnValue(next),
      },
    };

    mockedRequest = mockRequest(null);
    mockedResponse = mockResponse();

    mockedRequest.query = { change: true };
    mockedRequest.params = { id: 'someId' };
    mockedRequest.session = mockSession;
    mockedRequest.protocol = protocol;
    mockedRequest.headers = {
      host: host,
    };

    const PostData = {
      'PF0001-RA0001-RA0002': {
        flagComment: 'one',
      },
    };

    mockedRequest.body = {
      data: PostData,
      enabled: ['PF0001-RA0001-RA0004'],
    }; // Mock request body

    await formController.post(mockedRequest, mockedResponse, mockNext);

    // Assert expected behavior here
    expect(mockedResponse.redirect).toHaveBeenCalledWith(Route.REVIEW);
  });

  test('should handle post request with checkbox no support selected', async () => {
    const dataManager = new NewFlagsManager();
    dataManager.set(dataProcessorResultJson);

    // Set up mock data and session
    const mockSession = {
      newmanager: dataManager,
    };

    mockedRequest = mockRequest(null);
    mockedResponse = mockResponse();

    mockedRequest.params = { id: 'PF0001-RA0001' };
    mockedRequest.session = mockSession;
    mockedRequest.protocol = protocol;
    mockedRequest.headers = {
      host: host,
    };

    mockedRequest.body = {
      enabled: ['none'],
    }; // Mock request body

    await formController.post(mockedRequest, mockedResponse, mockNext);

    // Assert expected behavior here
    expect(mockedResponse.redirect).toHaveBeenCalledWith(Route.REVIEW);
  });

  test('should handle post request with radio no support selected', async () => {
    const dataManager = new NewFlagsManager();
    dataManager.set(dataProcessorResultJson);

    // Set up mock data and session
    const mockSession = {
      newmanager: dataManager,
    };

    mockedRequest = mockRequest(null);
    mockedResponse = mockResponse();

    mockedRequest.params = { id: 'PF0001-RA0001' };
    mockedRequest.session = mockSession;
    mockedRequest.protocol = protocol;
    mockedRequest.headers = {
      host: host,
    };

    mockedRequest.body = {
      selected: 'none',
    }; // Mock request body

    await formController.post(mockedRequest, mockedResponse, mockNext);

    // Assert expected behavior here
    expect(mockedResponse.redirect).toHaveBeenCalledWith(Route.REVIEW);
  });

  test('Post with empty data should return the same form with errors', async () => {
    const dataManager = new NewFlagsManager();
    dataManager.set(dataProcessorResultJson);

    // Set up mock data and session
    const mockSession = {
      newmanager: dataManager,
    };

    mockedRequest = mockRequest(null);
    mockedResponse = mockResponse();

    mockedRequest.params = { id: 'PF0001-RA0001' };
    mockedRequest.session = mockSession;
    mockedRequest.protocol = protocol;
    mockedRequest.headers = {
      host: host,
    };

    mockedRequest.body = {}; // Mock request body

    await formController.post(mockedRequest, mockedResponse, mockNext);

    //console.log(mockedResponse.);

    // Assert expected behavior here
    expect(mockedResponse.render).toHaveBeenCalledWith('forms/checkbox-group', expect.any(Object));
  });

  test('should fail to Post', async () => {
    const mockSession = {
      newmanager: {
        get: jest.fn().mockReturnValue(null),
      },
    };

    mockedRequest = mockRequest(null);
    mockedResponse = mockResponse();

    mockedRequest.params = { id: 'PF0001-RA0001' };
    mockedRequest.session = mockSession;
    mockedRequest.protocol = protocol;
    mockedRequest.headers = {
      host: host,
    };

    mockedRequest.body = {}; // Mock request body

    await formController.post(mockedRequest, mockedResponse, mockNext);

    // Assert expected behavior here
    expect(mockNext).toHaveBeenCalledWith(new HTTPError(ErrorMessages.UNEXPECTED_ERROR, 404));
  });
});
