const db = wx.cloud.database();
const app = getApp();  
/**
 * 数据库读取的同步执行方法!!!!!!!!!!
 */

/**
 * 获取当前用户身份
 */
export var getUserIdentity = async function() {
  const res = await db.collection('user').where({
    _openid: app.globalData.openid
  }).get();
  return res.data[0].identity;
};

/**
 * 根据当前用户openid查询单条信息
 * @param dbName: 查询的数据库 
 * @returns 读取的单条数据
 */
export async function getSingleDataByOpenid (dbName) {
  const res = await db.collection(dbName).where({
    _openid: app.globalData.openid
  })
  .get()
  return res.data[0];
};

/**
 * 查询dnName数据库中是否有对应openid的数据
 * @param dbName: 查询的数据库 
 * @param openid: 查询的_openid
 * @returns 读取的单条数据 
 */
export async function checkNewData(dbName,openid) {
  const res = await db.collection(dbName).where({
    _openid: openid
  })
  .get()
  console.log(res)
  if(res.data.length == 0) {
    return true;
  } else {
    return false;
  }
}
