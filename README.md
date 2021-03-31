
# 欢迎使用node-red-contrib-baidutts


## 节点功能为将输入的文字转为语音,并存储为mp3文件
#### 可直接在本节点TTS文本框内输入文字,如果留空则会使用上个节点传来的msg.data的内容

要使用本节点,请登录[百度AI开放平台](https://ai.baidu.com/tech/speech)，免费创建语音应用获取参数
#### 需要3个参数
1. App ID
2. Api Key
3. Secret Key


#### 额外参数选填
1. 发音角色
2. 语速
3. 语调
4. 音量
5. mp3保存路径



## 安装
npm install node-red-contrib-baidutts

## 使用

![配置](https://cdn.jsdelivr.net/gh/iso-lib/image@main/屏幕截图 2021-03-29 221845.6q963xoayhg0.png)

![服务器配置](https://cdn.jsdelivr.net/gh/iso-lib/image@main/屏幕截图 2021-03-29 221945.4qpqtshm1980.png)

![上个节点传入](https://cdn.jsdelivr.net/gh/iso-lib/image@main/dede.6z7n0jz340k0.png)


结束
****
    