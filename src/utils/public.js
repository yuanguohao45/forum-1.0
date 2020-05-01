import request from "@/utils/request";
import constant from "@/utils/constant";
import moment from "moment";
import { apis } from "@/utils/apis";
import { cmx, library } from "@/utils/cosmix";
import { Base64 } from "js-base64";
import qs from "qs";

function checkPermission(PERMISSION, elementSign) {
  if (PERMISSION && PERMISSION.element)
    return PERMISSION.element.some(v => {
      return v.elementid == elementSign;
    });
  else {
    console.error("调用了checkPermission确没有赋值PERMISSION");
    return false;
  }
}
// 标题验证不能有%
function validTitle(rule, value, callback) {
  const reg = /^\%+$/;
  if (!value) {
    callback(new Error("请输入标题"));
  } else if (!reg.test(value)) {
    callback(new Error("请勿输入%等字符"));
  } else {
    callback();
  }
}
// 1~1000之间的正整数
function validAdd(rule, value, callback) {
  const reg = /^(?!0)(?:[0-9]{1,3}|1000)$/;
  if (!value) {
    callback(new Error("请输入数值"));
  } else if (!reg.test(value)) {
    callback(new Error("请输入1~1000之间的整数"));
  } else {
    callback();
  }
}
// 非负整数
function validNegInt(rule, value, callback) {
  const reg = /^(\-[1-9]\d\d|\-1000)$/i;
  if (!value) {
    callback(new Error("请输入数值"));
  } else if (!reg.test(value)) {
    callback(new Error("请输入非负整数"));
  } else {
    callback();
  }
}
// 非正整数
function validNptInt(rule, value, callback) {
  const reg = /^((-\d+)|(0+))$/i;
  if (!value) {
    callback(new Error("请输入数值"));
  } else if (!reg.test(value)) {
    callback(new Error("请输入非正整数"));
  } else {
    callback();
  }
}
// 非0正整数
function validNtzInt(rule, value, callback) {
  const reg = /^\+?[1-9][0-9]*$/i;
  if (!value) {
    callback(new Error("请输入数值"));
  } else if (!reg.test(value)) {
    callback(new Error("请输入非0正整数"));
  } else {
    callback();
  }
}
// -1000~0之间的数字
function validReduce(rule, value, callback) {
  const reg = /^(\-1000|\-[1-9]\d{0,2}|0)$/;
  if (!value) {
    callback(new Error("请输入分值"));
  } else if (!reg.test(value)) {
    callback(new Error("请输入-1000~0之间的数字"));
  } else {
    callback();
  }
}
// 银行账号校验
function validBankAccount(rule, value, callback) {
  const reg = /^([1-9]{1})(\d{14}|\d{18})$/;
  if (!value) {
    callback(new Error("请输入银行开户账号"));
  } else if (!reg.test(value)) {
    callback(new Error("请输入正确的银行账号格式"));
  } else {
    callback();
  }
}
// 手机号校验
function validPhone(rule, value, callback) {
  const reg = /^1[3|4|5|7|8|9]\d{9}$/i;
  if (!value) {
    callback(new Error("请输入手机号码"));
  } else if (!reg.test(value)) {
    callback(new Error("请输入正确的11位手机号码格式"));
  } else {
    callback();
  }
}
// 手机号校验
function nonEssentialValidPhone(rule, value, callback) {
  const reg = /^1[3|4|5|7|8|9]\d{9}$/i;
  if (value && !reg.test(value)) {
    callback(new Error("请输入正确的11位手机号码格式"));
  } else {
    callback();
  }
}
// 固话校验
function validCall(rule, value, callback) {
  const reg = /^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/i;
  if (!value) {
    callback(new Error("请输入电话号码"));
  } else if (!reg.test(value)) {
    callback(new Error("请输入正确的电话号码格式"));
  } else {
    callback();
  }
}

// 税号校验
function validTax(rule, value, callback) {
  const reg = /^[A-Z0-9]{15}$|^[A-Z0-9]{17}$|^[A-Z0-9]{18}$|^[A-Z0-9]{20}$/i;
  if (!value) {
    callback(new Error("请输入税号"));
  } else if (!reg.test(value)) {
    callback(new Error("请输入正确的税号格式"));
  } else {
    callback();
  }
}
//  验证企业地址（中文、英文、数字）
function validAddress(rule, value, callback) {
  const reg = /^[\u4e00-\u9fa5a-zA-Z0-9]+$/;
  if (!value) {
    callback(new Error("请输入地址"));
  } else if (!reg.test(value)) {
    callback(new Error("请输入正确的地址格式"));
  } else {
    callback();
  }
}
// 邮箱表单验证
function validEmail(rule, value, callback) {
  const reg = /(^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$)|(^[a-z\d]+(\.[a-z\d]+)*@([\da-z](-[\da-z])?)+(\.{1,2}[a-z]+)+$)/;
  if (!value) {
    callback(new Error("请输入邮箱"));
  } else if (!reg.test(value)) {
    callback(new Error("请输入正确的邮箱格式"));
  } else {
    callback();
  }
}
// 邮箱表单验证 非必填
function nonEssentialValidEmail(rule, value, callback) {
  const reg = /(^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$)|(^[a-z\d]+(\.[a-z\d]+)*@([\da-z](-[\da-z])?)+(\.{1,2}[a-z]+)+$)/;
  if (value && !reg.test(value)) {
    callback(new Error("请输入正确的邮箱格式"));
  } else {
    callback();
  }
}
// 身份证正则验证
function validCode(rule, value, callback) {
  const reg = /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$)/; // 18位
  if (!value) {
    callback(new Error("请输入身份证件号码"));
  } else if (!reg.test(value)) {
    callback(new Error("请输入正确的身份证号码"));
  } else {
    callback();
  }
}
// 身份证，护照 正则验证
function validIdCode(rule, value, callback) {
  const reg = /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$)|((^1[45][0-9]{7}$)|(^[P|p|S|s]\d{7}$)|(^[S|s|G|g|E|e]\d{8}$)|(^[Gg|Tt|Ss|Ll|Qq|Dd|Aa|Ff]\d{8}$)|(^[H|h|M|m]\d{8,10}$))/; // 18位
  if (!value) {
    callback(new Error("请输入身份证，护照等证件"));
  } else if (!reg.test(value)) {
    callback(new Error("请输入正确的身份证，护照格式"));
  } else {
    callback();
  }
}

function validPassWord(rule, value, callback) {
  // const reg = /^(?![A-Z]+$)(?![a-z]+$)(?!\d+$)\w{8,20}$/;
  const reg = /((^(?=.*[a-z])(?=.*[A-Z])(?=.*\W)[\da-zA-Z\W]{8,16}$)|(^(?=.*\d)(?=.*[A-Z])(?=.*\W)[\da-zA-Z\W]{8,16}$)|(^(?=.*\d)(?=.*[a-z])(?=.*\W)[\da-zA-Z\W]{8,16}$)|(^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[\da-zA-Z\W]{8,16}$))/;
  if (!value) {
    callback(new Error("请输入密码"));
  } else if (!reg.test(value)) {
    callback(
      new Error("8-20位字符，至少包括大写、小写、数字、特殊字符中的三种")
    );
  } else {
    callback();
  }
}

function checkUrl(rule, url, callback) {
  const reg = /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/;
  if (!url) {
    callback(new Error("请输入网址"));
  } else if (!reg.test(url)) {
    callback(new Error("小可爱，网址不正确哦"));
  } else {
    callback();
  }
}

