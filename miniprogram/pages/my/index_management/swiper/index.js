// pages/my/index_management/swiper/index.js
const app = getApp();
const db = wx.cloud.database();
const collectionName = 'index';
const INDEX_IMAGE_OPTIONS = require('../../../../common/constant');
// 在需要插入图片信息的地方
const imageItem = {
  item: 'object',  // item对象
  category: INDEX_IMAGE_OPTIONS.SWIPER,  // 图片所属的分类
};
Page({
    /**
     * 组件的属性列表
     */
    properties: {

    },

    /**
     * 组件的初始数据
     */
    data: {
      fileList: [],
      originFileList: [],
    },

    /**
     * 生命周期函数--监听页面加载
    */
    onLoad: function (options) {
      this.getImagesFromDB();
    },

    // 提交图片
    submit() {
      const { fileList,originFileList } = this.data;

      //空白上传
      if (!fileList.length) {
        wx.showToast({ title: '请选择图片', icon: 'none' });
      }

      const newUrls = fileList
      .filter(item => !originFileList.some(originItem => originItem._id === item._id));
      const deletedUrls = originFileList
      .filter(originItem => !fileList.some(item => item._id === originItem._id));

      console.log("fileList: ", fileList);
      console.log("originFileList: ", originFileList);
      console.log("newUrls: ", newUrls);
      console.log("deletedUrls: ", deletedUrls);

      if (newUrls.length) {
        this.uploadToCloud(newUrls);
      }

      if (deletedUrls.length) {
        this.deleteToDB(deletedUrls);
      }
    },

    //上传到云
    uploadToCloud(updatedImages) {
      const uploadTasks = updatedImages.map(file => this.uploadFilePromise(`my-photo/${new Date().getTime()}.png`, file));

      wx.showLoading({
        title: '正在保存',
      })

      Promise.all(uploadTasks)
        .then(data => {
          wx.showToast({ title: '上传成功', icon: 'none' });
          const newFileList = data.map(item => item.fileID);
          
          wx.hideLoading();

          this.addToDB(newFileList)
        })
        .catch(e => {
          wx.showToast({ title: '上传失败', icon: 'none' });
          console.log(e);
        });
    },
    // 上传图片
    uploadImage(event) {
      const { file } = event.detail;
      const { fileList } = this.data;
      file.forEach( element => {
        fileList.push({
          url: element.url
        })
      });
      this.setData({ fileList });
    },
    // 删除图片
    deleteImage(event) {
      const { index } = event.detail;
      const { fileList } = this.data;

      // 根据索引删除对应的图片
      fileList.splice(index, 1);
      this.setData({ fileList });
    },
    //删除对应DB记录
    deleteToDB(deletedImages) {
      deletedImages.forEach(async (item) => {
        try {
          const result = await db.collection(collectionName)
          .where({
            _id: item._id,
          })
          .remove();
          wx.showToast({ title: '更新成功', icon: 'none' });
        } catch (error) {
          console.error('更新数据库失败', error);
          wx.showToast({ title: '更新失败', icon: 'none' });
        }
      });
    },
    //更新对应DB记录
    addToDB(fileIdList) {
      fileIdList.forEach(async (url) => {
        try {
          imageItem.item = {fileID: url};
          // 使用 where 条件选择需要更新的记录
          const result = await db.collection(collectionName)
          .add({
            data: imageItem,
          });
          wx.showToast({ title: '更新成功', icon: 'none' });
        } catch (error) {
          console.error('更新数据库失败', error);
          wx.showToast({ title: '更新失败', icon: 'none' });
        }
      });
    },

    uploadFilePromise(fileName, chooseResult) {
      return wx.cloud.uploadFile({
        cloudPath: fileName,
        filePath: chooseResult.url
      });
    },

    getImagesFromDB: async function () {
      console.log("get index image: ", INDEX_IMAGE_OPTIONS.SWIPER);
      try {
        const result = await db.collection(collectionName)
          .where({
            category: INDEX_IMAGE_OPTIONS.SWIPER
          })
          .get();
         console.log("result.data: ", result.data);
        // 获取查询结果的数据
        const fileList = result.data.map((imageItem) => ({
          url: imageItem.item.fileID,
          _id: imageItem._id
        }));
  
        // 在这里可以处理获取到的图片信息，比如将数据存储到页面的数据变量中
        this.setData({
          fileList: fileList,
          originFileList: fileList.slice()
        });
  
        console.log('从数据库获取图片信息成功', fileList);
      } catch (error) {
        console.error('从数据库获取图片信息失败', error);
      }
    },
})