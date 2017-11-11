
interface StatusMessage {
  message: string;
}

export const status = (value: string): StatusMessage => {
  return { 'message': value };
};


export const enum ROUTE_STATUS {
  INVALID                         = 'The requested route does not exist. Did you forget a param?',
  UNAUTHORISED                    = 'Unauthorized'
}

export const enum AUTH_STATUS {
  NO_USERNAME_OR_PASSWORD         = 'Missing username or password',
  NO_OR_BAD_ROLE                  = 'Missing or bad role',
  USERNAME_NOT_AVILIABLE          = 'Username already taken',
  USER_ID_NOT_FOUND               = 'The provided ID doesn\'t exist',
  ACCOUNT_CREATED                 = 'Account created',
  ACCOUNT_DELETED                 = 'Account successfully deleted',
  NO_PASSWORD_OR_NEW_PASSWORDS    = 'Missing password, newPassword or confirm',
  PASSWORD_AND_CONFIRM_NOT_EQUAL  = 'newPassword and confirm are not equal',
  PASSWORD_DID_NOT_MATCH          = 'Password did not match the current password',
  PASSWORD_UPDATED                = 'Password has been successfully updated',
}

export const enum CMS_STATUS {
  NO_ROUTES                       = 'No routes were found',
  CONTENT_NOT_FOUND               = 'Could not retrieve content for the provided route',
  DATA_UNPROCESSABLE              = 'The provided data could not be processed',
  DATA_UNABLE_TO_SAVE             = 'Could not save. Internal server error',
  CONTENT_DELETED                 = 'Content was successfully deleted',
}

export const enum STEAM_STATUS {
  NO_ROUTES                       = 'No routes were found',
  SERVER_ONLINE                   = 'Steam server is online',
  SERVER_OFFLINE                  = 'Steam server is offline',
  SERVER_TIMED_OUT                = 'Steam server request timed out',
  SERVER_NOT_FOUND                = 'Could not retrieve server data for the provided route',
  DATA_UNPROCESSABLE              = 'The provided data could not be processed',
  DATA_UNABLE_TO_SAVE             = 'Could not save. Internal server error',
  CONTENT_DELETED                 = 'Server data was successfully deleted',
  CONTENT_NOT_FOUND               = 'Could not find the server content requested',
}