// 稿件内容版本比对
function compareContent(contentObjects) {
  console.log(contentObjects);

  if (contentObjects.length <= 0) return [];
  var firstContent = contentObjects[0].content;
  var firstUser = contentObjects[0].user;
  var contentBaseArray = [];
  var param = 10;
  for (var i = 0; i < firstContent.length; i++) {
    contentBaseArray.push({
      t: firstContent[i],
      d: "",
      a: firstUser
    });
  }
  if (contentObjects.length == 1)
    return {
      result: contentBaseArray,
      firstUser: firstUser
    };
  for (var i = 1; i < contentObjects.length; i++) {
    var nowContent = contentObjects[i].content;
    var nowUser = contentObjects[i].user;
    var compareWord = 0,
      orginalWord = 0,
      compareComplete = false;
    for (; orginalWord < contentBaseArray.length; orginalWord++) {
      if (contentBaseArray[orginalWord].d != "") continue;
      console.log(
        contentBaseArray[orginalWord].t +
          "  " +
          nowContent[compareWord] +
          "/" +
          orginalWord +
          " " +
          compareWord
      );
      if (contentBaseArray[orginalWord].t == nowContent[compareWord]) {
        compareWord++;
        if (compareWord < nowContent.length) continue;
        else {
          compareComplete = true;
          break;
        }
      } else {
        //处理不匹配情况
        var findNextExistWordIndex = compareWord + 1;
        var count = 0;
        for (
          var _compareWord = findNextExistWordIndex;
          _compareWord < nowContent.length;
          _compareWord++
        ) {
          if (count > param) {
            findNextExistWordIndex = -1;
            break;
          }
          count++;
          if (contentBaseArray[orginalWord].t == nowContent[_compareWord]) {
            findNextExistWordIndex = _compareWord;
            break;
          }
          if (_compareWord == nowContent.length - 1) {
            findNextExistWordIndex = -1;
          }
        }
        if (findNextExistWordIndex == -1) {
          //该字未再出现，说明被删除了
          contentBaseArray[orginalWord].d = nowUser;
          continue;
        }
        //在后面找到了该字
        var findNearExistWordIndex;
        var turn = 1;
        while (true) {
          if (orginalWord + turn > contentBaseArray.length - 1) {
            findNearExistWordIndex = -1;
            break;
          }
          findNearExistWordIndex = compareWord + 1;
          var count = 0;
          for (
            var _compareWord = findNearExistWordIndex;
            _compareWord < nowContent.length;
            _compareWord++
          ) {
            if (count > param) {
              findNearExistWordIndex = -1;
              break;
            }
            count++;
            if (
              contentBaseArray[orginalWord + turn].t == nowContent[_compareWord]
            ) {
              findNearExistWordIndex = _compareWord;
              break;
            }
            if (_compareWord == nowContent.length - 1) {
              findNearExistWordIndex = -1;
            }
          }
          if (findNearExistWordIndex != -1) {
            break;
          }
          turn++;
        }
        console.log(
          findNextExistWordIndex + "  " + findNearExistWordIndex + " " + turn
        );
        if (findNearExistWordIndex != -1) {
          if (findNearExistWordIndex > findNextExistWordIndex) {
            //turn的值说明原文删字
            for (var deleteWord = 0; deleteWord < turn - 1; deleteWord++) {
              contentBaseArray[orginalWord + deleteWord + 1].d = nowUser;
            }
            //findNearExistWordIndex-findNextExistWordIndex的值说明对比文加字
            for (
              var addWord = 0;
              addWord < findNearExistWordIndex - compareWord - 1;
              addWord++
            ) {
              contentBaseArray.splice(orginalWord, 0, {
                t: nowContent[compareWord + addWord],
                a: nowUser,
                d: ""
              });
              orginalWord++;
            }
            compareWord = findNearExistWordIndex + 1; //
            if (compareWord >= nowContent.length) {
              //对比文到结尾
              break;
            }
            orginalWord = orginalWord + turn; //
            if (orginalWord >= contentBaseArray.length) {
              //原文到结尾
              break;
            }
          } else {
            contentBaseArray[orginalWord].d = nowUser;
            continue;
          }
        } else {
          for (
            var deleteWord = orginalWord + 1;
            deleteWord < contentBaseArray;
            deleteWord++
          ) {
            contentBaseArray[deleteWord].d = nowUser;
          }
          for (
            var addWord = compareWord + findNextExistWordIndex + 1;
            addWord < nowContent.length;
            addWord++
          ) {
            contentBaseArray.push({
              t: nowContent[addWord],
              a: nowUser,
              d: ""
            });
          }
          break;
        }
      }
    }
    if (compareComplete) {
    }
    for (
      var deleteWord = orginalWord + 1;
      deleteWord < contentBaseArray.length;
      deleteWord++
    ) {
      contentBaseArray[deleteWord].d = nowUser;
    }
    for (var addWord = compareWord; addWord < nowContent.length; addWord++) {
      contentBaseArray.push({
        t: nowContent[addWord],
        a: nowUser,
        d: ""
      });
    }
  }
  return {
    result: contentBaseArray,
    firstUser: firstUser
  };
}

function outputHtml(data) {
  if (!data.result) return "";
  var firstUser = data.firstUser;
  var color = [
    "#99CC33",
    "#669999",
    "#336699",
    "#990033",
    "#999933",
    "#CC9966",
    "#339966",
    "#9966CC",
    "#CC3333"
  ]; //只支持10种颜色，需要增加，数组直接加即可
  var html = "";
  var distributionColor = {};
  distributionColor[firstUser] = "#222222";
  var turn = 0;
  data.result.forEach(function(item) {
    if (item.d != "") {
      if (!distributionColor[item.d]) distributionColor[item.d] = color[turn++];
      html +=
        '<span title="最初' +
        item.a +
        "编写的，" +
        item.d +
        '删除的" style="color:' +
        distributionColor[item.d] +
        ';" class="delword user-d-' +
        item.d +
        " user-a-" +
        item.a +
        '">' +
        item.t +
        "</span>";
    } else if (item.a != "") {
      if (!distributionColor[item.a]) distributionColor[item.a] = color[turn++];
      html +=
        '<span title="' +
        item.a +
        '编写的" style="color:' +
        distributionColor[item.a] +
        ";" +
        (item.a == firstUser ? "" : "font-weight: bold;") +
        '" class="addword user-a-' +
        item.a +
        '">' +
        item.t +
        "</span>";
    } else html += item.t;
  });
  console.log(html);
  return html;
}

// 时间获取

