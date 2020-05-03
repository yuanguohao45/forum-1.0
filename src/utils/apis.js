/**
 *  基准站
 */
let baseURL = process.env.baseURL + ":" + process.env.serverPort;

/**
 *  生产基站
 */
/**
 *  测试基站
 */

/**
 *  模块基站
 */

let apis = {
  /**
   *  抽奖模块
   */
  luckDraw: {
    luckStart: ""
  },
  /**
   *  短信发送模块api
   */
  sms: {
    postSms: "", // 群发
    postSmsSingle: "" // 单发
  },
  /**
   *  预约审核模块api
   */
  preReview: {
    getTableData: "", // 获取预约列表数据
    pass: "" // 审核通过
  }
};
export { apis };
