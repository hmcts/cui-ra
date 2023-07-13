export class DataTimeUtilities {
  public static getDateTime(): string {
    const now: Date = new Date();
    return `${now.getDate().toString().padStart(2, '0')}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now
      .getFullYear()
      .toString()} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now
      .getSeconds()
      .toString()
      .padStart(2, '0')}`;
  }
}
