module.exports = {
  // ROUTER CODES: 10000
  ROUTE_INVALID: {
    message: "The requested route does not exist. Did you forget a param?",
    code: 10000,
  },

  // AUTH CODES: 20000
  NO_EMAIL_OR_PASSWORD: {
    message: "Missing email or password",
    code: 20000,
  },
  NO_OR_BAD_ROLE: {
    message: "Missing or bad role",
    code: 20001,
  },
  EMAIL_NOT_AVILIABLE: {
    message: "Email already taken",
    code: 20002,
  },
  ACCOUNT_CREATED: {
    message: "Account created",
    code: 20003,
  },
  NO_PASSWORD_OR_NEW_PASSWORDS: {
    message: "Missing password, newPassword or confirm",
    code: 20004,
  },
  PASSWORD_AND_CONFIRM_NOT_EQUAL: {
    message: "newPassword and confirm are not equal",
    code: 20005,
  },
  PASSWORD_DID_NOT_MATCH: {
    message: "Password did not match the current password",
    code: 20006,
  },
  PASSWORD_UPDATED: {
    message: "Password has been successfully updated",
    code: 20007,
  },




  // DNL CODES: 40000
  DNL_SERVER_ONLINE: {
    message: "DNL server is online",
    code: 40000,
  },
  DNL_SERVER_OFFLINE: {
    message: "DNL Server is offline",
    code: 40001,
  },
  DNL_SERVER_TIMED_OUT: {
    message: "DNL server request timed out",
    code: 40002,
  },
}
