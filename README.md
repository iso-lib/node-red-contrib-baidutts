# 欢迎使用node-red-contrib-baidutts


## 节点功能为将输入的文字转为语音,并存储为mp3文件
#### 可直接在本节点TTS文本框内输入文字,如果留空则会使用上个节点传来的msg.data的内容

- 节点免费使用
- 百度智能语音合成引擎需自行注册百度AI平台账号,请登录[百度AI开放平台](https://ai.baidu.com/tech/speech)，免费创建语音应用获取参数,领取免费额度
 - 百度翻译API无需注册，可直接使用，但无法调节声音角色
 - 百度智能API需注册实名后领取免费额度,有更多可选角色
 - 领取的免费额度无到期时间，每次生成60个汉字以内算一次
 - 基础音库（黑字）：3并发，免费50000次
 - 精品音库（蓝字）：3并发，免费50000次
 - 臻品音库（品红）：3并发，免费10000次

#### [2025-11-06]更新
- 增加：增加大量音色可选
- 增加：支持多个百度账号免费资源，自行添加不同账号下的AppID，ApiKey，SecretKey即可
- 修改：去除baidu-aip-sdk，避免过时依赖包
- 修改：代码逻辑优化

#### [2022-2-21]更新
- 增加:增加合成音频编码格式选项,默认mp3,可选pcm,wav


#### [2021-12-9]更新
- 增加:百度翻译语音引擎,方便不想注册百度语音平台或者额度用完的用户
- 修改:UI优化,更清晰

#### 百度智能语音合成引擎需要3个参数
1. App ID
2. Api Key
3. Secret Key


#### 百度智能语音合成引擎额外参数选填
1. 发音角色
2. 语速
3. 语调
4. 音量




## 安装
npm install node-red-contrib-baidutts

## 使用

![配置](https://cdn.jsdelivr.net/gh/iso-lib/image@main/dede.4ncmuahuxv20.png)

![服务器配置](https://cdn.jsdelivr.net/gh/iso-lib/image@main/dede.19eojodbsfm.png)

![上个节点传入](https://cdn.jsdelivr.net/gh/iso-lib/image@main/dede.6z7n0jz340k0.png)


结束
****