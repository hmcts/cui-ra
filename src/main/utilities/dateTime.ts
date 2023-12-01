export class DataTimeUtilities {
  public static getDateTime(): string {
    const now: Date = new Date();
    return now.toISOString();
  }
}
