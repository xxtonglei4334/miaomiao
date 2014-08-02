// Use AV.Cloud.define to define as many cloud functions as you want.
// For example:
AV.Cloud.define("hello", function(request, response) {
	response.success("Hello world!");
});


AV.Cloud.define("test", function(request, response) {
	response.success("test ok");
});


// var Push = require('cloud/push.js');

// function pushMessage(bdUserId, messages, response){
// 				//配置push对象
// 			var opt = {
// 				ak: '0C3jS31DYteNDW1HAM3TGcKV',
// 				sk: '4mncUaMrC6L7h7Pqtf21XOx0azBGNcVa'
// 			};


// 			var client = new Push(opt);
// 			//推送参数
// 			var push_opt = {
// 				push_type: 0,
// 				user_id: '1100801892847586532',
// 				messages: JSON.stringify(messages),
// 				msg_keys: JSON.stringify([new Date().getTime() + ""])
// 			}
// 			client.pushMsg(opt, function(err, result) {
// 				if (err) {
// 					console.log(err);
// 					response.error(error);
// 					return;
// 				}
// 				response.success(res);
// 				console.log(result);
// 			});
// }

//发送消息函数
AV.Cloud.define("sendMsg", function(request, response) {
	var query = new AV.Query(AV.User);
	query.get(request.params.userId, {
		success: function(user) {
			var bdUserId = user.get("bd_userId");
			var messages = request.params.messages;
			console.log("nickName:" + user.get("nickName"));
			// response.success("nickName:" + user.get("nickName"));
			// pushMessage(bdUserId, messages, response);
		




			//配置push对象
			var opt = {
				ak: '0C3jS31DYteNDW1HAM3TGcKV',
				sk: '4mncUaMrC6L7h7Pqtf21XOx0azBGNcVa'
			};

			console.log(opt.ak);
			console.log(opt.sk);
			// var Push = require('/cloud/push.js');
			var client = new Push(opt);

			console.log("ok");
			response.success("ok");

			// //推送参数
			// var push_opt = {
			// 	push_type: 0,
			// 	user_id: '1100801892847586532',
			// 	messages: JSON.stringify(["hello, push0", "hello, push1", "hello, push2"]),
   //  			msg_keys: JSON.stringify(["key0", "key1", "key2"])
			// 	// messages: request.messages,
			// 	// msg_keys: JSON.stringify([new Date().getTime() + ""])
			// 	// msg_keys: JSON.stringify(["8989777656"])
			// }

			// console.log(push_opt.messages);
			// console.log(push_opt.msg_keys);
			// client.pushMsg(opt, function(err, result) {
			// 	if (err) {
			// 		console.log(err);
			// 		response.error(error);
			// 		return;
			// 	}
			// 	response.success(res);
			// 	console.log(result);
			// });






















		},
		error: function(object, error) {
			console.log(error);
			response.error(error);
		}
	});
});







/*
 * Push API wrapper
 *
 */

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
 * Common Push request
 * @param {Object} bodyArgs
 * @param {String} path Url path
 * @param {String} sk User's secret key in bae
 * @param {function} cb cb(err, result)
 */
function request(bodyArgs, path, sk, id, host, cb) {

    // assert.ok(bodyArgs.method);
    // assert.ok(path);
    // assert.ok(sk);

    bodyArgs.sign = getSign('POST', PROTOCOL_SCHEMA + host + path, bodyArgs, sk);


    var bodyArgsArray = [];
    for (var i in bodyArgs) {
      if (bodyArgs.hasOwnProperty(i)) {
        bodyArgsArray.push(i + '=' + urlencode(bodyArgs[i]));
        }
    }
    var bodyStr = bodyArgsArray.join('&');


    //var bodyStr = querystring.stringify(bodyArgs);

    if (debug) {
        console.log('body length = ' + bodyStr.length + ', body str = ' + bodyStr);
    }

    var options = {
        host: host,
        method: 'POST',
        path: path,
        headers: {'Content-Length': bodyStr.length,
                  'Content-Type':'application/x-www-form-urlencoded'
                 }
    };

    //add by tonglei 
    var urlStr = host + path;

    console.log("tonglei:url" + urlStr);

AV.Cloud.httpRequest({
  method: 'POST',
  url: urlStr,
  headers: {'Content-Length': bodyStr.length,
                  'Content-Type':'application/x-www-form-urlencoded'
                 }
  body: bodyStr,
  success: function(httpResponse) {
    var resBody = httpResponse.text;
    try {
          var jsonObj = JSON.parse(resBody);
        } catch(e) {
        cb && cb(e);
        return;
    }

  var errObj = null;
  id.request_id = jsonObj['request_id'];
  parseRespone(id.request_id, httpResponse, cb);
  console.log(httpResponse.text);
  },
  error: function(httpResponse) {
      parseRespone(id.request_id, httpResponse, cb);
      console.error('Request failed with response code ' + httpResponse.status);
  }
});


    // var req = http.request(options, function (res) {
    //     if (debug) {
    //         console.log('status = ' + res.statusCode);
    //         console.log('res header = ');
    //         console.dir(res.headers);
    //     }

    //     var resBody = '';
    //     res.on('data', function (chunk) {
    //         resBody += chunk;
    //     });

    //     res.on('end', function () {
    //         if (debug) {
    //             console.log('res body: ' + resBody);
    //         }

    //         //var jsonObj = JSON.parse(resBody);
    //          try {
    //           var jsonObj = JSON.parse(resBody);
    //         } catch(e) {
    //           cb && cb(e);
    //           return;
    //         }
    //         var errObj = null;
    //         id.request_id = jsonObj['request_id'];
    //         if (res.statusCode != 200) {
                
    //             var error_code = 'Unknown';
    //             if (jsonObj['error_code'] !== undefined) {
    //                 error_code = jsonObj['error_code'];
    //             }

    //             var error_msg = 'Unknown';
    //             if (jsonObj['error_msg'] !== undefined) {
    //                 error_msg = jsonObj['error_msg'];
    //             }

    //             var request_id = 'Unknown';
    //             if (jsonObj['error_msg'] !== undefined) {
    //                 request_id = jsonObj['request_id'];
    //             }

    //             errObj = new Error('Push error code: ' + error_code +
    //                                 ', error msg: ' + error_msg +
    //                                 ', request id: ' + request_id);
    //         }

    //         cb(errObj, jsonObj);
    //     });
    // });

    // req.on('error', function (e) {
    //     if (debug) {
    //         console.log('error : ' + util.inspect(e));
    //     }
    //     cb(e, null);
    // });

    // req.write(bodyStr);
    // req.end();
}

