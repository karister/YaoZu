// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境


const db = cloud.database();
const collectionName = 'index';
// 云函数入口函数
exports.main = async (event, context) => {
  const { categories } = event;
  try {
    // 使用 where 条件进行查询，categories 包含在 swiper 或 category 中
    const result = await db.collection(collectionName)
      .where({
        category: db.command.in(categories),
      })
      .get();
    return {
      success: true,
      data: result.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error,
    };
  }
}