// 今天
function GetDateStr(AddDayCount) {
  let dd = new Date();
  dd.setDate(dd.getDate() + AddDayCount); //获取AddDayCount天后的日期
  let y = dd.getFullYear();
  let m =
    dd.getMonth() + 1 < 10 ? "0" + (dd.getMonth() + 1) : dd.getMonth() + 1; //获取当前月份的日期
  let d = dd.getDate() < 10 ? "0" + dd.getDate() : dd.getDate();
  return y + "-" + m + "-" + d;
}
// 本周
function getTime(n) {
  var now = new Date();
  var year = now.getFullYear();
  //因为月份是从0开始的,所以获取这个月的月份数要加1才行
  var month = checkTime(now.getMonth() + 1);
  var date = checkTime(now.getDate());
  var day = now.getDay();
  //判断是否为周日,如果不是的话,就让今天的day-1(例如星期二就是2-1)
  if (day !== 0) {
    n = n + (day - 1);
  } else {
    n = n + day;
  }
  if (day) {
    //这个判断是为了解决跨年的问题
    if (month > 1) {
      month = month;
    }
    //这个判断是为了解决跨年的问题,月份是从0开始的
    else {
      year = year - 1;
      month = 12;
    }
  }
  now.setDate(now.getDate() - n);
  year = now.getFullYear();
  month = now.getMonth() + 1;
  date = now.getDate();
  let s =
    year +
    "-" +
    (month < 10 ? "0" + month : month) +
    "-" +
    (date < 10 ? "0" + date : date);
  return s;
}
// 获得本周的开始日期和结束日期
function getWeekStartDateAndEndDateRange() {
  let oneDayLong = 24 * 60 * 60 * 1000;
  let now = new Date();
  let mondayTime = now.getTime() - (now.getDay() - 1) * oneDayLong;
  let sundayTime = now.getTime() + (7 - now.getDay()) * oneDayLong;
  let monday = new Date(mondayTime);
  let sunday = new Date(sundayTime);
  let weekRange = [monday, sunday];
  return weekRange;
}
// 获得本月的开始日期和结束日期
function getMonthStartDateAndDateRange() {
  let oneDayLong = 24 * 60 * 60 * 1000;
  let now = new Date();
  let year = now.getFullYear();
  let monthStartDate = new Date(year, now.getMonth() + 0, 1); //当前月1号
  let nextMonthStartDate = new Date(year, now.getMonth() + 1, 1); //下个月1号
  let days =
    (nextMonthStartDate.getTime() - monthStartDate.getTime()) / oneDayLong; //计算当前月份的天数
  let monthEndDate = new Date(year, now.getMonth() + 0, days);
  let monthRange = [monthStartDate, monthEndDate];
  return monthRange;
}
// 自定义时间
function checkTime(i) {
  if (i < 10) {
    i = "0" + i;
  }
  return i;
}

function timeform(a) {
  let date = new Date(a);
  return (
    date.getFullYear() +
    "-" +
    checkTime(date.getMonth() + 1) +
    "-" +
    checkTime(date.getDate()) +
    " " +
    checkTime(date.getHours()) +
    ":" +
    checkTime(date.getMinutes()) +
    ":" +
    checkTime(date.getSeconds())
  );
}

function formatDate(date) {
  var myyear = date.getFullYear();
  var mymonth = date.getMonth() + 1;
  var myweekday = date.getDate();
  if (mymonth < 10) {
    mymonth = "0" + mymonth;
  }
  if (myweekday < 10) {
    myweekday = "0" + myweekday;
  }
  return myyear + "-" + mymonth + "-" + myweekday;
}

function formatDatePc(date, fmt) {
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(
      RegExp.$1,
      (date.getFullYear() + "").substr(4 - RegExp.$1.length)
    );
  }
  const o = {
    "M+": date.getMonth() + 1,
    "d+": date.getDate(),
    "h+": date.getHours(),
    "m+": date.getMinutes(),
    "s+": date.getSeconds()
  };
  for (const k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      const str = o[k] + "";
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length === 1 ? str : padLeftZero(str)
      );
    }
  }
  return fmt;
}

function padLeftZero(str) {
  return ("00" + str).substr(str.length);
}

function getTimeRange() {
  var now = new Date(); // 当前日期
  var nowDayOfWeek = now.getDay(); // 今天本周的第几天
  var nowDay = now.getDate(); // 当前日
  var nowMonth = now.getMonth(); // 当前月
  var nowYear = now.getYear(); // 当前年
  nowYear += nowYear < 2000 ? 1900 : 0;
  // 格式化日期：yyyy-mm-dd
  function formatDate(date) {
    var myyear = date.getFullYear();
    var mymonth = date.getMonth() + 1;
    var myweekday = date.getDate();
    if (mymonth < 10) {
      mymonth = "0" + mymonth;
    }
    if (myweekday < 10) {
      myweekday = "0" + myweekday;
    }
    return myyear + "-" + mymonth + "-" + myweekday;
  }
  // 获得某月的天数
  function getMonthDays(myMonth) {
    var monthStartDate = new Date(nowYear, myMonth, 1);
    var monthEndDate = new Date(nowYear, myMonth + 1, 1);
    var days = (monthEndDate - monthStartDate) / (1000 * 60 * 60 * 24);
    return days;
  }
  // 获取今天的日期
  function getToday() {
    return formatDate(now);
  }
  // 获得本周的开始日期
  function getWeekStartDate() {
    var weekStartDate = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek);
    return formatDate(weekStartDate);
  }
  // 获得本周的结束日期
  function getWeekEndDate() {
    var weekEndDate = new Date(nowYear, nowMonth, nowDay + (6 - nowDayOfWeek));
    return formatDate(weekEndDate);
  }
  // 获得本月的开始日期
  function getMonthStartDate() {
    var monthStartDate = new Date(nowYear, nowMonth, 1);
    return formatDate(monthStartDate);
  }
  // 获得本月的结束日期
  function getMonthEndDate() {
    var monthEndDate = new Date(nowYear, nowMonth, getMonthDays(nowMonth));
    return formatDate(monthEndDate);
  }
  return {
    formatDate,
    getMonthDays,
    getToday,
    getWeekStartDate,
    getWeekEndDate,
    getMonthStartDate,
    getMonthEndDate
  };
}
//-------码表获取（编辑，检索）-------------start

// --码表集
function getCodeGroup(e, type) {
  let json = {
    type: type,
    token: constant.staticAccesstoken
  };
  request
    .get(apis.getCodeByType, {
      params: json
    })
    .then(res => {
      let labelCodeList = res.data.data;
      for (let i = 0; i < labelCodeList.length; i++) {
        let json = {
          dicvalue: labelCodeList[i].dicvalue,
          dictext: labelCodeList[i].dictext,
          dicdesc: labelCodeList[i].dicdesc
        };
        e.push(json);
      }
    })
    .catch();
}
// --码表集 lw
function getCodeGroupLw(type) {
  let json = {
      type: type,
      token: constant.staticAccesstoken
    },
    e = [];
  return new Promise((resolve, reject) => {
    request
      .get(apis.getCodeByType, {
        params: json
      })
      .then(res => {
        let labelCodeList = res.data.data;
        for (let i = 0; i < labelCodeList.length; i++) {
          let json = {
            value: labelCodeList[i].dicvalue,
            label: labelCodeList[i].dictext,
            desc: labelCodeList[i].dicdesc
          };
          e.push(json);
        }
        resolve(e);
      })
      .catch();
  });
}
// --码表集 zy
function getCodeGroup1(e, type) {
  let json = {
    type: type,
    token: constant.staticAccesstoken
  };
  request
    .get(apis.getCodeByType, {
      params: json
    })
    .then(res => {
      let labelCodeList = res.data.data;
      if ((labelCodeList.length = 0)) {
        console.log("ooooooooo");
        return false;
      }
      for (let i = 0; i < labelCodeList.length; i++) {
        let json = {
          dicvalue: labelCodeList[i].dicvalue,
          dictext: labelCodeList[i].dictext,
          dicdesc: labelCodeList[i].dicdesc
        };
        e.push(json);
      }
    })
    .catch();
}

function codeTounix(row, column) {
  let str = row[column.property];
  if (str == undefined) {
    return "";
  } else if (str == "1") {
    return "禁用";
  } else if (str == "0") {
    return "未禁用";
  }
}

//-------码表--（编辑，检索）-----------end
// var moment = require('moment')

