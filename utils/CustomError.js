export class CustomError extends Error {
  constructor(msg, errCode, reason, data) {
    super(msg);
    this.reason = reason;
    this.data = data;
    this.statusCode = errCode;
  }
}
