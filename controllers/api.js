/*!
 * SuperWedding - controllers/api.js
 */

'use strict';

/**
 * Module dependencies.
 */
var fs = require('fs');
var crypto = require('crypto');
var formidable = require('formidable');
var utility = require('utility');
var eventproxy = require('eventproxy');
var qn = require('qn');
var exif = require('exif').ExifImage;
var config = require('../config');

var qnClient = qn.create(config.qn);

function badRequest(res, filePath) {
  res.statusCode = 400;
  if (filePath) {
    fs.unlink(filePath, utility.noop);
  }
  return res.end();
}

function getUniqFileName(fileName) {
  var ext = '.' + fileName.split('.')[1];
  var rand = crypto.randomBytes(16).toString('hex');
  return fileName.replace(ext, '.' + rand + ext);
}

exports.upload = function (req, res, next) {

  var form = new formidable.IncomingForm();
  var ret = {};

  // Parse uploaded file.
  form.parse(req, function (err, fields, files) {
    if (err) {
      return next(err);
    }
    var upload = files.upload || {};
    var filePath = upload.path;
    var fileName = upload.name;
    // console.log(upload);
    if (!upload.size) {
      return badRequest(res, filePath);
    }
    // Ensure is a image file.
    if (upload.type.substring(0, 5) !== 'image') {
      return badRequest(res, filePath);
    }
    var ep = eventproxy.create();
    ep.fail(next);
    // Read Exif metadata from this image.
    try {
      new exif({image: filePath}, ep.doneLater('exif'));
    } catch (ex) {
      return next(ex);
    }
    // Save to qiniu.
    var randName = getUniqFileName(fileName);
    randName = [utility.YYYYMMDD(), randName].join('/');
    qnClient.uploadFile(filePath, {key: randName}, ep.doneLater('qn'));
    ep.all('exif', 'qn', function (exifData, qnResult) {
      ret.image = {url: qnResult.url};
      ret.gps = exifData.gps || {};
      res.statusCode = 200;
      return res.json(ret);
    });
  });
};
