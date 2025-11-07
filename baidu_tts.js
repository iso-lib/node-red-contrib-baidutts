const axios = require('axios');
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
		let baidu_platform = this.server.platform;
		
		/**
		 * 获取百度 Access Token
		 * 使用 Node-RED 全局变量存储 token
		 */
		async function getAccessToken() {
			// 为每个 API Key 创建唯一的缓存键
			const cacheKey = `baidu_access_token_${baidu_apiKey.substring(0, 8)}`;
			const expireKey = `baidu_token_expire_${baidu_apiKey.substring(0, 8)}`;
			
			// 从全局变量获取缓存的 token
			const cachedToken = node.context().global.get(cacheKey);
			const expireTime = node.context().global.get(expireKey) || 0;
			
			// 如果 token 还未过期,直接返回
			if (cachedToken && Date.now() < expireTime) {
				node.log(`使用缓存的 Access Token (剩余有效期: ${Math.floor((expireTime - Date.now()) / 1000 / 60)} 分钟)`);
				return cachedToken;
			}
			
			try {
				node.log('获取新的 Access Token...');
				const options = {
					method: 'POST',
					url: `https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=${baidu_apiKey}&client_secret=${baidu_secretKey}`
				};
				
				const response = await axios(options);
				
				const newToken = response.data.access_token;
				const expiresIn = response.data.expires_in; // 通常是 30 天 (2592000 秒)
				
				// 保存到全局变量,提前 5 分钟过期以确保安全
				node.context().global.set(cacheKey, newToken);
				node.context().global.set(expireKey, Date.now() + (expiresIn - 300) * 1000);
				
				node.log(`Access Token 已更新 (有效期: ${Math.floor(expiresIn / 60 / 60 / 24)} 天)`);
				
				return newToken;
			} catch (error) {
				node.warn(`获取 Access Token 失败: ${error.message}`);
				throw error;
			}
		}
		
		node.on('input', async function (msg) {
			const ttsData = (!config.data || config.data.trim().length === 0)
			    ? (msg.data || msg.text || '您没有配置语音内容,请检查配置!')
			    : config.data;

			const ttsPath = (!config.path || config.path.trim().length === 0)
			    ? (msg.path || msg.filename || 'tts.mp3')
			    : config.path;
			
			switch(baidu_platform) {
				case "baidu-ai":
					try {
						// 获取 access token
						const accessToken = await getAccessToken();
						
						// 准备请求参数
						const requestOptions = {
							method: 'POST',
							url: 'https://tsn.baidu.com/text2audio',
							headers: {
								'Content-Type': 'application/x-www-form-urlencoded',
								'Accept': '*/*'
							},
							data: new URLSearchParams({
								tex: ttsData,
								tok: accessToken,
								cuid: baidu_appID || 'node-red-baidutts',
								ctp: '1',
								lan: 'zh',
								spd: String(config.spd || 5),
								pit: String(config.pit || 5),
								vol: String(config.vol || 9),
								per: String(config.per || 1),
								aue: String(config.aue || 3)
							}).toString(),
							responseType: 'arraybuffer'
						};
						
						// 发送请求
						const response = await axios(requestOptions);
						
						// 检查返回的是否是音频数据(如果是错误,百度会返回 JSON)
						const contentType = response.headers['content-type'];
						
						if (contentType && contentType.includes('application/json')) {
							// 返回的是错误信息
							const errorInfo = JSON.parse(Buffer.from(response.data).toString());
							node.status({ text: `语音合成失败: ${errorInfo.err_msg || '未知错误'}` });
							node.send({
								platform: 'baidu-ai',
								error: errorInfo
							});
						} else {
							// 返回的是音频数据
							const audioBuffer = Buffer.from(response.data);
							
							// 异步写入文件
							fs.writeFile(ttsPath, audioBuffer, (err) => {
								if (err) {
									node.warn(`文件保存失败: ${err.message}`);
								}
							});
							
							// 立即发送数据
							node.status({ text: `百度智能语音,保存为 ${ttsPath}` });
							node.send({
								platform: 'baidu-ai',
								result: { data: audioBuffer }
							});
						}
						
					} catch (error) {
						node.warn(`百度智能语音合成失败: ${error.message}`);
						node.status({ text: '语音合成失败,请检查配置' });
						node.send({
							platform: 'baidu-ai',
							error: error.message
						});
					}
					break;
					
				case "baidu-fanyi":
					try {
						var ttsUrl = "https://fanyi.baidu.com/gettts";
						
						// 使用 axios 发送 POST 请求,直接获取 buffer
						const response = await axios({
							method: 'POST',
							url: ttsUrl,
							headers: {
								'content-type': 'application/x-www-form-urlencoded'
							},
							data: new URLSearchParams({
								text: ttsData,
								spd: '5',
								lan: 'zh',
								source: 'web'
							}).toString(),
							responseType: 'arraybuffer' // 直接接收为 buffer
						});
						
						// 将数据转换为 Buffer
						const audioBuffer = Buffer.from(response.data);
						
						// 异步写入文件(不阻塞发送)
						fs.writeFile(ttsPath, audioBuffer, (err) => {
							if (err) {
								node.warn(`文件保存失败: ${err.message}`);
							}
						});
						
						// 立即发送数据,不等待文件写入完成
						node.status({ text: `百度翻译语音,保存为 ${ttsPath}` });
						node.send({
							platform: 'baidu-fanyi', 
							result: {data: audioBuffer}
						});
						
					} catch (error) {
						node.warn(error);
						node.status({ text: "语音合成失败,请检查配置" });
						node.send({platform: 'baidu-fanyi', result: error.message});
					}
					break;
					
				default:
					node.send({ platform: "请在TTS服务配置里选择语音合成平台" });
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