// 获取时间戳 : var res = moment(Date.now(), 'YYYY-MM-DD HH:mm:ss').valueOf();   //    HH:mm:ss            // YYYY-MM-DD

// 获取格式时间: var res = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss'); //    HH:mm:ss            // YYYY-MM-DD

// 表格单列数据时间格式化
function datetounixMethods(row, column) {
  var date = row[column.property];
  if (date == undefined) {
    return "";
  }
  return moment(date).format("YYYY-MM-DD HH:mm:ss");
}

function callTounix(row, column) {
  var date = row[column.property];
  if (date == undefined || date == 0) {
    return false;
  }
  return true;
}

function dateToMonthMethods(row, column) {
  var date = row[column.property];
  if (date == undefined) {
    return "";
  }
  return moment(date).format("YYYY-MM");
}

function monthFilters(crtTime) {
  var date = crtTime;
  if (date == undefined) {
    return "";
  }
  return moment(date).format("YYYY-MM");
}

function dateMethods(row, column) {
  var date = row[column.property];
  if (!date) {
    return "";
  }
  return moment(date).format("YYYY-MM-DD");
}
// 时间过滤器
function datetounixFilters(crtTime) {
  var date = crtTime;
  if (date == undefined) {
    return "";
  }
  return moment(date).format("YYYY-MM-DD HH:mm:ss");
}
// 当月最后一天
function monthLastDay(date) {
  if (date) {
    date.setDate(28);
    date.setMonth(date.getMonth() + 1);
    // 日期设置为0号, 0表示1号的前一天
    let lastDay = date.setDate(0);
    return lastDay;
  }
}

function datetounix(crtTime) {
  var date = crtTime;
  if (!date) {
    return "";
  }
  return moment(date).format("YYYY-MM-DD");
}

function datetounixTime(crtTime) {
  var date = crtTime;
  if (date == undefined) {
    return "";
  }
  return moment(date).format("YYYY/MM/DD");
}

function timeTounix(crtTime) {
  var date = crtTime;
  if (date == undefined) {
    return "";
  }
  return moment(date).format("HH:mm:ss");
}
// 修改表格第一列label样式
function headerStyle({ row, column, rowIndex, columnIndex }) {
  if (rowIndex == 0) {
    return "text-align:center";
  } else {
    return "";
  }
}
// 操作
function cmtTpyetounix(row) {
  var data = row;
  if (data == undefined) {
    return "";
  } else if (data == 1) {
    return "提交";
  } else if (data == 2) {
    return "退回";
  } else if (data == 3) {
    return "删除";
  } else if (data == 5 || data == 7) {
    return "发布";
  } else if (data == 6) {
    return "审核通过并发布";
  } else if (data == 8) {
    return "移交";
  }
}
// 操作
function optTpyetounix(row) {
  var data = row;
  if (data == undefined) {
    return "";
  } else if (data == 1) {
    return "提交";
  } else if (data == 2) {
    return "退回";
  } else if (data == 3) {
    return "删除";
  } else if (data == 5 || data == 7) {
    return "发布";
  } else if (data == 6) {
    return "审核通过并发布";
  } else if (data == 8) {
    return "移交";
  } else if (data == 9) {
    return "撤回";
  } else if (data == 11) {
    return "写稿";
  } else if (data == 12) {
    return "选稿";
  }
}

// 操作
function enToAlabo(row) {
  var data = row;
  if (data == undefined) {
    return "";
  } else if (data == "one") {
    return 1;
  } else if (data == "two") {
    return 2;
  } else if (data == "three") {
    return 3;
  } else if (data == "four") {
    return 4;
  } else if (data == "five") {
    return 5;
  } else if (data == "six") {
    return 6;
  } else if (data == "seven") {
    return 7;
  } else if (data == "eight") {
    return 8;
  } else if (data == "nine") {
    return 9;
  } else if (data == "ten") {
    return 10;
  }
}

// 绩效实际扣减计量表状态
function deductionTounix(row, column) {
  var data = row[column.property];
  if (data == undefined) {
    return "";
  } else if (data == 1) {
    return "机构";
  } else if (data == 2) {
    return "岗位";
  } else if (data == 3) {
    return "职能人员";
  }
}
// 投放状态
function pushTounix(row, column) {
  var data = row[column.property];
  if (data == undefined) {
    return "";
  } else if (data == 1) {
    return "待投放";
  } else if (data == 2) {
    return "投放中";
  } else if (data == 4) {
    return "投放结束";
  }
}
// 投放状态--过滤器
function pushFilters(row) {
  var data = row;
  if (data == undefined) {
    return "";
  } else if (data == 1) {
    return "待投放";
  } else if (data == 2) {
    return "投放中";
  } else if (data == 4) {
    return "投放结束";
  }
}
// 广告类型--table
function adTounix(row, column) {
  var data = row[column.property];
  if (data == undefined) {
    return "";
  } else if (data == 1) {
    return "开屏广告";
  } else if (data == 2) {
    return "信息流广告大图";
  } else if (data == 3) {
    return "信息流广告小图";
  } else if (data == 4) {
    return "详情页广告小图";
  } else if (data == 5) {
    return "详情页广告文字";
  } else if (data == 6) {
    return "文旅号频道轮播图";
  }
}
// 广告状态--filters
function adFilters(row) {
  var data = row;
  if (data == undefined) {
    return "";
  } else if (data == 1) {
    return "开屏广告";
  } else if (data == 2) {
    return "信息流广告大图";
  } else if (data == 3) {
    return "信息流广告小图";
  } else if (data == 4) {
    return "详情页广告小图";
  } else if (data == 5) {
    return "详情页广告文字";
  } else if (data == 6) {
    return "文旅号频道轮播图";
  }
}

// 提交节点
function workItemtounix(row, column) {
  var data = row[column.property];
  if (data == undefined) {
    return "";
  } else if (data == 1) {
    return "一审" + cmtTpyetounix(row.cmtType);
  } else if (data == 2) {
    return "二审" + cmtTpyetounix(row.cmtType);
  } else if (data == 3) {
    return "三审" + cmtTpyetounix(row.cmtType);
  } else if (data == 5 || data == 7) {
    return cmtTpyetounix(row.cmtType);
  } else if (data == 9) {
    return "写稿";
  } else if (data == 10) {
    return "选稿";
  }
}
// 我的办理 日志 节点
function workItembuild(row, column) {
  var data = row[column.property];
  if (data == undefined) {
    return "";
  } else if (data == 0) {
    return optTpyetounix(row.optType);
  } else if (data == 1) {
    return "一审" + optTpyetounix(row.optType);
  } else if (data == 2) {
    return "二审" + optTpyetounix(row.optType);
  } else if (data == 3) {
    return "三审" + optTpyetounix(row.optType);
  } else if (data == 5) {
    return "四审" + optTpyetounix(row.optType);
  } else if (data == 20) {
    return optTpyetounix(row.optType);
  }
}
// 提交节点
function workItemfilters(row) {
  var data = row;
  if (data == undefined) {
    return "";
  } else if (data == 1) {
    return "一审";
  } else if (data == 2) {
    return "二审";
  } else if (data == 3) {
    return "三审";
  } else if (data == 5) {
    return "发布";
  } else if (data == 9) {
    return "写稿";
  } else if (data == 10) {
    return "选稿";
  }
}

function recTpyetounix(row) {
  var data = row;
  if (data == undefined) {
    return "";
  } else if (data == 1) {
    return "提";
  } else if (data == 2) {
    return "驳";
  } else if (data == 3) {
    return "撤";
  } else if (data == 4) {
    return "选";
  } else if (data == 8) {
    return "移";
  }
}

