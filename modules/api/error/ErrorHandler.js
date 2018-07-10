class ErrorHandler {
  static handle(res, ex) {
    if (ex instanceof Error) {
      res.status(ex.errorCode ? ex.errorCode : 500).send(ex.message);
    }
  }
}

module.exports = ErrorHandler;
