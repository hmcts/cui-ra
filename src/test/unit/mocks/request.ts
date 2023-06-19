export const mockRequest = (data: any) => {
  const req: any = {
    body: '',
  };
  req.body = jest.fn().mockReturnValue(req);
  return req;
};