// 文旅号审核类型
function typetounix(row, column) {
  var data = row[column.property];
  if (data == undefined) {
    return "";
  } else if (data == 1) {
    return "艺术家";
  } else if (data == 2) {
    return "机构审核";
  } else if (data == 3) {
    return "政府审核";
  } else if (data == 4) {
    return "景区审核";
  }
}
// 文旅号审核类型
function typeFilters(row) {
  var data = row;
  if (data == undefined) {
    return "";
  } else if (data == 0) {
    return "待审核";
  } else if (data == 1) {
    return "通过";
  } else if (data == 2) {
    return "不通过";
  } else if (data == 3) {
    return "待审核和已通过";
  }
}
// 文旅号媒体类型
function mediaFilters(row) {
  var data = row;
  if (data == undefined) {
    return "";
  } else if (data == 1) {
    return "艺术家";
  } else if (data == 2) {
    return "机构媒体";
  } else if (data == 3) {
    return "政府媒体";
  } else if (data == 4) {
    return "景区";
  }
}
// 发票类型
function invoiceFilters(row) {
  var data = row;
  if (data == undefined) {
    return "";
  } else if (data == 1) {
    return "北京增值税普通发票";
  }
}

// 我的办理--签发状态
function issuedTounix(row, column) {
  var data = row[column.property];
  if (data == 1) {
    return "已签发";
  } else {
    return "未签发";
  }
}
// 选稿库 获取稿件状态
function mansWorkItemtounix(row, column) {
  var data = row[column.property];
  if (data == undefined) {
    return "";
  } else if (data == 1) {
    return "一审";
  } else if (data == 2) {
    return "二审";
  } else if (data == 3) {
    return "三审";
  } else if (data == 5) {
    return "发布";
  } else if (data == 9) {
    return "写稿";
  } else if (data == 10) {
    return "选稿";
  }
}

// 选稿库 获取稿件类型
function manusTypetounix(row, column) {
  var data = row[column.property];
  if (data == undefined) {
    return "";
  } else if (data == 1) {
    return "文章";
  } else if (data == 2) {
    return "图集";
  } else if (data == 3) {
    return "音频";
  } else if (data == 4) {
    return "视频";
  }
}

function typeOfHeritage(row, column) {
  var data = row[column.property];
  if (data == undefined) {
    return "";
  } else if (data == "1") {
    return "民间文学";
  } else if (data == "2") {
    return "传统音乐";
  } else if (data == "3") {
    return "传统舞蹈";
  } else if (data == "4") {
    return "传统戏剧";
  } else if (data == "5") {
    return "曲艺";
  } else if (data == "6") {
    return "体育游艺";
  } else if (data == "7") {
    return "传统美术";
  } else if (data == "8") {
    return "传统技艺";
  } else if (data == "9") {
    return "传统医药";
  } else if (data == "10") {
    return "民俗";
  }
}

function levelOfHeritage(row, column) {
  var data = row[column.property];
  if (data == undefined) {
    return "";
  } else if (data == "1") {
    return "国家级";
  } else if (data == "2") {
    return "省级";
  } else if (data == "3") {
    return "市级";
  } else if (data == "4") {
    return "县级";
  }
}

function levelOfPrice(row, column) {
  var data = row[column.property];
  if (data == undefined) {
    return "";
  } else if (data == "1") {
    return "全球奖项";
  } else if (data == "2") {
    return "国家级";
  } else if (data == "3") {
    return "省级";
  } else if (data == "4") {
    return "行业";
  } else if (data == "5") {
    return "专业";
  }
}
// 轮播图管理 选择文章 获取稿件类型
function typeOfManuscript(row, column) {
  var data = row[column.property];
  if (data == undefined) {
    return "";
  } else if (data == 1) {
    return "文稿";
  } else if (data == 2) {
    return "图集";
  } else if (data == 3) {
    return "音频";
  } else if (data == 4) {
    return "视频";
  } else if (data == 5) {
    return "专题";
  }
}
// 转换终端
function manusTerminalTypetounix(row, column) {
  var data = row[column.property];
  if (data == undefined) {
    return "";
  } else if (data == 1) {
    return "报纸";
  } else if (data == 2) {
    return "APP";
  } else if (data == 3) {
    return "微信";
  } else if (data == 4) {
    return "微博";
  } else if (data == 5) {
    return "网站";
  }
}
// 操作记录状态
function optTounix(row, column) {
  var data = row[column.property];
  if (data == undefined) {
    return "";
  } else if (data == 1) {
    return "通过";
  } else if (data == 2) {
    return "驳回";
  }
}

// 仪表盘转换终端
function DashboardTerminalTypetounix(row, column) {
  var data = row.categoryList[0].terminalType;
  if (data == undefined) {
    return "";
  } else if (data == 1) {
    return "报纸";
  } else if (data == 2) {
    return "APP";
  } else if (data == 3) {
    return "微信";
  } else if (data == 4) {
    return "微博";
  } else if (data == 5) {
    return "网站";
  }
}

function getSomeDate(firstDays, lastDays) {
  let now = new Date(); // 中国标准时间
  let nowTime = now.getTime(); // 当前绝对时间
  let oneDayLong = 24 * 60 * 60 * 1000; // 一天时间

  let endTime = nowTime - firstDays * oneDayLong;
  let lastTime = nowTime + lastDays * oneDayLong;
  let startDate = moment(new Date(endTime)).format("YYYY-MM-DD HH:mm:ss"); // 获取 开始日期如 "2019-2-25"
  let endDate = moment(new Date(lastTime)).format("YYYY-MM-DD HH:mm:ss"); // 获取 结束日期 "2019-3-4
  endDate = endDate.split(" ");
  endDate[1] = "23:59:59";
  endDate = endDate.join(" ");
  return {
    startDate,
    endDate
  };
}

function isAdmin(userId) {
  return true;
}

function getLoginUserOrgId() {
  return {
    orgId: "5be50dae5caf8442c4f6a15a",
    orgName: "文化和旅游部"
  };
}

// 0没有审核信息，1待审核，2通过，3驳回
function compileFilters(row) {
  let data = row;
  if (data == undefined) {
    return "";
  } else if (data == 3) {
    return "新增";
  } else if (data == 0) {
    return "待审核";
  } else if (data == 1) {
    return "通过";
  } else if (data == 2) {
    return "驳回";
  }
}

// 转化type传参
function typeToNameTounix(str) {
  if (str == "1") {
    return (str = "艺术家");
  } else if (str == "2") {
    return (str = "企业、组织");
  } else if (str == "3") {
    return (str = "政府");
  }
}

// 转化type传参
function typeToNumTounix(str) {
  if (str == "艺术家") {
    return (str = "1");
  } else if (str == "企业、组织") {
    return (str = "2");
  } else if (str == "政府") {
    return (str = "3");
  }
}

function typeToName(str) {
  if (str == "1") {
    return (str = "企业");
  } else if (str == "2") {
    return (str = "组织");
  }
}

function getSelectValue(key, dataSource) {
  var dataSourceArray = JSON.parse(dataSource);
  for (var i = 0; i < dataSourceArray.length; i++) {
    if (dataSourceArray[i]["value"] == key) {
      return dataSourceArray[i]["label"];
    }
  }
  return "";
}
// 更改 获取的 码表值
function changeCodeValue(key, dataSource) {
  for (var i = 0; i < dataSource.length; i++) {
    if (dataSource[i]["value"] == key) {
      return dataSource[i]["label"];
    }
  }
  return "";
}

