// 添加异常拦截日志统计
// 本文件用于初始化网络请求，无需更改
import axios from "axios";
import { apis } from "Utils/apis";
import errorlos from "Utils/error-log";
// 创建axios实例
const service = axios.create({
  baseURL: apis.baseURL, // api的base_url
  timeout: 60000, // 请求超时时间
  responseType: "json",
  headers: {}
});
// request拦截器
service.interceptors.request.use(
  config => {
    // config.headers = { "Access-Control-Allow-Origin": "*" };
    // config.headers["Authorization"] =
    //   "Bearer " + JSON.parse(sessionStorage.getItem("token"));
    // config.headers = { "Content-Type": "application/json;charset=UTF-8" };
    // config.headers = {
    //   "Content-Type": "application/x-www-form-urlencoded"
    // };
    //记录请求时间
    config.requestStartDate = Date.parse(new Date());
    return config;
  },
  error => {
    //记录并提供信息
    errorlos(error, error.status || 0);
    return Promise.reject(error);
  }
);

// respone拦截器
service.interceptors.response.use(
  response => {
    const result = response.data;
    // // 业务失败，需要跳转到404页面
    if (
      result.code &&
      result.code != "0" &&
      result.code != 0 &&
      response.status != "200" &&
      response.status != 200 &&
      result.state != "200" &&
      result.state != 200 &&
      result.statusCode != "200" &&
      result.statusCode != 200 &&
      result.code != "200" &&
      result.code != 200 &&
      result.status != "200" &&
      result.status != 200 &&
      result.code != "2000" &&
      result.code != 2000
    ) {
      $message.error(result.msg ? result.msg : result.message);
      return Promise.resolve(result);
    }
    errorlos(response, response.status || 0);
    return response;
  },
  error => {
    $message.error("网络连接失败");
    errorlos(error, error.status || error.response.status || 0);
    return Promise.reject(error);
  }
);
export default service;
