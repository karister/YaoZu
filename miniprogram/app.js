// app.js

App({
  globalData: {
    //role
    role: '',
    // openid
    openid: '',
    // 微信绑定手机号
    phoneNumber: '',
  },


  onLaunch: function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力');
    } else {
      wx.cloud.init({
        env: 'cloud1-9gfitrmvaedbeba4',
        traceUser: true,
      });
    }

    const that = this;
    const db = wx.cloud.database();

    // 获取用户openid
    wx.cloud.callFunction({
      name: 'getOpenId',
      success: function (res) {
        console.log('app get openid: ' + res.result.openid);
        that.globalData.openid = res.result.openid;
      },
      fail: console.error,
      complete: function () { 
        // 读取用户表查询用户是否存在
        db.collection('user').where({
          _openid: that.globalData.openid
        })
        .get({
          success: function (res) {
            console.log('get user successful: ', res)
            // 用户不存在
            if(res.data.length == 0) {
              // 写入用户
              db.collection('user').add({
                data: {
                  role: 'user',
                  phoneNumber: '',
                  createTime: (new Date()),
                  updateTime: (new Date())
                },
                success: function(res) {
                  console.log('create user successful: ', res._id)
                }
              })
            } else {
              const userInfo = res.data[0];
              console.log('user exist: ', userInfo)
              // 读取用户信息存储到globaldata
              that.globalData.role = userInfo.role;
              that.globalData.phoneNumber = userInfo.phoneNumber;
            }
          }
        })
      }
    })
  }
  
});
