const ErrorHandler = require("../error/ErrorHandler");
const { AuthError } = require("../error/auth");

const authorize = (req, res, next) => {
  if (!req.session || !req.session.userInfo) {
    try {
      throw new AuthError();
    } catch (error) {
      ErrorHandler.handle(res, error);
    }
  } else next();
};

module.exports = { authorize };
