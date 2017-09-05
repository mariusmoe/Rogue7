const validator = require('validator'),
      sanitizer = require('sanitizer'),
      mongoose = require('mongoose'),
      Content = require('../models/content'),
      status = require('../status');


exports.getContent = (req, res, next) => {
  const contentId = req.params.contentId,
        user      = req.user;

  Content.findById(contentId, (err, content) => {
    if (err) { next(err); }
    if (!content) {
      return res.status(404).send();
    }
    let access = content.access == 'everyone' ||
                 (user && user.role == 'admin') ||
                 (user && user.role == content.access);

    if (!access) {
      return res.status(401).send();
    }
    return res.status(200).send(content);
  }).lean();
};

exports.createContent = (req, res, next) => {
  const data = req.body,
        user = req.user;


  if (validator.isEmpty(data.route) || validator.isEmpty(data.content) || validator.isEmpty(data.access)) {
      return res.status(422).send();
  }

  if (['admin', 'user', 'everyone'].indexOf(data.access) == -1) {
    return res.status(422).send();
  }

  // Sanitize
  data.route = sanitizer.sanitize(data.route);
  data.content = sanitizer.sanitize(data.content);

  // Escape
  data.route = sanitizer.escape(data.route);
  // data.content = sanitizer.escape(data.content);

  console.log(data);

  let content = new Content({
    route: data.route,
    content: data.content,
    access: data.access,
    updatedBy: user,
  })

  content.save((err, success) => {
    if (err) { next(err); }
    if (success) {
      return res.status(200).send(success);
    }
    return res.status(500).send();
  });

};

exports.patchContent = (req, res, next) => {


};

exports.getContentStructure = (req, res, next) => {
  const user = req.user;

  const query = {
    access: { '$in': ['everyone'] }
  }
  if (user) {
    query.access['$in'].push(user.role);
  }

  Content.find(query, { content: false }, (err, content) => {
    if (err) { next(err); }
    return res.status(200).send(content);
  }).lean();
};
