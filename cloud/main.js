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

var Push = require('/cloud/push.js');
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