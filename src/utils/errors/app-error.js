class AppError extends Error {
  constructor(message, explanation, statusCode) {
    super(message);
    this.message = message;
    this.explanation = explanation;
    this.statusCode = statusCode;
  }
}

module.exports = AppError;
