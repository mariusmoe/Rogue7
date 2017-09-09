"use strict";

const msg = require('../libs/responseMessage');


exports.error = (req, res, next) => {
  return res.status(404).send(msg.append('ROUTE_INVALID'));
};
