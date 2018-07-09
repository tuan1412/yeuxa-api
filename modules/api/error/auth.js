class AuthError extends Error {
  constructor(message = "Authentication Error") {
    super(message);
   // Ensure the name of this error is the same as the class name
    this.name = this.constructor.name;
    this.errorCode = 401
   // This clips the constructor invocation from the stack trace.
   // It's not absolutely essential, but it does make the stack trace a little nicer.
   //  @see Node.js reference (bottom)
    Error.captureStackTrace(this, this.constructor);
  }
}

class RequestError extends Error {
  constructor(message = "Request Error") {
    super(message);
   // Ensure the name of this error is the same as the class name
    this.name = this.constructor.name;
    this.errorCode = 400
   // This clips the constructor invocation from the stack trace.
   // It's not absolutely essential, but it does make the stack trace a little nicer.
   //  @see Node.js reference (bottom)
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = {AuthError, RequestError};