const validator = require('validator'),
      createDOMPurify = require('dompurify'),
      { JSDOM } = require('jsdom'),
      windowForDOMPurify = (new JSDOM('')).window,
      DOMPurify = createDOMPurify(windowForDOMPurify),
      mongoose = require('mongoose'),
      Content = require('../models/content'),
      msg = require('../libs/responseMessage');



// ---------------------------------------
// --------------- CONTENT ---------------
// ---------------------------------------


// GET CONTENT LIST

exports.getContentList = (req, res, next) => {
  const user = req.user;
  console.log(user);
  const accessRights = ['everyone'];
  if (user) {
    accessRights.push('user');
    if (user.role === 'admin') { accessRights.push('admin'); }
  }

  Content.find({ access: { $in: accessRights }}, { 'title': true, 'route': true, 'access': true }, (err, contentList) => {
    if (err) { next(err); }
    if (!contentList) {
      return res.status(404).send(msg.append('CMS_NO_ROUTES'));
    }
    return res.status(200).send(contentList);
  }).lean();
};


// GET CONTENT

exports.getContent = (req, res, next) => {
  const route      = req.params.route,
        user       = req.user;

  console.log(user);

  Content.findOne({ route: route }, (err, content) => {
    if (err) { next(err); }
    if (!content) {
      return res.status(404).send(msg.append('CMS_CONTENT_NOT_FOUND'));
    }
    let access = content.access == 'everyone' ||
                 (user && user.role == 'admin') ||
                 (user && user.role == content.access);

    if (!access) {
      return res.status(401).send(msg.append('ROUTE_UNAUTHORISED'));
    }
    return res.status(200).send(content);
  }).lean();
};


// CREATE CONTENT

exports.createContent = (req, res, next) => {
  const data = req.body,
        user = req.user;

  if (validator.isEmpty(data.route) || validator.isEmpty(data.content) || validator.isEmpty(data.access)) {
      return res.status(422).send(msg.append('CMS_DATA_UNPROCESSABLE'));
  }
  if (['admin', 'user', 'everyone'].indexOf(data.access) == -1) {
    return res.status(422).send(msg.append('CMS_DATA_UNPROCESSABLE'));
  }

  // Sanitize
  data.content = DOMPurify.sanitize(data.content);
  console.log(data);

  let content = new Content({
    title: data.title,
    route: data.route,
    access: data.access,
    content: data.content,
    createdBy: user._id,
    updatedBy: user._id,
  });
  content.save((err, success) => {
    if (err) { next(err); }
    if (success) {
      return res.status(200).send(success);
    }
    return res.status(500).send(msg.append('CMS_DATA_UNABLE_TO_SAVE'));
  });

};

// PATCH CONTENT

exports.patchContent = (req, res, next) => {
  const route      = req.params.route,
        data       = req.body,
        user       = req.user;

  if (validator.isEmpty(data.route) || validator.isEmpty(data.title) || validator.isEmpty(data.content)) {
      return res.status(422).send(msg.append('CMS_DATA_UNPROCESSABLE'));
  }

  // Sanitize
  data.content = DOMPurify.sanitize(data.content);
  console.log(data);

  Content.findOneAndUpdate({route: route }, { $set: data }, {new: true}, (err, content) => {
    if (err) { next(err); }
    if (content) {
      return res.status(200).send(content);
    }
    return res.status(500).send(msg.append('CMS_DATA_UNABLE_TO_SAVE'));
  });
};


// DELETE CONTENT

exports.deleteContent = (req, res, next) => {
  const route = req.params.route;

  Content.remove({route: route}, (err, success) => {
    if (err) { next(err); }
    if (success) {
      return res.status(200).send(msg.append('CMS_CONTENT_DELETED'));
    }
    return res.status(404).send(msg.append('CMS_CONTENT_NOT_FOUND'));
  });
};
