# 欢迎使用node-red-contrib-baidutts


## 节点功能为将输入的文字转为语音,并存储为mp3文件
#### 可直接在本节点TTS文本框内输入文字,如果留空则会使用上个节点传来的msg.data的内容

- 百度翻译语音合成引擎可直接使用,但无法调整发音角色语速语调音量
- 百度智能语音合成引擎,请登录[百度AI开放平台](https://ai.baidu.com/tech/speech)，免费创建语音应用获取参数,记得领取免费额度

#### [2023-5-12]更新

- 增加:保存路径改为可传入参数msg.path,使用上更灵活

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