/****
* added by tonglei
* httpResponese 
* callback function(err, result)
*/
function parseRespone(requestId, httpResponese, cb){
  if(httpResponse.status != 200){
                      var error_code = 'Unknown';
                if (jsonObj['error_code'] !== undefined) {
                    error_code = jsonObj['error_code'];
                }

                var error_msg = 'Unknown';
                if (jsonObj['error_msg'] !== undefined) {
                    error_msg = jsonObj['error_msg'];
                }

                var request_id = 'Unknown';
                if (jsonObj['error_msg'] !== undefined) {
                    request_id = jsonObj['request_id'];
                }

                errObj = new Error('Push error code: ' + error_code +
                                    ', error msg: ' + error_msg +
                                    ', request id: ' + request_id);
    }
    cb(errObj, jsonObj);
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

/*
 * @name Push
 * @constructor
 * @param {Object} options Set ak/sk/host
 * @param {String} [options.ak] User API key
 * @param {String} [options.sk] User secret key
 * @param {String} [options.host] TaskQueue server host
 */
function Push(options){

  console.log("tonglei create push instance");

  var self = this;
  var opt = {
    ak: process.env.BAE_ENV_AK,
    sk: process.env.BAE_ENV_SK,
    host: process.env.BAE_ENV_ADDR_CHANNEL || SERVER_HOST
  }

  if (options) {
    for (var i in options) {
      if (options.hasOwnProperty(i)) {
        if (typeof options[i] === 'string') {
          opt[i] = options[i];
        } else {
          throw new Error('Invalid ak, sk, or counter host')
        }
      }
    }
  }

  self.ak = opt.ak;
  self.sk = opt.sk;
  self.host = opt.host;
  self.request_id = null;

  console.log("tonglei create push instance end");
}




/*
 * Query user binding list
 * @param {Object} options
 * @param {String} options.user_id User id, the length of user_id must be less than 257B
 * @param {Number} [options.device_type] Device type
 * @param {Number} [options.start] Start postion, default value is 0
 * @param {Number} [options.limit] Numbers of lists, default value is 10
 * @param {function} cb(err, result)
 */
Push.prototype.queryBindList = function (options, cb) {
  var self = this;
  var opt = {};
  if (typeof options === 'function' && arguments.length === 1) {
    cb = options;
    options = {}
  }

  if (!options) {
  	options = {}
  }

  for (var i in options) {
    if (options.hasOwnProperty(i)) {
      opt[i] = options[i];
    }
  }

  checkOptions(opt, ['user_id']);

  var path = COMMON_PATH + (options['channel_id'] || 'channel');

  opt['method'] = 'query_bindlist';
  opt['apikey'] = self.ak;
  opt['timestamp'] = getTimestamp();

  opt = sortObj(opt);
  var wrap_id = {request_id: null};
  request(opt, path, self.sk, wrap_id, self.host, function (err, result) {
    self.request_id = wrap_id.request_id;
    if (err) {
      cb && cb(err);
      return;
    }
    cb && cb(null, result);
  });
}




/*
 * Push message
 * @param {Object} options
 * @param {Number} options.push_type Push type
 * @param {String} options.messages Message list
 * @param {String} options.msg_keys
 * @param {String} [options.user_id]
 * @param {String} [options.tag]
 * @param {Number} [options.channel_id]
 * @param {Number} [options.device_type] Device type
 * @param {Number} [options.message_type]
 * @param {Number} [options.message_expires]
 * @param {function} cb(err, result)
 */
Push.prototype.pushMsg = function (options, cb) {
  var self = this;
  var opt = {};
  if (typeof options === 'function' && arguments.length === 1) {
    cb = options;
    options = {}
  }

  if (!options) {
  	options = {}
  }

  for (var i in options) {
  	if (options.hasOwnProperty(i)) {
  		opt[i] = options[i];
  	}
  }

  var must = ['push_type', 'messages', 'msg_keys'];

  if (opt['push_type'] === 1) {
  	must.push('user_id');
  } else if (opt['push_type'] === 2) {
  	must.push('tag');
  } else {

  }

  checkOptions(opt, must);

  var path = COMMON_PATH + 'channel';

  opt['method'] = 'push_msg';
  opt['apikey'] = self.ak;
  opt['timestamp'] = getTimestamp();

  opt = sortObj(opt);
  var wrap_id = {request_id: null};
  request(opt, path, self.sk, wrap_id, self.host, function (err, result) {
    self.request_id = wrap_id.request_id;
    if (err) {
      cb && cb(err);
      return;
    }
    cb && cb(null, result);
  });
}