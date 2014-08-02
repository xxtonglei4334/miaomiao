// Use AV.Cloud.define to define as many cloud functions as you want.
// For example:
AV.Cloud.define("hello", function(request, response) {
	response.success("Hello world!");
});


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

AV.Cloud.define("test", function(request, response) {
	var opt = {
		push_type: 1,
		user_id: '1100801892847586532',
		messages: JSON.stringify(["hello, push0", "hello, push1", "hello, push2"]),
		msg_keys: JSON.stringify(["key0", "key1", "key2"])
	}
	var name = require('cloud/helloworld.js');
	var bodyStr = name.isACoolName(opt);
	console.log(bodyStr);

	response.success("okokok");

	// AV.Cloud.httpRequest({
	//   method: 'POST',
	//   url: urlStr,
	//   header : {
	//   	'Content-Length': bodyStr.length,
	//   	// 'Content-Type': 'application/json'
	//   	'Content-Type':'application/x-www-form-urlencoded'
	//   },
	//   body: bodyStr,
	//   success: function(httpResponse) {
	//     console.log(httpResponse.text);
	//     			response.success(httpResponse.text);
	//   },
	//   error: function(httpResponse) {
	//     console.error('Request failed with response code ' + httpResponse.status);
	// 	response.success(httpResponse.text);
	//   }
	// });



	// var bodyStr = "q=fdfdf";

	// AV.Cloud.httpRequest({
	// 	method: 'POST',
	// 	url: "www.baidu.com",
	// 	headers: {
	// 		'Content-Length': bodyStr.length,
	// 		'Content-Type': 'application/x-www-form-urlencoded'
	// 	}
	// 	body: bodyStr,
	// 	success: function(httpResponse) {
	// 		var resBody = httpResponse.text;
	// 		// try {
	// 		// 	var jsonObj = JSON.parse(resBody);
	// 		// } catch (e) {
	// 		// 	cb && cb(e);
	// 		// 	return;
	// 		// }


	// 		response.success(httpResponse.text);

	// 		// var errObj = null;
	// 		// id.request_id = jsonObj['request_id'];
	// 		// parseRespone(id.request_id, httpResponse, cb);
	// 		// console.log(httpResponse.text);
	// 	},
	// 	error: function(httpResponse) {
	// 		response.error(httpResponse.status + "error");
	// 		// parseRespone(id.request_id, httpResponse, cb);
	// 		// console.error('Request failed with response code ' + httpResponse.status);
	// 	}
	// });


});

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

			var printHelloWorld = require('./helloworld.js');
			printHelloWorld();

			//配置push对象
			var opt = {
				ak: '0C3jS31DYteNDW1HAM3TGcKV',
				sk: '4mncUaMrC6L7h7Pqtf21XOx0azBGNcVa'
			};

			console.log(opt.ak);
			console.log(opt.sk);
			// var Push = require('/cloud/push.js');
			// var client = new Push(opt);

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