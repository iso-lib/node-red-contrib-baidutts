const AipSpeech = require("baidu-aip-sdk").speech;
const fs = require('fs');

module.exports = function (RED) {

	function baiduTTSNode(config) {
        RED.nodes.createNode(this, config);

        // Retrieve the config node
        this.server = RED.nodes.getNode(config.server);
        var node = this;
        if (this.server) {

        } else {
            node.error("没有配置正确的baidu-tts server");
            return
        }
		let baidu_appID = this.server.appID;
		let baidu_apiKey = this.server.apiKey;
		let baidu_secretKey = this.server.secretKey;
		let client = new AipSpeech(baidu_appID, baidu_apiKey, baidu_secretKey);

		node.on('input', function (msg) {
			var payload = {};
			//var data = msg.data;
			var data;
			if (config.data != '' && config.data != null ) {
				data = config.data;
			} else {
				data = msg.data;
			}
			if (config.path != '' && config.path != null ) {
				path = config.path;
			} else {
				path = 'tts.mp3'
			}
			var options = {spd: config.spd, pit: config.pit, vol: config.vol, per: config.per};
			// 语音合成，保存到本地文件
			client.text2audio(data, options).then(function(result) {
				if (result.data) {
					fs.writeFileSync(path, result.data);
					node.status({ text: `语音合成成功，保存为 ${path}` });
				} else {
				// 合成服务发生错误
				node.status({ text: '语音合成失败,请检查配置' });
				}
				node.send(result)
			}, function(err) {
				node.warn(err);
			})
		});
	 	
	}
	RED.nodes.registerType("baidu-tts", baiduTTSNode);
	
	
	function RemoteServerNode(baidu) {
        RED.nodes.createNode(this, baidu);
        this.name = baidu.name;
		this.appID = baidu.appID;
        this.apiKey = baidu.apiKey;
        this.secretKey= baidu.secretKey;
	}
	RED.nodes.registerType("baidu-tts-server", RemoteServerNode);

}
