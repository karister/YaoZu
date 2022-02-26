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
export async function getSingleDataByOpenid (dbName, openid) {
  let realOpenid;
  if(openid == undefined) {
    realOpenid = app.globalData.openid;
  } else{
    realOpenid = openid;
  }
  const res = await db.collection(dbName).where({
    _openid: realOpenid
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

/**
 * 检查用户是否授权
 */
export function checkAuthed () {
  // 已授权
  if((app.globalData.avatarUrl != '') && (app.globalData.phoneNumber != '')) {
    // console.log(app.globalData.avatarUrl);
    // console.log(app.globalData.phoneNumber);
    // console.log('已授权')
    return true;
  } else {
    // console.log('未授权')
    return false;
  }
}

/**
 * 根据区域商家数据查询条件
 * arg=null 普查 arg!=null 模糊查
 */
const areas = ['中心市场','博览中心','家私城','光明家具城','其他区域'];
let checked = '';
export function getQueryParam(index,arg) {
  let param = '';
  if(arg != null) {
    param = {
      brand: {
        // 模糊查询 '.*'相当于mysql的like
        $regex: '.*' + arg + '.*',
        // 不区分大小写
        $options: 'i'
      },
      viewState: 1
    }
  } else {
    param = {
      area: areas[index],
      viewState: 1
    }
  }
  if(!app.globalData.checked) {
    param.notTest = 1;
  }
  console.log(param)
  return param;
}

/**
 * 获取随机商家图片数据
 * value：false 真假数据  true 真数据
 */
export function getRandomData(value) {
  let param = {
    viewState: 1
  };
  if(value) {
    param.notTest = 1;
  }
  return param;
}