function changeCodeDicValue(key, dataSource) {
  for (var i = 0; i < dataSource.length; i++) {
    if (dataSource[i]["dicvalue"] == key) {
      return dataSource[i]["dictext"];
    }
  }
  return "";
}

function changeCodeDicText(key, dataSource) {
  for (var i = 0; i < dataSource.length; i++) {
    if (dataSource[i]["dictext"] == key) {
      return dataSource[i]["dicvalue"];
    }
  }
  return "";
}

function copyValue(key, dataSource) {
  for (var i = 0; i < dataSource.length; i++) {
    if (dataSource[i]["dicvalue"] == key) {
      return dataSource[i]["dictext"];
    }
  }
  return "";
}
// 截取调数组的第一个
function spliceCode(data) {
  data.splice(0, 1);
  return data;
}

function updateStatus(data) {
  for (var i = 0; i < data.length; i++) {
    if (data[i]["status"] != 3) {
      return false;
    }
  }
  return true;
}

function splitToJoin(data) {
  if (data == undefined) {
    return "";
  }
  return data.split(".")[1].join("");
}
//设置element 表格表头的颜色
function setHeaderColor({ row, column, rowIndex, columnIndex }) {
  if (rowIndex == 0) {
    return "background:#f7f7f7";
  } else {
    return "";
  }
}
// 表格隔行变色
function interlacingDiscoloration({ row, rowIndex }) {
  if (rowIndex % 2 == 0) {
    return "warning-row";
  } else {
    return "success-row";
  }
}
// 时间戳转成时间 没有判断 传过来的时间为空的状态
function formatDateTwo(datestr) {
  var datetime = new Date();
  datetime.setTime(datestr);
  var year = datetime.getFullYear();
  var month = datetime.getMonth() + 1;
  var date = datetime.getDate();
  if (month < 10) {
    month = "0" + month;
  }
  if (date < 10) {
    date = "0" + date;
  }
  return year + "-" + month + "-" + date;
}

function transformQueryCondition(query) {
  console.log(query.condition);
  const searchCon = {
    condition: undefined,
    sort: query.sort,
    fields: query.fields,
    otherSearchBean: query.otherSearchBean,
    rowBounds: query.rowBounds
  };
  // const searchCon = Object.assign({}, query)
  if (searchCon.rowBounds) {
    if (searchCon.rowBounds.offset <= 0) {
      searchCon.rowBounds.offset = 0;
    } else {
      searchCon.rowBounds.offset = searchCon.rowBounds.offset - 1;
    }
  }
  // searchCon.condition = undefined

  const condition = [];
  for (const item in query.condition) {
    // BETWEEN情况
    if (query.condition[item].type === "BETWEEN") {
      if (!query.condition[item].value) {
        continue;
      }
    }
    // ISNULL情况
    if (query.condition[item].type === "ISNULL") {
      const input = {
        property: query.condition[item].property,
        value: [],
        type: query.condition[item].type
      };
      condition.push(input);
      continue;
    }
    // 过滤不存在的字段
    if (
      query.condition[item].value !== undefined &&
      query.condition[item].value !== ""
    ) {
      if (Array.isArray(query.condition[item].value)) {
        if (
          query.condition[item].value[0] !== "" &&
          query.condition[item].value[1] !== ""
        ) {
          const input = {
            property: query.condition[item].property,
            value: query.condition[item].value,
            type: query.condition[item].type
          };
          condition.push(input);
        }
      } else {
        const input = {
          property: query.condition[item].property,
          value: query.condition[item].value,
          type: query.condition[item].type
        };
        condition.push(input);
      }
    }
  }
  searchCon.condition = condition;

  return searchCon;
}

function payWay(str) {
  if (str == undefined) {
    return "";
  } else if (str == 1) {
    return "支付宝付款";
  } else if (str == 2) {
    return "微信付款";
  } else if (str == 3) {
    return "对公打款";
  } else if (str == 4) {
    return "其他";
  }
}

function StitchingArray(array, name) {
  let str = [];
  array.forEach(item => {
    str.push(item[name]);
  });
  str = str.join(",");
  return str;
}

// 伪数组转换成数组---待定
function argumentsToArr() {
  let makeArray = function(obj) {
    return Array.prototype.slice.call(obj, 0);
  };
  if (
    typeof Array.prototype.slice.call(document.documentElement.childNodes, 0) !=
      "undefined" &&
    typeof Array.prototype.slice.call(
      document.documentElement.childNodes,
      0
    )[0] != "undefined"
  ) {
    try {
      Array.prototype.slice.call(document.documentElement.childNodes, 0)[0]
        .nodeType;
    } catch (e) {
      makeArray = function(obj) {
        var res = [];
        for (var i = 0, len = obj.length; i < len; i++) {
          res.push(obj[i]);
        }
        return res;
      };
    }
  }
}
// 获取/解链接析字符串中的http/https/FTP等
function httpString(s) {
  var arr = [];
  var reg = /(http:\/\/|https:\/\/)((\w|=|\?|\.|\/|&|-)+)/g;
  //var reg = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
  //var reg=/(http(s)?\:\/\/)?(www\.)?(\w+\:\d+)?(\/\w+)+\.(swf|gif|jpg|bmp|jpeg)/gi;
  //var reg=/(http(s)?\:\/\/)?(www\.)?(\w+\:\d+)?(\/\w+)+\.(swf|gif|jpg|bmp|jpeg)/gi;
  // var reg = /(https?|http|ftp|file):\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/g;
  //var reg= /^((ht|f)tps?):\/\/[\w\-]+(\.[\w\-]+)+([\w\-\.,@?^=%&:\/~\+#]*[\w\-\@?^=%&\/~\+#])?$/;
  //v = v.replace(reg, "<a href='$1$2'>$1$2</a>"); //这里的reg就是上面的正则表达式
  //s = s.replace(reg, "$1$2"); //这里的reg就是上面的正则表达式
  arr = s.match(reg);
  console.log(arr);
  return arr;
}

function toPoint(percent) {
  var str = percent.replace("%", "");
  str = str / 100;
  return str;
}

function contentLength(data) {
  if (data) {
    return data.length;
  } else {
    return 0;
  }
}
// 时间选择器
function ChoiceTime() {
  return {
    disabledDate(time) {
      return time.getTime() > Date.now(); //开始时间不选时，结束时间最大值小于等于当天
    }
  };
}

// 全角转半角
function ToCDB(str) {
  var tmp = "";
  for (var i = 0; i < str.length; i++) {
    if (str.charCodeAt(i) > 65248 && str.charCodeAt(i) < 65375) {
      tmp += String.fromCharCode(str.charCodeAt(i) - 65248);
    } else {
      tmp += String.fromCharCode(str.charCodeAt(i));
    }
  }
  return tmp;
}
// 半角转全角
function ToDBC(txtstring) {
  var tmp = "";
  for (var i = 0; i < txtstring.length; i++) {
    if (txtstring.charCodeAt(i) == 32) {
      tmp = tmp + String.fromCharCode(12288);
    } else if (txtstring.charCodeAt(i) < 127) {
      tmp = tmp + String.fromCharCode(txtstring.charCodeAt(i) + 65248);
    }
  }
  return tmp;
}

function siteTerminaltounix(row, column) {
  var data = row[column.property];
  if (data == undefined || data == 0) {
    return "";
  } else if (data == 1) {
    return "WEB";
  } else if (data == 2) {
    return "H5";
  } else if (data == 3) {
    return "WEB, H5";
  }
}

