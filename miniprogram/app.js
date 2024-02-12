// app.js

App({
  globalData: {
    // openid
    openid: '',
    // 用户头像地址
    avatarUrl: '',
    // 用户微信昵称
    nickName: '',
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
        console.log('openid: ' + res.result.openid);
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
                  console.log(res)
                }
              })
            } else {
              console.log('user has exist')
            }
          }
        })
      }
    })
    // this.globalData = {};
    // db.collection('index').where({
    //   filed: 'areaInfo'
    // }).get().then( res => {
    //   that.globalData.checked = res.data[0].checked;
    //   let areaInfo = res.data[0].area;
    //   let areaList = [];
    //   areaInfo.forEach(area => {
    //     areaList.push(area.name);
    //   });
    //   that.globalData.areaList = areaList;
    //   // console.log(areaList)
    // })

  }
  
});
