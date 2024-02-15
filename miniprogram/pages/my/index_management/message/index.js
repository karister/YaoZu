import Notify from '/@vant/weapp/notify/notify';

const db = wx.cloud.database();
const INDEX_DB = 'index';
const INDEX_IMAGE_OPTIONS = require('../../../../common/constant');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        messageList: []
    },

    saveMessageToDB(content) {
      // 显示加载样式
      wx.showLoading({
        title: '保存中...',
        mask: true,
      });

      // 保存记录到 index 集合，设置 category 为 'message'，content 为传入的参数
      db.collection(INDEX_DB).add({
        data: {
          category: INDEX_IMAGE_OPTIONS.MESSAGE,
          item: {
            content: content,
          },
          // 其他字段的值，根据你的需求设置
        },
      })
      .then(res => {
        console.log('保存成功，记录 ID：', res._id);
    
        // 处理保存成功的逻辑
        wx.showToast({
          title: '保存成功',
          icon: 'success',
          duration: 2000,
        });
      })
      .catch(error => {
        console.error('保存失败：', error);
    
        // 处理保存失败的逻辑
        wx.showToast({
          title: '保存失败，请重试',
          icon: 'none',
          duration: 2000,
        });
      })
      .finally(() => {
        // 隐藏加载样式
        wx.hideLoading();
      })
    },
    

    /**
     * 添加一条消息
     */
    async addMessage() {
        const { messageList, input } = this.data;
        if (messageList.length == 10) {
            Notify({
                message: '通知消息已达10条上限！',
                color: '#ad0000',
                background: '#ffe1e1',
                duration: 1000,
              });
            return ;
        }

        messageList.push({
          content: input
        });

        console.log("messageList: ", messageList);
        this.saveMessageToDB(input)

        this.setData({
          messageList: messageList,
          input: ''
        })
    },

    /**
     * 删除一条消息
     * @param {*index} options 
     */
    async delMessage(event) {
      const { messageList } = this.data;
      const index = event.currentTarget.dataset.index;

      // console.log('index: ', index);
      console.log('messageList: ', messageList);
      // messageList.splice(index, 1);

      this.setData({
        messageList: messageList
      })

      try {
         //显示加载样式
        wx.showLoading({
          title: '保存中...',
          mask: true,
        });

        const result = await db.collection(INDEX_DB)
        .where({
          _id: messageList[index]._id,
        })
        .remove();
        console.log('delete result: ', result);

        this.setData({
          messageList: messageList
        })

        wx.showToast({
          title: '保存成功',
          icon: 'success',
          duration: 1000
        })
      } catch (error) {
        wx.showToast({
          title: '保存失败',
          icon: 'error',
          duration: 1000
        })
      } finally {
        // 隐藏加载样式
        wx.hideLoading();
      }
    },

    getMessage: async function () {
      console.log("get message: ", INDEX_IMAGE_OPTIONS.MESSAGE);
      try {
        const result = await db.collection(INDEX_DB)
        .where({
          category: INDEX_IMAGE_OPTIONS.MESSAGE
        })
        .get();
        console.log("result.data: ", result.data);
        // 获取查询结果的数据
        const messageList = result.data.map(message => ({
          content: message.item.content,
          _id: message._id
        }));
        // 在这里可以处理获取到的通知信息，比如将数据存储到页面的数据变量中
        this.setData({
          messageList: messageList
        });
  
        console.log('从数据库获取通知信息成功', messageList);
      } catch (error) {
        console.error('从数据库获取通知信息失败', error);
      }
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
      this.getMessage();
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    }
})