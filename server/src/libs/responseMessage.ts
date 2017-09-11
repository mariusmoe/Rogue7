

export let msg = (value) => {
  return {
    'message': status[value].message,
    'status': status[value].status,
  };
}


const status = {
  // ROUTER CODES: 10000
  ROUTE_INVALID: {
    message: "The requested route does not exist. Did you forget a param?",
    status: 10000,
  },
  ROUTE_UNAUTHORISED: {
    message: "The requested route does not exist. Did you forget a param?",
    status: 10000,
  },

  // AUTH CODES: 20000
  NO_EMAIL_OR_PASSWORD: {
    message: "Missing email or password",
    status: 20000,
  },
  NO_OR_BAD_ROLE: {
    message: "Missing or bad role",
    status: 20001,
  },
  EMAIL_NOT_AVILIABLE: {
    message: "Email already taken",
    status: 20002,
  },
  ACCOUNT_CREATED: {
    message: "Account created",
    status: 20003,
  },
  ACCOUNT_DELETED: {
    message: "Account successfully deleted",
    status: 20004,
  },
  NO_PASSWORD_OR_NEW_PASSWORDS: {
    message: "Missing password, newPassword or confirm",
    status: 20005,
  },
  PASSWORD_AND_CONFIRM_NOT_EQUAL: {
    message: "newPassword and confirm are not equal",
    status: 20006,
  },
  PASSWORD_DID_NOT_MATCH: {
    message: "Password did not match the current password",
    status: 20007,
  },
  PASSWORD_UPDATED: {
    message: "Password has been successfully updated",
    status: 20008,
  },


  // CMS CODES: 30000
  CMS_NO_ROUTES: {
    message: "No routes were found",
    status: 30000,
  },
  CMS_CONTENT_NOT_FOUND: {
    message: "Could not retrieve content for the provided route",
    status: 30001,
  },
  CMS_DATA_UNPROCESSABLE: {
    message: "The provided data could not be processed",
    status: 30002,
  },
  CMS_DATA_UNABLE_TO_SAVE: {
    message: "Could not save. Internal server error",
    status: 30003,
  },
  CMS_CONTENT_DELETED: {
    message: "Content were successfully deleted",
    status: 30004,
  },


  // DNL CODES: 40000
  DNL_SERVER_ONLINE: {
    message: "DNL server is online",
    status: 40000,
  },
  DNL_SERVER_OFFLINE: {
    message: "DNL Server is offline",
    status: 40001,
  },
  DNL_SERVER_TIMED_OUT: {
    message: "DNL server request timed out",
    status: 40002,
  },
}
