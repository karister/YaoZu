// app.js
App({
  globalData: {
    // openid
    openid: '',
    // 用户头像地址
    avatarUrl: '',
    // 用户微信昵称
    nickName: '',
    test: 'test'
  },


  onLaunch: function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力');
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        // env: 'my-env-id',
        traceUser: true,
      });
    }

    const that = this;
    const db = wx.cloud.database();
    // 获取用户openid
    wx.cloud.callFunction({
      name: 'getOpenid',
      success: function (res) {
        console.log('openid: ' + res.result.openid);
        that.globalData.openid = res.result.openid;
      },
      complete: function () {
        // 读取用户表查询用户是否存在
        db.collection('user').where({
          _openid: that.globalData.openid
        })
        .get({
          success: function (res) {
            // 用户不存在
            if(res.data.length == 0) {
              // 写入用户
              db.collection('user').add({
                data: {
                  name: 'normal',
                  identity: 'user',
                  createTime: (new Date()),
                  updateTime: (new Date())
                },
                success: function(res) {
                  // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
                  console.log(res)
                }
              })
              // 新建浏览记录browse用户
              db.collection('browse').add({
                data: {
                  browse: []
                }
              })
            } else {
              // 用户存在则写入头像和名称至globalData
              console.log('user has exist')
              that.globalData.avatarUrl = res.data[0].avatarUrl;
              that.globalData.nickName = res.data[0].nickName;
            }
          }
        })
      }
    })
    // this.globalData = {};
  }
});
