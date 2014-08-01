// Use AV.Cloud.define to define as many cloud functions as you want.
// For example:
AV.Cloud.define("hello", function(request, response) {
	response.success("Hello world!");
});


AV.Cloud.define("test", function(request, response) {
	response.success("test ok");
});


function pushMessage(bdUserId, messages, response){
				//配置push对象
			var opt = {
				ak: '0C3jS31DYteNDW1HAM3TGcKV',
				sk: '4mncUaMrC6L7h7Pqtf21XOx0azBGNcVa'
			};

			var Push = require('cloud/push.js');
			var client = new Push(opt);
			//推送参数
			var push_opt = {
				push_type: 0,
				user_id: '1100801892847586532',
				messages: JSON.stringify(messages),
				msg_keys: JSON.stringify([new Date().getTime() + ""])
			}
			client.pushMsg(opt, function(err, result) {
				if (err) {
					console.log(err);
					response.error(error);
					return;
				}
				response.success(res);
				console.log(result);
			});
}

//发送消息函数
AV.Cloud.define("sendMsg", function(request, response) {
	var query = new AV.Query(AV.User);
	console.log(request.user.toString());
	pushMessage("9898", request.params.messages, respones);

	// query.get(request.params.userId, {
	// 	success: function(user) {
	// 		var bdUserId = user.get("bd_userId");
	// 		var messages = request.params.messages;

	// 		console.log(user.toString());
	// 		pushMessage(bdUserId, messages, respones);
	// 	},
	// 	error: function(object, error) {
	// 		console.log(error);
	// 		response.error(error);
	// 	}
	// });
});