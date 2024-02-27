// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    const res = await cloud.database().collection('house_img').get();
    
    const houseImgList = res.data.map(house => house.url);
  
    return {
      data: houseImgList,
      test:'test',
      errMsg: 'success',
    };
  } catch (err) {
    console.error(err);
    return {
      errMsg: 'failed to get house images: ' + err,
    };
  }
}