function IsURL(param) {
  // 验证url
  var strRegex = /^((ht|f)tps?):\/\/([\w\-]+(\.[\w\-]+)*\/)*[\w\-]+(\.[\w\-]+)*\/?(\?([\w\-\.,@?^=%&:\/~\+#]*)+)?/;
  var re = new RegExp(strRegex);
  if (!re.test(param)) {
    return false;
  } else {
    return true;
  }
}

function queryDate() {
  //获取系统前一个月的时间
  var nowdate = new Date();
  nowdate.setMonth(nowdate.getMonth() - 1);
  var y = nowdate.getFullYear();
  var m = nowdate.getMonth() + 1;
  var d = nowdate.getDate();
  var formatwdate = y + "-" + m + "-" + d;

  return formatwdate;
}

function getBeforeDate() {
  // 获取系统前7天日期
  var nowdate = new Date();
  nowdate.setDate(nowdate.getDate() - 7);
  var y = nowdate.getFullYear();
  var m =
    nowdate.getMonth() + 1 < 10
      ? "0" + (nowdate.getMonth() + 1)
      : nowdate.getMonth() + 1;
  var d = nowdate.getDate() < 10 ? "0" + nowdate.getDate() : nowdate.getDate();
  return y + "-" + m + "-" + d;
}

// 获取指定日期的后一天或者前一天 day传 1 后一天 传 -1 前一天
function getNextDate(date, day) {
  var dd = new Date(date);
  dd.setDate(dd.getDate() + day);
  var y = dd.getFullYear();
  var m =
    dd.getMonth() + 1 < 10 ? "0" + (dd.getMonth() + 1) : dd.getMonth() + 1;
  var d = dd.getDate() < 10 ? "0" + dd.getDate() : dd.getDate();
  return y + "-" + m + "-" + d;
}

function getDayLine() {
  return moment(new Date()).format("YYYY-MM-DD");
}

function fontNumber(fontstr, count) {
  // const length = fontstr.length
  // if (length > 70) {
  //   let str = ''
  //   str = fontstr.substring(0, 70) + '......'
  //   return str
  // } else {
  //   return fontstr + ' '
  // }
  const length = fontstr.length;
  if (length > count) {
    let str = "";
    str = fontstr.substring(0, count) + "......";
    return str;
  } else {
    return fontstr + " ";
  }
}

function changeCircleSvgs(status) {
  if (status == 0) return "#iconyuandianxiaoblue-copy";
  if (status == 2) return "#iconyuandianxiaogreay-copy";
  if (status == 3) return "#iconyuandianxiaored-copy";
}

function changeCircleSvg(status, changeCircleSvg) {
  // if (status == 10 || status == 20 || status == 30)
  //   return "#iconyuandianxiaoblue-copy";
  // if (status == 40) return "#iconyuandianxiaogreay-copy";
  // if (status == 50) return "#iconyuandianxiaogreen-copy";
  if (changeCircleSvg == 1) {
    return "#iconyuandianxiaored-copy";
  } else {
    if (status == 10 || status == 20) return "#iconyuandianxiaoblue-copy";
    if (status == -1) return "#iconyuandianxiaogreay-copy";
    if (status == 50) return "#iconyuandianxiaogreen-copy";
    if (status == 60) return "#iconyuandianxiao-copy";
    if (status == 70) return "#iconyuandianxiao-copy-copy";
  }
}

function changeCircleStatus(status) {
  if (status == "0") return "#iconyuandianxiaogreay-copy";
  if (status == "2") return "#iconyuandianxiaoblue-copy";
  if (status == "4") return "#iconyuandianxiao-copy-copy";
  if (status == "5") return "#iconyuandianxiaogreen-copy";
  if (status == "6") return "#iconyuandianxiaored-copy";
  if (status == "-1") return "#iconyuandianxiaogreay-copy";
}

function status(row, column) {
  var data = row[column.property];
  if (data == undefined) {
    return "";
  }
  if (data.includes(",")) {
    let arr = data.split(",");
    let cloneArr = [];
    cloneArr = arr.map(item => {
      if (item == 0) {
        item = "未提交";
      } else if (item == 1) {
        item = "待考评";
      } else if (item == 2) {
        item = "待打分";
      } else if (item == 10) {
        item = "已完成打分";
      } else if (item == 20) {
        item = "审核中";
      } else if (item == 30) {
        item = "审核完成";
      }
      return item;
    });
    return cloneArr.join(",");
  } else {
    if (data == 0) {
      return "未提交";
    } else if (data == 1) {
      return "待考评";
    } else if (data == 2) {
      return "待打分";
    } else if (data == 10) {
      return "已完成打分";
    } else if (data == 20) {
      return "审核中";
    } else if (data == 30) {
      return "审核完成";
    }
  }
}

function statusMethod(row) {
  var data = row;
  if (data == undefined || data == 0) {
    return "未提交";
  } else if (data == 1) {
    return "待考评";
  } else if (data == 2) {
    return "待打分";
  } else if (data == 10) {
    return "已完成打分";
  } else if (data == 20) {
    return "审核中";
  } else if (data == 30) {
    return "审核完成";
  }
}
// 会议类型
function meetingStatus(data) {
  if (data == "ordinary") {
    return "普通会";
  } else if (data == "department") {
    return "部门会";
  } else if (data == "editorial") {
    return "编委会";
  } else if (data == "group") {
    return "集团编委会";
  }
}

//获取指定时间的最后一天
function getLastDayOfMonth(date) {
  var endDate = new Date(date);
  var month = endDate.getMonth();
  var nextMonth = ++month;
  if (nextMonth < 10) {
    nextMonth = "0" + nextMonth;
  }
  var nextMonthFirstDay = new Date(endDate.getFullYear(), nextMonth, 1);
  var oneDay = 1000 * 60 * 60 * 24;
  var dateString = new Date(nextMonthFirstDay - oneDay);
  console.log(dateString); //Wed Oct 31 2018 00:00:00 GMT+0800 (中国标准时间)
  return dateString.toLocaleDateString(); //toLocaleDateString() 返回 如：2018/8/31
}

function subtableSave(tableData, accesstoken, func) {
  var cb = function(result) {
    if (!library.isEmpty(result.data._id))
      tableData.formdata._id = result.data._id;
    Object.keys(tableData.formdata).forEach(function(key) {
      if (
        library.isEmpty(tableData.formdata[key]) &&
        library.isEmpty(result.data[key])
      ) {
        tableData.formdata[key] = result.data[key];
      }
    });
    if (tableData.nowIndex == -1) {
      tableData.list.push(tableData.formdata);
    } else {
      tableData.list[tableData.nowIndex] = tableData.formdata;
    }
    setTimeout(function() {
      tableData.optionType = "none";
      tableData.formDialogVisible = false;
      if (func) {
        // 刷新列表
        func();
      }
    }, 500);
    $message.success("保存成功！");
  };
  tableData.$refs[tableData.$formname].validate(valid => {
    if (valid) {
      if (!library.isEmpty(tableData.formdata._id)) {
        request
          .put(
            apis.cmsBaseurl + "/apis/resource/" + tableData.$sheetsign + "/put",
            {
              token: accesstoken,
              data: safeEncodeBase64(
                JSON.stringify({
                  condition: {
                    _id: tableData.formdata._id
                  },
                  data: tableData.formdata
                })
              )
            }
          )
          .then(response => {
            var result = response.data;
            cb(result);
          })
          .catch(error => {});
      } else {
        request
          .post(
            apis.cmsBaseurl +
              "/apis/resource/" +
              tableData.$sheetsign +
              "/post",
            {
              token: accesstoken,
              data: safeEncodeBase64(
                JSON.stringify({
                  data: tableData.formdata
                })
              )
            }
          )
          .then(response => {
            var result = response.data;
            tableData.formdata = result.data;
            tableData.total++;
            cb(result);
          })
          .catch(error => {});
      }
    } else {
      $message.error("请检查表单填写情况");
      return false;
    }
  });
}

function deleteRow(tableData, index, accesstoken, callback) {
  request
    .delete(
      apis.cmsBaseurl + "/apis/resource/" + tableData.$sheetsign + "/delete",
      {
        data: {
          token: accesstoken,
          data: safeEncodeBase64(
            JSON.stringify({
              condition: {
                _id: tableData.list[index]._id //_id是系统添加数据自动生成的主键，可以根据主键去删除数据
                // '自己建的字段名':'对应需要筛选的值'
              }
            })
          )
        }
      }
    )
    .then(response => {
      tableData.nowIndex = -1;
      tableData.list.splice(index, 1);
      tableData.total--;
      $message.success("该条内容删除成功！");
      callback && callback();
    })
    .catch(error => {});
}
//字符串编码（处理GET传参的问题）
function safeEncodeBase64(str) {
  if (typeof str != "string") str = JSON.stringify(str);
  str = Base64.encodeURI(str);
  // var string = str.replace(/\+/g, "^").replace(/\//g, "_").replace(/=/g, "*");
  return str;
}
//字符串解码
function safeDecodeBase64(str) {
  if (typeof str != "string") str = JSON.stringify(str);
  // var string = str.replace(/\^/g, "+").replace(/\_/g, "/").replace(/\*/g, "=");
  return Base64.decode(str);
}
// 验证图片地址是否是外链地址
function verificationImg(content, userId, accesstoken) {
  // 清空数组
  let imageArr = [];
  let savingList = [];
  var path = require("path");
  // 不是图集的 可以粘贴进来的图片
  content.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/gi, function(
    match,
    capture
  ) {
    var imgType = path.extname(capture).slice(1);
    if (
      imgType != "jpg" &&
      imgType != "jpeg" &&
      imgType != "jpe" &&
      imgType != "jif" &&
      imgType != "png" &&
      imgType != "gif" &&
      imgType != "ico" &&
      imgType != "jfif" &&
      imgType != "bmp"
    ) {
      imgType = "jpg";
    }
    // 判断出外链的地址
    if (capture.indexOf(apis.synchronization) == -1) {
      imageArr.push({
        title: capture,
        description: capture,
        filmingAuthor: userId, //拍摄者
        filmingEditor: userId, //精修者
        imgHttpUrl: capture, //图片地址
        filmingTime: datetounixFilters(new Date()), //拍摄时间
        fileext: imgType
      });
    }
  });
  return new Promise((resolve, reject) => {
    if (imageArr.length != 0) {
      let json = {
        token: accesstoken,
        infos: imageArr
      };
      request
        .post(
          apis.synchroMaterialApi,
          qs.stringify(json, {
            arrayFormat: "indices",
            allowDots: true
          })
        )
        .then(res => {
          savingList = res.data.data;
          // 接口回来的数组 以旧的文件去比较 用新的文件去全局替换
          if (savingList.length != 0) {
            for (var i = 0; i < savingList.length; i++) {
              if (
                !library.isEmpty(savingList[i].imgHttpUrl) &&
                !library.isEmpty(savingList[i].imgUrl)
              ) {
                if (content.indexOf(savingList[i].imgHttpUrl) > -1) {
                  if (savingList[i].imgHttpUrl.indexOf("?") > -1) {
                    savingList[i].imgHttpUrl = savingList[i].imgHttpUrl.split(
                      "?"
                    );
                    var reg = new RegExp(
                      savingList[i].imgHttpUrl[0] +
                        "\\u003F" +
                        savingList[i].imgHttpUrl[1] +
                        `"`,
                      "g"
                    );
                  } else {
                    var reg = new RegExp(savingList[i].imgHttpUrl + `"`, "g");
                  }
                  content = content.replaceAll(
                    reg,
                    savingList[i].imgUrl + `" imgid=${savingList[i].id}`
                  );
                }
              }
            }
          }
          resolve(content);
        })
        .catch(err => {
          reject(false);
        });
    } else {
      resolve(content);
    }
  });
}
//获取区域列表
function getAreaList(pid) {
  return new Promise((resolve, reject) => {
    request
      .get(`https://gateway.ccmapp.cn:8081/cityArea/findByPid?pid=${pid}`)
      .then(response => {
        if (response.data.code == 200) {
          resolve(response.data.data);
        }
      })
      .catch(error => {
        console.log(error);
        reject();
      });
  });
}
export {
  checkPermission,
  validPhone,
  validPassWord,
  compareContent,
  outputHtml,
  GetDateStr,
  getTime,
  getWeekStartDateAndEndDateRange,
  getMonthStartDateAndDateRange,
  checkTime,
  timeform,
  formatDate,
  formatDatePc,
  getTimeRange,
  getCodeGroup,
  getCodeGroup1,
  getCodeGroupLw,
  datetounixMethods,
  datetounixFilters,
  headerStyle,
  cmtTpyetounix,
  optTpyetounix,
  workItemtounix,
  workItembuild,
  getSomeDate,
  getLoginUserOrgId,
  typetounix,
  typeFilters,
  mediaFilters,
  mansWorkItemtounix,
  manusTypetounix,
  typeOfManuscript,
  typeOfHeritage,
  levelOfHeritage,
  levelOfPrice,
  validEmail,
  validIdCode,
  compileFilters,
  typeToNameTounix,
  typeToNumTounix,
  validCall,
  getSelectValue,
  spliceCode,
  updateStatus,
  recTpyetounix,
  splitToJoin,
  setHeaderColor,
  interlacingDiscoloration,
  formatDateTwo,
  transformQueryCondition,
  validAdd,
  validReduce,
  validNegInt,
  validNptInt,
  validNtzInt,
  changeCodeValue,
  datetounixTime,
  workItemfilters,
  payWay,
  validCode,
  validTax,
  validAddress,
  validBankAccount,
  changeCodeDicValue,
  manusTerminalTypetounix,
  DashboardTerminalTypetounix,
  StitchingArray,
  argumentsToArr,
  httpString,
  validTitle,
  toPoint,
  contentLength,
  codeTounix,
  ChoiceTime,
  ToCDB,
  ToDBC,
  nonEssentialValidEmail,
  nonEssentialValidPhone,
  siteTerminaltounix,
  invoiceFilters,
  typeToName,
  IsURL,
  queryDate,
  getNextDate,
  getBeforeDate,
  getDayLine,
  pushTounix,
  adTounix,
  adFilters,
  pushFilters,
  timeTounix,
  datetounix,
  fontNumber,
  changeCircleSvg,
  changeCircleStatus,
  dateMethods,
  optTounix,
  callTounix,
  changeCodeDicText,
  dateToMonthMethods,
  deductionTounix,
  monthLastDay,
  monthFilters,
  checkUrl,
  status,
  enToAlabo,
  changeCircleSvgs,
  meetingStatus,
  getLastDayOfMonth,
  issuedTounix,
  subtableSave,
  deleteRow,
  safeEncodeBase64,
  statusMethod,
  verificationImg,
  getAreaList
};
