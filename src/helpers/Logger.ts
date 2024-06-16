export default abstract class Logger {
  public static config = {
    includeTimestamp: true,
  };

  public static log(message: string) {
    console.log(this.formatMessage(message));
  }

  public static error(message: string) {
    console.error(this.formatMessage(message));
  }

  public static warn(message: string) {
    console.warn(this.formatMessage(message));
  }

  private static formatMessage(message: string) {
    const info = [];
    if (this.config.includeTimestamp) {
      info.push(this.getTimestamp());
    }

    if (info.length === 0) {
      return message;
    }

    const infoString = `[${info.join(" ")}]: `;
    return `${infoString}${message}`;
  }

  private static getTimestamp() {
    return new Date().toISOString();
  }
}
