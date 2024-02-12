const db = wx.cloud.database();
const INDEX_DB = 'index';
const CATEGORY_STORE = 'category_image';
const INDEX_IMAGE_OPTIONS = require('../../../../common/constant');
const categoryItem = {
  label: '',
  fileID: ''
}
Page({

    /**
     * 页面的初始数据
     */
    data: {
      fileList: []
    },

    /**
     * 添加标签
     */
    addLabelItem: function () {
      const { fileList } = this.data;
        fileList.push(categoryItem)
        this.setData({
          fileList
        })
    },
    /**
     * 删除标签
     */
    deleteLabelItem: function (event) {
      const { index } = event.currentTarget.dataset;
      const { fileList } = this.data;

      wx.showLoading({
        title: '正在删除',
      })

      // 删除对应DB记录
      this.deleteToDB(index);

      wx.hideLoading();

      // 删除对应索引的标签
      fileList.splice(index, 1);
    
      this.setData({
        fileList: fileList,
      });
    },
    
    /**
     * 设置标签数据
     */
    setLabelData: function (event) {
        // 实时的输入值
        const value = event.detail;
        // 传入的labelList index
        const index = event.currentTarget.dataset.index;
        const { fileList } = this.data;
        fileList[index].label = value;
        this.setData({
          fileList: fileList
        })
        
    },

    //上传到云
    uploadToCloud() {
      const { fileList } = this.data;

      fileList.forEach(async (item, index) => {
        const url = item.fileID; // 假设图片数据中有一个 url 字段存储 fileID
    
        if (!item.needUpload) {
          return ;
        }

        wx.showLoading({
          title: '正在保存',
        })

        try {
          // 上传图片到云存储
          const uploadResult = await wx.cloud.uploadFile({
            cloudPath: `${CATEGORY_STORE}/${new Date().getTime()}.png`,
            filePath: url, // 这里的 url 应该是图片的本地路径或者临时路径
          });
    
          const fileID = uploadResult.fileID;
    
          // 更新 fileList 中对应索引的 url 为云存储中的 fileID
          fileList[index].fileID = fileID;
    
          // 可选：如果需要，你还可以将 fileID 存入数据库或执行其他操作
          this.updateToDB(index)

          wx.hideLoading();
    
          // 更新页面数据
          this.setData({
            fileList: fileList,
          });
    
          console.log(`分类标签 ${index + 1} 上传成功`, fileID);
        } catch (error) {
          console.error(`分类标签 ${index + 1} 上传失败`, error);
        }
      });
    },

    //删除对应DB记录
    async deleteToDB(index) {
      const { fileList } = this.data;
      try {
        const result = await db.collection(INDEX_DB)
        .where({
          _id: fileList[index]._id,
        })
        .remove();
        wx.showToast({ title: '更新成功', icon: 'none' });
      } catch (error) {
        console.error('更新数据库失败', error);
        wx.showToast({ title: '更新失败', icon: 'none' });
      }
    },
    //更新对应DB记录
    async updateToDB(index) {
      const { fileList } = this.data;
      const labelItem = fileList[index];

      // 不存在对应 id 的记录，执行新增操作
      if (!labelItem._id) {
        const addResult = await db.collection(INDEX_DB).add({
          data: {
            category: INDEX_IMAGE_OPTIONS.CATEGORY,
            item: {
              fileID: labelItem.fileID,
              label: labelItem.label
            }
          },
        });
        console.log(`分类标签 ${labelItem.index} 新增成功`, addResult);
        return ;
      }
      

      // 使用云开发的 where 方法查询是否存在该记录
      const queryResult = await db.collection(INDEX_DB).where({
        _id: labelItem._id,
      }).get();

      if (queryResult.data.length > 0) {
        // 存在对应 id 的记录，执行更新操作
        const updateResult = await db.collection(INDEX_DB).where({
          _id: labelItem._id,
        }).update({
          data: {
            item: {
              fileID: labelItem.fileID,
              label: labelItem.label
            }
          },
        });

        console.log(`id 为 ${labelItem._id} 的记录更新成功`, updateResult);
      } else {
        // 不存在对应 id 的记录，执行新增操作
      if (!labelItem._id) {
        const addResult = await db.collection(INDEX_DB).add({
            data: {
              category: INDEX_IMAGE_OPTIONS.CATEGORY,
              item: {
                fileID: labelItem.fileID,
                label: labelItem.label
              }
            },
          });
        }

        console.log(`分类标签 ${labelItem._id} 新增成功`, addResult);
      }
    },
    
    uploadImage: async function (event) {
      const { index } = event.currentTarget.dataset;
      const { fileList } = this.data;
      wx.showLoading({
        title: '正在上传',
      })
      try {
        const result = await wx.chooseMedia({
          count: 1,
          sizeType: ['original', 'compressed'],
          sourceType: ['album', 'camera'],
        });
  
        const { tempFilePath } = result.tempFiles[0];
        console.log("tempFilePath: ", tempFilePath);
        // 将上传的图片信息添加到 fileList 中
        fileList[index].fileID = tempFilePath;
        fileList[index].needUpload = true;
        // 更新数据
        this.setData({
          fileList: fileList
        });

        wx.hideLoading();
  
        console.log('上传成功', tempFilePath);
      } catch (error) {
        console.error('上传失败', error);
      }
    },

    /**
     * 
     * @param {*} options 
     */
    submit: async function () {
      const { fileList } = this.data;
      console.log("fileList: ", fileList);

      this.uploadToCloud()
    },

    getImagesFromDB: async function () {
      console.log("get index image: ", INDEX_IMAGE_OPTIONS.CATEGORY);
      try {
        const result = await db.collection(INDEX_DB)
          .where({
            category: INDEX_IMAGE_OPTIONS.CATEGORY
          })
          .get();
         console.log("result.data: ", result.data);
        // 获取查询结果的数据
        const fileList = result.data.map((imageItem) => ({
          fileID: imageItem.item.fileID,
          label: imageItem.item.label,
          _id: imageItem._id
        }));
        // 在这里可以处理获取到的图片信息，比如将数据存储到页面的数据变量中
        this.setData({
          fileList: fileList
        });
  
        console.log('从数据库获取图片信息成功', fileList);
      } catch (error) {
        console.error('从数据库获取图片信息失败', error);
      }
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function () {
      this.getImagesFromDB();
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})