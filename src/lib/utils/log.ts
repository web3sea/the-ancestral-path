// 🎯 NestJS-style logger
export class Logger {
  static getTimestamp() {
    const now = new Date();
    return `${now.getHours().toString().padStart(2, "0")}:${now
      .getMinutes()
      .toString()
      .padStart(2, "0")}:${now.getSeconds().toString().padStart(2, "0")}`;
  }

  static log(message: string, context = "Application") {
    console.log(
      `\x1b[32m[${context}]\x1b[0m ${this.getTimestamp()} - \x1b[32mLOG\x1b[0m - ${message}`
    );
  }

  static error(message: string, context = "Application") {
    console.log(
      `\x1b[31m[${context}]\x1b[0m ${this.getTimestamp()} - \x1b[31mERROR\x1b[0m - ${message}`
    );
  }

  static warn(message: string, context = "Application") {
    console.log(
      `\x1b[33m[${context}]\x1b[0m ${this.getTimestamp()} - \x1b[33mWARN\x1b[0m - ${message}`
    );
  }

  static debug(message: string, context = "Application") {
    console.log(
      `\x1b[36m[${context}]\x1b[0m ${this.getTimestamp()} - \x1b[36mDEBUG\x1b[0m - ${message}`
    );
  }

  static success(message: string, context = "Application") {
    console.log(
      `\x1b[32m[${context}]\x1b[0m ${this.getTimestamp()} - \x1b[32mSUCCESS\x1b[0m - ${message}`
    );
  }
}
