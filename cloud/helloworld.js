


var util = require('util');
// var assert = require('assert');
var crypto = require('crypto');
// var http = require('http');
var querystring = require('querystring');
var PROTOCOL_SCHEMA = 'http://';
var SERVER_HOST = 'channel.api.duapp.com';
var COMMON_PATH = '/rest/2.0/channel/';
//var URL_HEADER = PROTOCOL_SCHEMA + SERVER_HOST;
var debug = true;


/*
 * error message
 */
var errMsg = {
  INVALID_ARGS: 'Arguments error',
  INVALID_USER_ID: 'Arguments error: invalid user_id, the length of user_id must be less than 257B',
  INVALID_START: 'Arguments error: invalid start, start must be equal or greater than 0 ',
  INVALID_LIMIT: 'Arguments error: invalid limit, limit must be greater than 0 ',
  INVALID_CHANNEL_ID: 'Arguments error: invalid channel_id, type of value must be String',
  INVALID_MESSAGES: 'Arguments error: invalid messages type of messages must be String',
  INVALID_TAG: 'Arguments error: invalid tag, the length of tag must be less than 129B',
  INVALID_PUSH_TYPE: 'Arguments error: invalid push_type, type of push_type is 1, 2 or 3',
  INVALID_DEVICE_TYPE: 'Arguments error: invalid device_type, type of device_type is 1, 2, 3, 4 or 5',
  INVALID_MESSAGE_TYPE: 'Arguments error: invalid message_type, type of message_type is 0 or 1',
  INVALID_MSG_KEYS: 'Arguments error: invalid msg_keys, type of messages must be String',
  INVALID_MESSAGE_EXPIRES: 'Arguments error: invalid message_expires, message_expires must be equal or greater than 0 ',
};


/*
 * To encode url
 * @param {String} str Body string
 * @returns {String} encoded url
 * @desc php urlencode is different from js, the way of Push server encode is same with php, so js need do some change
 */
function urlencode (str) {
  // http://kevin.vanzonneveld.net
  str = (str + '').toString();

  // Tilde should be allowed unescaped in future versions of PHP (as reflected below), but if you want to reflect current
  // PHP behavior, you would need to add ".replace(/~/g, '%7E');" to the following.
  return encodeURIComponent(str).replace(/!/g, '%21').replace(/'/g, '%27').replace(/\(/g, '%28').
  replace(/\)/g, '%29').replace(/\*/g, '%2A').replace(/%20/g, '+');
}

/*
 * Get current time
 * @returns {Number} The current time in seconds since the Epoch
 */
function getTimestamp() {
    var timestamp = Math.floor(new Date().getTime() / 1000);
    return timestamp;
}

/*
 * Sort Obj with abc
 */
function sortObj(obj) {
  var index = [];
  var tmpObj = {};
  for (var i in obj) {
    if (obj.hasOwnProperty(i)) {
      index.push(i);
    }
  }
  index.sort();

  for(i = 0; i < index.length; i++){
    tmpObj[index[i]] = obj[index[i]];
  }
  return tmpObj;
}

/*
 * Generate sign
 * @see http://developer.baidu.com/wiki/index.php?title=docs/cplat/mq/sign
 * @param {String} method HTTP request method
 * @param {String} url HTTP request url
 * @param {Object} params HTTP request body
 * @param {String} sk User's secret key in bae
 * @returns {String} sign
 */
function getSign(method, url, params, sk) {
    var baseStr = method + url;

    for (var i in params) {
        baseStr += i + '=' + params[i];
    }

    baseStr += sk;
    //var encodeStr = encodeURIComponent(baseStr);
    var encodeStr = urlencode(baseStr);
    if (debug) {
        console.log('getSign: base str = ' + baseStr + ', encode str = ' + encodeStr);
    }

    var md5sum = crypto.createHash('md5');
    md5sum.update(encodeStr);

    var sign = md5sum.digest('hex');
    return sign;
}

/*
 * Check options
 * @param {Object} options
 * @param {Array} must Properties are must in options
 */
function checkOptions(options, must){

  must.forEach(function (ele) {
    if (!options.hasOwnProperty(ele)) {
      var err = errMsg.INVALID_ARGS + ': ' + ele + ' is must';
      throw new Error(err);
    }
  });

  function checkType(type, condition) {

  	for (var i = 0; i < condition.length; i++) {
  	  if (type === condition[i]) {
  	  	return true
  	  }
  	}
  	return false;
  }

  if (options['user_id'] && !(typeof options['user_id'] === 'string' && options['user_id'].length <= 256)) {
    throw new Error(errMsg.INVALID_USER_ID);
  }
  if (options['start'] && !(typeof options['start'] === 'number' && options['start'] >= 0)) {
    throw new Error(errMsg.INVALID_START);
  }
  if (options['limit'] && !(typeof options['limit'] === 'number' && options['limit'] > 0)) {
    throw new Error(errMsg.INVALID_LIMIT);
  }
  if (options['channel_id'] && !(typeof options['channel_id'] === 'string')) {
    throw new Error(errMsg.INVALID_CHANNEL_ID);
  }
  if (options['push_type'] && !(typeof options['push_type'] === 'number' && checkType(options['push_type'], [1, 2, 3]))) {
    throw new Error(errMsg.INVALID_PUSH_TYPE);
  }
  if (options['device_type'] && !(typeof options['device_type'] === 'number' && checkType(options['device_type'], [1, 2, 3, 4, 5]))) {
    throw new Error(errMsg.INVALID_DEVICE_TYPE);
  }
  if (options['message_type'] && !(typeof options['message_type'] === 'number' && checkType(options['message_type'], [0, 1]))) {
    throw new Error(errMsg.INVALID_MESSAGE_TYPE);
  }
  if (options['tag'] && !(typeof options['tag'] === 'string' && options['tag'].length <= 128)) {
    throw new Error(errMsg.INVALID_TAG);
  }
  if (options['messages'] && !(typeof options['messages'] === 'string')) {
    throw new Error(errMsg.INVALID_MESSAGES);
  }
  if (options['msg_keys'] && !(typeof options['msg_keys'] === 'string')) {
    throw new Error(errMsg.INVALID_MSG_KEYS);
  }
  if (options['message_expires'] && !(typeof options['message_expires'] === 'string')) {
    throw new Error(errMsg.INVALID_MESSAGE_EXPIRES);
  }
}

var coolNames = ['Ralph', 'Skippy', 'Chip', 'Ned', 'Scooter'];
exports.isACoolName = function(name) {
	urlencode(name);
  return coolNames.indexOf(name) !== -1;
}
