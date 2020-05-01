//临时用于错误日志收集发送
import axios from "axios";
//配置
const options = {
  timeout: 1000, //超时记录
  apiUrl: "", //记录服务端
  excludeUrl: ["extraController/dic/getbytype", "socket.io"] //需要排除的请求
};
let error = []; //异常的数据
let errorlos = (conf, status) => {
  //如果为过滤请求 跳出
  for (let key of options.excludeUrl) {
    if (conf.config.url.indexOf(key) > -1) {
      return;
    }
  }
  //如果stsus为4xx或5xx 3xx 记录日志 或 响应时间超过配置超时时间 或 为中传云正常请求
  let DTime = Date.parse(new Date()) - conf.config.requestStartDate;
  if (
    status == 0 ||
    status > 299 ||
    status < 100 ||
    DTime > options.timeout ||
    conf.config.url.indexOf("prod") > -1
  ) {
    error.push({
      url: conf.config.url,
      params: conf.config.data || JSON.stringify(conf.config.params),
      methods: conf.config.method,
      statusCode: status,
      timeOut: DTime,
      userInfo: localStorage.userinfo,
      source: "zcy"
    });
    throttle(sendLos, 3000)(); //10000
  }
};
function sendLos() {
  let count = error.length;
  axios({
    url: "/api-cms-message/SlowLog",
    method: "POST",
    headers: "",
    data: error,
    timeout: 30000
  })
    .then(res => {
      if (res.data.code != 200) return;
      error.splice(0, count);
    })
    .catch(err => {
      console.log(err);
    });
}
let timer = null;
function throttle(fn, wait) {
  return function() {
    let context = this;
    let args = arguments;
    if (!timer) {
      timer = setTimeout(function() {
        fn.apply(context, args);
        timer = null;
      }, wait);
    }
  };
}
export default errorlos;
