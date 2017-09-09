const status = require('../status');



exports.append = (value) => {
  return {
    'message': status[value].message,
    'status': status[value].status,
  };
}
