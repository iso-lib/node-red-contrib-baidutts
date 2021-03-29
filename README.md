
# 欢迎使用node-red-contrib-baidu-tts




## 本程序是node-red的节点模块,基于百度开放API进行开发调试

## 节点功能为将输入的文字转为语音,并存储为mp3文件
#### 可直接在本节点TTS文本框内输入文字,如果留空则会使用上个节点传来的msg.data的内容

要使用本节点,请登录[百度AI开放平台](https://ai.baidu.com/tech/speech)，创建语音应用获取参数
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
npm i node-red-contrib-baidu-tts

## 使用

![配置](https://ae01.alicdn.com/kf/Ud1dce69cda1f4de0a9436eae5f61a525u.jpg)

![服务器配置](https://ae01.alicdn.com/kf/U4811bedf8ec14f5eaffcde34765454e9R.jpg)

![上个节点传入](https://ae01.alicdn.com/kf/U134be02b57b54e2d8602ee175b94abbdQ.jpg)


结束
****
    