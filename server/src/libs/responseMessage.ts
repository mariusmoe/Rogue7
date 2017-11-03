

export let msg = (value: string) => {
  return {
    'message': status[value].message,
    'status': status[value].status,
  };
};

interface statusObj {
    [key: string]: { message: string, status: number };
}

const status: statusObj = {
  // ROUTER CODES: 10000
  'ROUTE_INVALID': {
    message: 'The requested route does not exist. Did you forget a param?',
    status: 10000,
  },
  'ROUTE_UNAUTHORISED': {
    message: 'The requested route does not exist. Did you forget a param?',
    status: 10000,
  },

  // AUTH CODES: 20000
  'NO_USERNAME_OR_PASSWORD': {
    message: 'Missing username or password',
    status: 20000,
  },
  'NO_OR_BAD_ROLE': {
    message: 'Missing or bad role',
    status: 20001,
  },
  'USERNAME_NOT_AVILIABLE': {
    message: 'Username already taken',
    status: 20002,
  },
  'ACCOUNT_CREATED': {
    message: 'Account created',
    status: 20003,
  },
  'ACCOUNT_DELETED': {
    message: 'Account successfully deleted',
    status: 20004,
  },
  'NO_PASSWORD_OR_NEW_PASSWORDS': {
    message: 'Missing password, newPassword or confirm',
    status: 20005,
  },
  'PASSWORD_AND_CONFIRM_NOT_EQUAL': {
    message: 'newPassword and confirm are not equal',
    status: 20006,
  },
  'PASSWORD_DID_NOT_MATCH': {
    message: 'Password did not match the current password',
    status: 20007,
  },
  'PASSWORD_UPDATED': {
    message: 'Password has been successfully updated',
    status: 20008,
  },


  // CMS CODES: 30000
  'CMS_NO_ROUTES': {
    message: 'No routes were found',
    status: 30000,
  },
  'CMS_CONTENT_NOT_FOUND': {
    message: 'Could not retrieve content for the provided route',
    status: 30001,
  },
  'CMS_DATA_UNPROCESSABLE': {
    message: 'The provided data could not be processed',
    status: 30002,
  },
  'CMS_DATA_UNABLE_TO_SAVE': {
    message: 'Could not save. Internal server error',
    status: 30003,
  },
  'CMS_CONTENT_DELETED': {
    message: 'Content was successfully deleted',
    status: 30004,
  },


  // STEAM CODES: 40000
  'STEAM_SERVER_ONLINE': {
    message: 'Steam server is online',
    status: 40000,
  },
  'STEAM_SERVER_OFFLINE': {
    message: 'Steam server is offline',
    status: 40001,
  },
  'STEAM_SERVER_TIMED_OUT': {
    message: 'Steam server request timed out',
    status: 40002,
  },
  'STEAM_NO_ROUTES': {
    message: 'No routes were found',
    status: 40003,
  },
  'STEAM_SERVER_NOT_FOUND': {
    message: 'Could not retrieve server data for the provided route',
    status: 40004,
  },
  'STEAM_DATA_UNPROCESSABLE': {
    message: 'The provided data could not be processed',
    status: 40005,
  },
  'STEAM_DATA_UNABLE_TO_SAVE': {
    message: 'Could not save. Internal server error',
    status: 40006,
  },
  'STEAM_CONTENT_DELETED': {
    message: 'Server data was successfully deleted',
    status: 40007,
  },
};
