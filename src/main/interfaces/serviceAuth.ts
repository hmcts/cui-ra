export interface ServiceAuth {
  getOneTimeToken(): string;
  getToken(): Promise<string>;
  validateToken(token: string): Promise<string>;
}
