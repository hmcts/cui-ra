export const mockRequest = (data: any) => {
  const req: any = {
    session: jest.fn(),
    body: '',
  };
  req.body = jest.fn().mockReturnValue(req);
  return req;
};
