export interface ServiceAuth {
  getOneTimeToken(): Promise<string>;
  getToken(): Promise<string>;
  validateToken(token: string): Promise<string>;
}
