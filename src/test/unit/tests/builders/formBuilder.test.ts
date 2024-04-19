import { FormBuilder } from './../../../../main/builders';
import { ErrorMessages } from './../../../../main/constants';
import { DataManagerDataObject } from './../../../../main/interfaces';
import { mockRequest, mockResponse } from './../../mocks';

describe('FormBuilder', () => {
  // Mock Request and Response objects
  let req = mockRequest({});
  let res = mockResponse();

  beforeEach(() => {
    req = mockRequest({});
    res = mockResponse();
  });

  test('should render radio-group template when parent has _listOfValuesLength less than radio.listOfValuesLength = 10', () => {
    const parent = { _listOfValuesLength: 2 } as unknown as DataManagerDataObject;
    FormBuilder.build(req, res, parent);
    expect(res.render).toHaveBeenCalledWith('forms/radio-group', {
      parent,
      children: null,
      validationErrors: {},
    });
  });

  test('should render type-ahead template when parent has _listOfValuesLength greater than or equal to radio.listOfValuesLength = 10', () => {
    const parent = { _listOfValuesLength: 10 } as unknown as DataManagerDataObject;
    FormBuilder.build(req, res, parent);
    expect(res.render).toHaveBeenCalledWith('forms/type-ahead', {
      parent,
      children: null,
      validationErrors: {},
    });
  });

  test('should render checkbox-group template when parent is a category page', () => {
    const parent = { _isCategoryPage: true } as unknown as DataManagerDataObject;
    FormBuilder.build(req, res, parent);
    expect(res.render).toHaveBeenCalledWith('forms/checkbox-group', {
      parent,
      children: null,
      validationErrors: {},
    });
  });

  test('should throw an error for unexpected conditions', () => {
    const parent = { _listOfValuesLength: undefined, _isCategoryPage: false } as unknown as DataManagerDataObject;
    expect(() => FormBuilder.build(req, res, parent)).toThrowError(ErrorMessages.UNEXPECTED_ERROR);
  });

  test('should handle errorKeys and populate validationErrors accordingly', () => {
    // Create parent and children objects
    const parent = {
      _isParent: true,
      _listOfValuesLength: 5,
      _listOfValues: [{ key: 'key1' }],
    } as unknown as DataManagerDataObject;
    const children = [
      { id: 'childId1', value: { name: 'Child A', flagCode: 'A' } },
      { id: 'childId2', value: { name: 'Child B', flagCode: 'B' } },
    ] as unknown as DataManagerDataObject[];

    // Create validationErrors object with initial keys
    const validationErrors: { [key: string]: string } = {
      '_enabled-xyz': 'error message 1',
    };

    // Call FormBuilder.build with the above setup
    FormBuilder.build(req, res, parent, children, validationErrors);

    expect(res.render).toHaveBeenCalledWith(
      expect.any(String), // We expect the first argument to be a string (the template)
      expect.objectContaining({
        // We expect the second argument to be an object (the options)
        parent,
        children,
        validationErrors: {
          '_enabled-childId1': 'error message 1', // Modified key
        },
      })
    );
  });

  test('should determine radio-group template', () => {
    const parent = { _listOfValuesLength: 5 } as unknown as DataManagerDataObject;
    const template = FormBuilder['determineTemplate'](parent, 10);
    expect(template).toBe('forms/radio-group');
  });

  test('should determine type-ahead template', () => {
    const parent = { _listOfValuesLength: 15 } as unknown as DataManagerDataObject;
    const template = FormBuilder['determineTemplate'](parent, 10);
    expect(template).toBe('forms/type-ahead');
  });

  test('should determine checkbox-group template', () => {
    const parent = { _isCategoryPage: true } as unknown as DataManagerDataObject;
    const template = FormBuilder['determineTemplate'](parent, 10);
    expect(template).toBe('forms/checkbox-group');
  });

  test('should throw error for unexpected condition in determineTemplate', () => {
    const parent = { _listOfValuesLength: undefined, _isCategoryPage: false } as unknown as DataManagerDataObject;
    expect(() => FormBuilder['determineTemplate'](parent, 10)).toThrowError(ErrorMessages.UNEXPECTED_ERROR);
  });

  test('should modify validation errors for parent and children', () => {
    const parent = {
      _isParent: true,
      _listOfValuesLength: 5,
      _listOfValues: [{ key: 'key1' }],
    } as unknown as DataManagerDataObject;
    const children = [{ id: 'childId1' }] as unknown as DataManagerDataObject[];
    const validationErrors: { [key: string]: string } = { '_enabled-childId_xyz': 'error message' };

    FormBuilder['modifyValidationErrors'](validationErrors, parent, children, 10);

    expect(validationErrors).toEqual({ '_enabled-childId1': 'error message' });
  });

  test('should modify validation errors for parent only', () => {
    const parent = { _isParent: true } as unknown as DataManagerDataObject;
    const validationErrors: { [key: string]: string } = { '_enabled-xyz': 'error message' };

    FormBuilder['modifyValidationErrors'](validationErrors, parent, null, 10);

    expect(validationErrors).toEqual({ '_enabled-xyz': 'error message' });
  });

  test('should not modify validation errors if no keys exist', () => {
    const validationErrors: { [key: string]: string } = {};

    FormBuilder['modifyValidationErrors'](validationErrors, {} as DataManagerDataObject, null, 10);

    expect(validationErrors).toEqual({});
  });
});
