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
		let baidu_apiKey = this.server.apiKey;
		let baidu_secretKey = this.server.secretKey;
		
		let client = new AipSpeech(16193101, baidu_apiKey, baidu_secretKey);

		//let voice = fs.readFileSync('../assets/16k_test.pcm');
		//let voice = fs.readFileSync("assets");
		//let voiceBase64 = new Buffer(voice);
		
		node.on('input', function (msg) {
			var payload = {};
			var data = msg.data;
			// 语音合成，保存到本地文件
			client.text2audio(data, {spd: 5, per: 0}).then(function(result) {
				if (result.data) {
					fs.writeFileSync('tts.mp3', result.data);
					node.log('语音合成成功，文件保存到tts.mp3，打开听听吧');
				} else {
					// 合成服务发生错误
				//	console.log('语音合成失败: ' + JSON.stringify(result));
				node.log('语音合成失败: ' + JSON.stringify(result));
				}
			}, function(err) {
				node.log(err);
			})
		});
		
	}
	RED.nodes.registerType("baidu-tts", baiduTTSNode);
	
	
	function RemoteServerNode(baidu) {
        RED.nodes.createNode(this, baidu);
        this.name = baidu.name;
        this.apiKey = baidu.apiKey;
        this.secretKey= baidu.secretKey;
	}
	RED.nodes.registerType("baidu-tts-server", RemoteServerNode);

}
