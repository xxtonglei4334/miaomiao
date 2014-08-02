// Use AV.Cloud.define to define as many cloud functions as you want.
// For example:
AV.Cloud.define("hello", function(request, response) {
	response.success("Hello world!");
});


AV.Cloud.define("test", function(request, response) {

// var name = require('cloud/name.js');

// name.isACoolName('Fred', response);
// name.isACoolName('Skippy'), response); // 返回false
	// response.success("test ok");



AV.Cloud.httpRequest({
  url: 'http://www.example.com/',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json'
  },
  success: function(httpResponse) {
    console.log(httpResponse.text);
  },
  error: function(httpResponse) {
    console.error('Request failed with response code ' + httpResponse.status);
  }
});


// AV.Cloud.httpRequest({
//   method: 'POST',
//   url: 'http://www.baidu.com/',
//   body: {
//     title: 'Vote for Pedro',
//     body: 'If you vote for Pedro, your wildest dreams will come true'
//   },
//   success: function(httpResponse) {
//     console.log(httpResponse.text);
//     			response.success(httpResponse.text);
//   },
//   error: function(httpResponse) {
//     console.error('Request failed with response code ' + httpResponse.status);
// 	response.error(httpResponse.status + "error");
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