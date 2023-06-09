export class S2S {
  private readonly secret: string;

  constructor() {
    this.secret = '';
  }

  public getToken(): string {
    return this.secret;
  }

  public validateToken(token: string): boolean {
    if (token) {
      return true;
    }
    return false;
  }
}
