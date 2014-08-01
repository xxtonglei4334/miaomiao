// Use AV.Cloud.define to define as many cloud functions as you want.
// For example:
AV.Cloud.define("hello", function(request, response) {
	response.success("Hello world!");
});

var Push = require('cloud/push');

//发送消息函数
AV.Cloud.define("sendMsg", function(request, response) {
	var query = new AV.Query(AV.User);
	query.equalTo("objectId", request.params.userId);
	query.get(request.params.userId, {
		success: function(user) {

			//配置push对象
			var opt = {
				ak: '0C3jS31DYteNDW1HAM3TGcKV',
				sk: '4mncUaMrC6L7h7Pqtf21XOx0azBGNcVa'
			};
			var client = new Push(opt);
			//推送参数
			var push_opt = {
				push_type: 0,
				user_id: user.get("bd_user_id"),
				messages: JSON.stringify(request.params.messages),
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

		},
		error: function(object, error) {
			console.log(error);
			response.error(error);
		}
	});
});