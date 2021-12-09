const AipSpeech = require("baidu-aip-sdk").speech;
const request = require('request');
const fs = require('fs');

module.exports = function (RED) {
	function baiduTTSNode(config) {
        RED.nodes.createNode(this, config);

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
		let baidu_platform = this.server.platform;
		node.on('input', function (msg) {
			var payload = {};
			var ttsData,ttsPath;
			if (config.data != '' && config.data != null ) {
				ttsData = config.data;
			} else {
				ttsData = msg.data;
			}
			if (config.path != '' && config.path != null ) {
				ttsPath = config.path;
			} else {
				ttsPath = 'tts.mp3'
			}
			switch(baidu_platform)
			{
				case "baidu-ai":
					var options = {spd: config.spd, pit: config.pit, vol: config.vol, per: config.per};
					client.text2audio(ttsData, options).then(function(result) {
						if (result.data) {
							fs.writeFileSync(ttsPath, result.data);
							node.status({ text: `百度智能语音，保存为 ${ttsPath}` });
							node.send({platform: 'baidu-ai' , result});
						} else {
							node.status({ text: '语音合成失败,请检查配置' });
							node.send({platform: 'baidu-ai' , result});
						}
					}, function(err) {
						node.warn(err);
					})
					break;
				case "baidu-fanyi":
					var ttsUrl = "https://fanyi.baidu.com/gettts";
					request({
						url : ttsUrl, 
						method: 'POST',
						headers : {
							'content-type' : "application/x-www-form-urlencoded"
							},
						form :{
							text : ttsData,
							spd : 5,
							lan : "zh",
							source : "web"
						}}, function (error ,response, body) {
							if (!error && response.statusCode == 200) {
								var buf = new Buffer(body);
								var buffer = {data : buf};
								node.status({ text: `百度翻译语音，保存为 ${ttsPath}` });
								node.send({platform: 'baidu-fanyi' , result: buffer});
							} else {
								node.status({ text: "语音合成失败,请检查配置" });
								node.send({platform: 'baidu-fanyi' , result: error});
							}
						}).pipe(fs.createWriteStream(ttsPath));
					break;
				default:
					node.status({ text: "其他接口,备用" });
			}
		});
		
	}
	RED.nodes.registerType("baidu-tts", baiduTTSNode);
	
	
	function RemoteServerNode(baidu) {
        RED.nodes.createNode(this, baidu);
        this.name = baidu.name;
		this.platform = baidu.platform;
		this.appID = baidu.appID;
        this.apiKey = baidu.apiKey;
        this.secretKey= baidu.secretKey;
	}
	RED.nodes.registerType("baidu-tts-server", RemoteServerNode);

}
