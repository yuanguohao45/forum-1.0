// 本文件为工具类，无需更改
"use strict";

import request from "Utils/request";
var Base64 = {
  // 转码表
  table: [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
    "j",
    "k",
    "l",
    "m",
    "n",
    "o",
    "p",
    "q",
    "r",
    "s",
    "t",
    "u",
    "v",
    "w",
    "x",
    "y",
    "z",
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "+",
    "/"
  ],
  UTF16ToUTF8: function(str) {
    var res = [],
      len = str.length;
    for (var i = 0; i < len; i++) {
      var code = str.charCodeAt(i);
      var byte1, byte2;
      if (code > 0x0000 && code <= 0x007f) {
        // 单字节，这里并不考虑0x0000，因为它是空字节
        // U+00000000 – U+0000007F  0xxxxxxx
        res.push(str.charAt(i));
      } else if (code >= 0x0080 && code <= 0x07ff) {
        // 双字节
        // U+00000080 – U+000007FF  110xxxxx 10xxxxxx
        // 110xxxxx
        byte1 = 0xc0 | ((code >> 6) & 0x1f);
        // 10xxxxxx
        byte2 = 0x80 | (code & 0x3f);
        res.push(String.fromCharCode(byte1), String.fromCharCode(byte2));
      } else if (code >= 0x0800 && code <= 0xffff) {
        // 三字节
        // U+00000800 – U+0000FFFF  1110xxxx 10xxxxxx 10xxxxxx
        // 1110xxxx
        byte1 = 0xe0 | ((code >> 12) & 0x0f);
        // 10xxxxxx
        byte2 = 0x80 | ((code >> 6) & 0x3f);
        // 10xxxxxx
        var byte3 = 0x80 | (code & 0x3f);
        res.push(
          String.fromCharCode(byte1),
          String.fromCharCode(byte2),
          String.fromCharCode(byte3)
        );
      } else if (code >= 0x00010000 && code <= 0x001fffff) {
        // 四字节
        // U+00010000 – U+001FFFFF  11110xxx 10xxxxxx 10xxxxxx 10xxxxxx
      } else if (code >= 0x00200000 && code <= 0x03ffffff) {
        // 五字节
        // U+00200000 – U+03FFFFFF  111110xx 10xxxxxx 10xxxxxx 10xxxxxx 10xxxxxx
      } /** if (code >= 0x04000000 && code <= 0x7FFFFFFF)*/ else {
        // 六字节
        // U+04000000 – U+7FFFFFFF  1111110x 10xxxxxx 10xxxxxx 10xxxxxx 10xxxxxx 10xxxxxx
      }
    }

    return res.join("");
  },
  UTF8ToUTF16: function(str) {
    var res = [],
      len = str.length;
    for (var i = 0; i < len; i++) {
      var code = str.charCodeAt(i);
      // 对第一个字节进行判断
      var code2, code3, byte1, byte2, utf16;
      if (((code >> 7) & 0xff) == 0x0) {
        // 单字节
        // 0xxxxxxx
        res.push(str.charAt(i));
      } else if (((code >> 5) & 0xff) == 0x6) {
        // 双字节
        // 110xxxxx 10xxxxxx
        code2 = str.charCodeAt(++i);
        byte1 = (code & 0x1f) << 6;
        byte2 = code2 & 0x3f;
        utf16 = byte1 | byte2;
        res.push(String.fromCharCode(utf16));
      } else if (((code >> 4) & 0xff) == 0xe) {
        // 三字节
        // 1110xxxx 10xxxxxx 10xxxxxx
        code2 = str.charCodeAt(++i);
        code3 = str.charCodeAt(++i);
        byte1 = (code << 4) | ((code2 >> 2) & 0x0f);
        byte2 = ((code2 & 0x03) << 6) | (code3 & 0x3f);
        utf16 = ((byte1 & 0x00ff) << 8) | byte2;
        res.push(String.fromCharCode(utf16));
      } else if (((code >> 3) & 0xff) == 0x1e) {
        // 四字节
        // 11110xxx 10xxxxxx 10xxxxxx 10xxxxxx
      } else if (((code >> 2) & 0xff) == 0x3e) {
        // 五字节
        // 111110xx 10xxxxxx 10xxxxxx 10xxxxxx 10xxxxxx
      } /** if (((code >> 1) & 0xFF) == 0x7E)*/ else {
        // 六字节
        // 1111110x 10xxxxxx 10xxxxxx 10xxxxxx 10xxxxxx 10xxxxxx
      }
    }

    return res.join("");
  },
  encode: function(str) {
    if (!str) {
      return "";
    }
    var utf8 = this.UTF16ToUTF8(str); // 转成UTF8
    var i = 0; // 遍历索引
    var len = utf8.length;
    var res = [];
    while (i < len) {
      var c1 = utf8.charCodeAt(i++) & 0xff;
      res.push(this.table[c1 >> 2]);
      // 需要补2个=
      if (i == len) {
        res.push(this.table[(c1 & 0x3) << 4]);
        res.push("==");
        break;
      }
      var c2 = utf8.charCodeAt(i++);
      // 需要补1个=
      if (i == len) {
        res.push(this.table[((c1 & 0x3) << 4) | ((c2 >> 4) & 0x0f)]);
        res.push(this.table[(c2 & 0x0f) << 2]);
        res.push("=");
        break;
      }
      var c3 = utf8.charCodeAt(i++);
      res.push(this.table[((c1 & 0x3) << 4) | ((c2 >> 4) & 0x0f)]);
      res.push(this.table[((c2 & 0x0f) << 2) | ((c3 & 0xc0) >> 6)]);
      res.push(this.table[c3 & 0x3f]);
    }

    return res.join("");
  },
  decode: function(str) {
    if (!str) {
      return "";
    }

    var len = str.length;
    var i = 0;
    var res = [];

    while (i < len) {
      var code1 = this.table.indexOf(str.charAt(i++));
      var code2 = this.table.indexOf(str.charAt(i++));
      var code3 = this.table.indexOf(str.charAt(i++));
      var code4 = this.table.indexOf(str.charAt(i++));

      var c1 = (code1 << 2) | (code2 >> 4);
      var c2 = ((code2 & 0xf) << 4) | (code3 >> 2);
      var c3 = ((code3 & 0x3) << 6) | code4;

      res.push(String.fromCharCode(c1));

      if (code3 != 64) {
        res.push(String.fromCharCode(c2));
      }
      if (code4 != 64) {
        res.push(String.fromCharCode(c3));
      }
    }

    return this.UTF8ToUTF16(res.join(""));
  }
};
// 字符串的字符替换函数
String.prototype.replaceAll = function(FindText, RepText) {
  var regExp = new RegExp(FindText, "g");
  return this.replace(regExp, RepText);
};

// string原型trim方法扩展
String.prototype.ctrim = function() {
  return this.replace(/(^\s*)|(\s*$)/g, "");
};
var library = {
  /**
   * 使用循环的方式判断一个元素是否存在于一个数组中
   * @param {Object} arr 数组
   * @param {Object} value 元素值
   */
  isInArray(array, value) {
    return this.posInArray(array, value) >= 0;
  },
  posInArray(array, value) {
    var hit = -1;
    for (var i = 0; i < array.length; i++) {
      if (typeof array[i] == "string" || typeof array[i] == "number") {
        if (array[i] == value) {
          hit = i;
          break;
        }
      } else if (value == array[i].key) {
        hit = i;
        break;
      }
    }
    return hit;
  },
  //判断是否为数字
  isNum(s) {
    if (s != null && s != "" && typeof s != "undefined") {
      return !isNaN(s);
    }
    return false;
  },
  //是否为NULL
  isNull(value) {
    if (value == null || typeof value == "undefined" || value === undefined) {
      return true;
    }
    return false;
  },
  //是否为空(包括空字符串)
  isEmpty(strings) {
    if (!this.isNull(strings)) {
      // 先判断是否为null，返回true ，判断是否为空字符串，返回true
      if ((strings + "").replace(/(^\s*)|(\s*$)/g, "").length === 0) {
        //已修正bug，当strings为数字时，会报strings.replace is not a function
        return true;
      }
    } else {
      return true;
    }
    // 不为空返回false
    return false;
  },
  // 本地缓存
  putData(key, value) {
    // 键  值
    try {
      if (typeof Storage != "undefined") {
        // 判断浏览器是否支持 localStorage ,不支持用cookie
        localStorage.setItem(key, value);
      } else {
        throw "NoStorage";
      }
    } catch (oException) {}
  },
  // 获取缓存内容
  getData(key, defaultvalue) {
    // defaultvalue 为数据获取不到或为空时默认的数据
    let temp;
    if (typeof Storage != "undefined") {
      // 判断浏览器是否支持 localStorage ,不支持用cookie
      temp = localStorage.getItem(key);
    }
    return temp != undefined && temp !== "" ? temp : defaultvalue;
  },
  // 清除缓存
  clearData(key) {
    if (typeof Storage != "undefined") {
      localStorage.removeItem(key);
    }
  },
  Base64,
  encodeBase64(str) {
    if (typeof str != "string") str = JSON.stringify(str);
    str = this.Base64.encode(str);
    return str;
  },
  decodeBase64(str) {
    if (typeof str != "string") str = JSON.stringify(str);
    if (isEmpty(str)) {
      return "";
    }
    return this.Base64.decode(str);
  },
  //字符串编码（加密）
  safeEncodeBase64(str) {
    if (typeof str != "string") str = JSON.stringify(str);
    str = this.Base64.encode(str);
    var string = str
      .replace(/\+/g, "^")
      .replace(/\//g, "_")
      .replace(/=/g, "*");
    return string;
  },
  //字符串解码（解密）
  safeDecodeBase64(str) {
    if (typeof str != "string") str = JSON.stringify(str);
    var string = str
      .replace(/\^/g, "+")
      .replace(/\_/g, "/")
      .replace(/\*/g, "=");
    return this.Base64.decode(string);
  },
  //获取url参数
  getUrlParam(name) {
    var reg = new RegExp(name + "=([^&]*)(&|$)");
    var r = window.location.href.match(reg);
    if (r != null) {
      return r[1];
    }
    return "";
  },
  //格式化文件大小
  formatFileSize: function(value) {
    if (null == value || value == "" || value == "0") {
      return "0 B";
    }
    var unitArr = new Array(
      "B",
      "KB",
      "MB",
      "GB",
      "TB",
      "PB",
      "EB",
      "ZB",
      "YB"
    );
    var index = 0;
    var srcsize = parseFloat(value);
    index = Math.floor(Math.log(srcsize) / Math.log(1024));
    var size = srcsize / Math.pow(1024, index);
    size = size.toFixed(2); //保留的小数位数
    return size + unitArr[index];
  }
};
var componentHelper = {
  callChooser(type, fielddata) {
    fielddata.push({
      _id: "123123",
      name: "测试",
      realname: "测试"
    });
  },
  showFile(tableData, index, fieldname) {
    tableData.fileDialogVisible = true;
    tableData.fileDialogData = tableData.list[index];
    tableData.fileDialogFieldname = fieldname;
  },
  downloadFile(url) {
    window.open(url);
  },
  showRow(tableData, index) {
    tableData.nowIndex = index;
    tableData.optionType = "show";
    tableData.formDialogVisible = true;
    tableData.disableAllField = true;
    tableData.disabledField = [];
    this.syncFieldDisabled(tableData);
    tableData.formdata = tableData.list[index];
  },
  addSubtable(tableData) {
    tableData.nowIndex = -1;
    tableData.optionType = "add";
    tableData.formDialogVisible = true;
    tableData.disableAllField = false;
    tableData.disabledField = [];
    this.syncFieldDisabled(tableData);
    tableData.formdata = JSON.parse(
      JSON.stringify(tableData.formDataStructure)
    );
  },
  subtableModify(tableData) {
    tableData.optionType = "modify";
    tableData.disableAllField = false;
    tableData.disabledField = [];
    this.syncFieldDisabled(tableData);
  },
  deleteRow(tableData, index, accesstoken, callback) {
    request
      .post(cmx.apis.delete(tableData.$sheetsign), {
        token: accesstoken,
        condition: library.safeEncodeBase64({
          _id: tableData.list[index]._id
        })
      })
      .then(response => {
        tableData.nowIndex = -1;
        tableData.list.splice(index, 1);
        tableData.total--;
        $message.success("该条内容删除成功！");
        callback && callback();
      })
      .catch(error => {});
  },
  subtableSave(tableData, accesstoken, func) {
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
            .post(cmx.apis.put(tableData.$sheetsign), {
              token: accesstoken,
              condition: library.safeEncodeBase64({
                _id: tableData.formdata._id
              }),
              data: library.safeEncodeBase64(tableData.formdata)
            })
            .then(response => {
              var result = response.data;
              cb(result);
            })
            .catch(error => {});
        } else {
          request
            .post(cmx.apis.post(tableData.$sheetsign), {
              token: accesstoken,
              data: library.safeEncodeBase64(tableData.formdata)
            })
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
  },
  modifyFileName(tableData, index, accesstoken) {
    $prompt("将文件名修改为", "修改文件名", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      inputValue:
        tableData.fileDialogData[tableData.fileDialogFieldname][index].name
    })
      .then(({ value }) => {
        tableData.fileDialogData[tableData.fileDialogFieldname][
          index
        ].name = value;
        request
          .post(cmx.apis.put(tableData.$sheetsign), {
            token: accesstoken,
            condition: library.safeEncodeBase64({
              _id: tableData.fileDialogData._id
            }),
            data: library.safeEncodeBase64(tableData.fileDialogData)
          })
          .then(response => {
            $message.success({
              title: "系统消息",
              message: "文件名修改成功！"
            });
          })
          .catch(error => {});
      })
      .catch(() => {});
  },
  searchOrganizeRemoteMethod(query) {
    BUS.userAndOrgAssist.searchOrganizeResult = [];
  },
  searchUserRemoteMethod(query) {
    //获取用户列表的，支持姓名搜索
    if (query !== "") {
      BUS.userAndOrgAssist.loading = true;
      request
        .get(cmx.apis.getuserlist(), {
          params: {
            token: BUS.nowThis.accesstoken,
            data: library.safeEncodeBase64({
              name: query === " " ? "" : query,
              pagination: {
                currentPage: 0,
                pageSize: 999999
              }
            })
          }
        })
        .then(response => {
          BUS.userAndOrgAssist.loading = false;
          var result = response.data;
          BUS.userAndOrgAssist.searchUserResult = result.data.list;
        })
        .catch(error => {
          BUS.userAndOrgAssist.searchUserResult = [];
        });
    } else {
      BUS.userAndOrgAssist.searchUserResult = [];
    }
  },
  syncFieldDisabled(_formname) {
    let disabledField = JSON.parse(JSON.stringify(_formname.disabledField));
    _formname.disabledField = [];
    Object.keys(_formname.formdata).forEach(key => {
      if (
        (_formname.disableAllField || library.isInArray(disabledField, key)) &&
        !library.isInArray(_formname.enableField, key)
      ) {
        _formname.disabledField.push(key);
      }
    });
  },
  indexMethod(index) {
    return index;
  },
  getUserAndOrgAbstract(fielddata) {
    if (library.isEmpty(fielddata)) {
      return "无";
    }
    var abstract = "";
    for (var i = 0; i < fielddata.length && i < 2; i++) {
      abstract +=
        "，" +
        (library.isEmpty(fielddata[i].realname)
          ? fielddata[i].name
          : fielddata[i].realname);
    }
    abstract = library.isEmpty(abstract) ? "无" : abstract.substr(1);
    return abstract + (2 < fielddata.length ? "等" : "");
  },
  handleCallUserAndOrgDialog() {},
  checkPasswordStrength: function(rule, fieldValue, callback) {
    if (rule.notnull == "1" && library.isEmpty(fieldValue)) {
      return callback(new Error("本字段必填"));
    }
    if (!library.isEmpty(fieldValue)) {
      if (fieldValue.length < rule.min)
        return callback(new Error("请输入大于" + rule.min + "位的密码"));
      if (fieldValue.length > rule.max)
        return callback(new Error("请输入小于" + rule.max + "位的密码"));
      let splitNumber = rule.strength.split(":");
      let splitType = splitNumber[1].split("+");
      let passwordCombinationCount = parseInt(splitNumber[0]);
      let msg = "";
      if (library.isInArray(splitType, "uppercase")) {
        if (/^\S*[A-Z]+\S*$/.test(fieldValue)) {
          passwordCombinationCount--;
        }
        msg += "大写字母、";
      }
      if (library.isInArray(splitType, "lowercase")) {
        if (/^\S*[a-z]+\S*$/.test(fieldValue)) {
          passwordCombinationCount--;
        }
        msg += "小写字母、";
      }
      if (library.isInArray(splitType, "number")) {
        if (/^\S*[0-9]+\S*$/.test(fieldValue)) {
          passwordCombinationCount--;
        }
        msg += "数字、";
      }
      if (library.isInArray(splitType, "specialcharacter")) {
        if (/^\S*[!@#$%^&*?]+\S*$/.test(fieldValue)) {
          passwordCombinationCount--;
        }
        msg += "字符（!@#$%^&*?）、";
      }
      if (passwordCombinationCount > 0) {
        return callback(
          new Error("应含" + msg + "中至少" + parseInt(splitNumber[0]) + "种")
        );
      }
    }
    callback();
  },
  checkNumber: function(rule, fieldValue, callback) {
    if (rule.notnull == "1" && library.isEmpty(fieldValue)) {
      return callback(new Error("本字段必填"));
    }
    if (!library.isEmpty(fieldValue) && !library.isNum(fieldValue)) {
      return callback(new Error("请输入数字"));
    }
    if (!library.isEmpty(fieldValue)) {
      var fieldValueNum = parseFloat(fieldValue);
      if (fieldValueNum < rule.min)
        return callback(new Error("请输入大于" + rule.min + "的数字"));
      if (fieldValueNum > rule.max)
        return callback(new Error("请输入小于" + rule.max + "的数字"));
    }
    callback();
  },
  checkText: function(rule, fieldValue, callback) {
    if (rule.notnull == "1" && library.isEmpty(fieldValue)) {
      return callback(new Error("本字段必填"));
    }
    if (
      !library.isEmpty(fieldValue) &&
      fieldValue.length > rule.max &&
      rule.max != 0
    ) {
      return callback(new Error("最多输入" + rule.max + "个字"));
    }
    if (!library.isEmpty(fieldValue)) {
      var msg = "";
      var reg;
      switch (rule.formatter) {
        case "none":
          reg = /^[\s\S]*$/;
          break;
        case "idcard":
          reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
          msg = "请输入正确的身份证号";
        case "email":
          reg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/i;
          msg = "请输入正确的邮件地址";
          break;
        case "mobilephone":
          reg = /^1[3|4|5|7|8]\d{9}$/i;
          msg = "请输入正确的手机号码";
          break;
        case "telephone":
          reg = /^(\d{3,4}-|\d{3.4}-)?\d{7,8}$/i;
          msg = "请输入正确的座机号码";
          break;
        case "website":
          reg = /[a-zA-z]+:\/\/[^\s]*/i;
          msg = "请输入正确的网址";
          break;
      }
      var r = fieldValue.match(reg);
      if (r == null) {
        return callback(new Error(msg));
      }
    }
    callback();
  },
  getSelectValue(key, dataSource) {
    var dataSourceArray = JSON.parse(dataSource);
    for (var i = 0; i < dataSourceArray.length; i++) {
      if (dataSourceArray[i]["key"] == key) {
        return dataSourceArray[i]["value"];
      }
    }
    return "不能匹配";
  },
  pickerOptions: {
    shortcuts: [
      {
        text: "今天",
        onClick(picker) {
          picker.$emit("pick", new Date());
        }
      },
      {
        text: "昨天",
        onClick(picker) {
          const date = new Date();
          date.setTime(date.getTime() - 3600 * 1000 * 24);
          picker.$emit("pick", date);
        }
      },
      {
        text: "一周前",
        onClick(picker) {
          const date = new Date();
          date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
          picker.$emit("pick", date);
        }
      }
    ]
  },
  pickerRangeOptions: {
    shortcuts: [
      {
        text: "最近一周",
        onClick(picker) {
          const end = new Date();
          const start = new Date();
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
          picker.$emit("pick", [start, end]);
        }
      },
      {
        text: "最近一个月",
        onClick(picker) {
          const end = new Date();
          const start = new Date();
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
          picker.$emit("pick", [start, end]);
        }
      },
      {
        text: "最近三个月",
        onClick(picker) {
          const end = new Date();
          const start = new Date();
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
          picker.$emit("pick", [start, end]);
        }
      }
    ]
  },
  fileOption: {
    handleSuccess(response, file, fileList) {
      var _this = this;
      if (response.state == "200")
        setTimeout(function() {
          _this.fileList.push({
            name: response.name,
            url: response.url,
            mimetype: response.mimetype,
            size: response.size
          });
        }, 500);
    },
    handleRemove(file, fileList) {
      for (var i = 0; i < this.fileList.length; i++) {
        if (this.fileList[i].uid == file.uid) {
          this.fileList.splice(i, 1);
          break;
        }
      }
    },
    handlePreview(file) {
      window.open(library.isEmpty(file.url) ? file.response.url : file.url);
    },
    handleExceed(files, fileList) {
      this.$message.warning(`最多上传 ${this.limit} 个文件`);
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    }
  }
};
var cmx = {
  PARENT: undefined,
  CLIENT_TYPE: "web",
  SERVER_URL: process.env.baseURL,
  WEB_URL: process.env.webURL,
  SERVER_WEB_PORT: process.env.webPort,
  SERVER_PORT: process.env.serverPort,
  SERVER_REPOS_URL: "",
  SERVER_FILE_URL: "",
  SERVER_WORKSPACE_URL: "",
  SERVER_USER_URL: "",
  SERVER_APPLICATION_URL: "",
  SERVER_EXTRA_URL: "",
  SERVER_MESSAGE_URL: "",
  CMX_AUTHORIZE_URL: "",
  appkey: "",
  locationLoginUrl: "", // ./index.html#/Login
  redirecturi: "",
  init: function(_option, param) {
    /**
     * clientType
     * serverUrl
     * authorizePagePort
     */
    this.appkey = _option.appkey;
    this.locationLoginUrl = this.library.isEmpty(_option.locationLoginUrl)
      ? ""
      : _option.locationLoginUrl;
    this.redirecturi = _option.redirecturi;
    param = param || {};
    this.CLIENT_TYPE = param.clientType
      ? param.clientType
      : cmx.library.getUrlParam("clienttype") == "PC" ||
        cmx.library.getUrlParam("clienttype") == "pc"
      ? "pc"
      : "web";
    this.SERVER_URL = param.serverUrl ? param.serverUrl : this.SERVER_URL;
    this.SERVER_REPOS_URL =
      this.SERVER_URL + ":" + this.SERVER_PORT + "/repositoryController/";
    this.SERVER_FILE_URL =
      this.SERVER_URL + ":" + this.SERVER_PORT + "/fileController/";
    this.SERVER_WORKSPACE_URL =
      this.SERVER_URL + ":" + this.SERVER_PORT + "/workspaceController/";
    this.SERVER_USER_URL =
      this.SERVER_URL + ":" + this.SERVER_PORT + "/userController/";
    this.SERVER_MESSAGE_URL =
      this.SERVER_URL + ":" + this.SERVER_PORT + "/messageController/";
    this.SERVER_EXTRA_URL =
      this.SERVER_URL + ":" + this.SERVER_PORT + "/extraController/";
    this.SERVER_APPLICATION_URL =
      this.SERVER_URL + ":" + this.SERVER_PORT + "/applicationcontroller/";
    this.CMX_AUTHORIZE_URL =
      this.WEB_URL +
      ":" +
      (param.authorizePagePort
        ? param.authorizePagePort
        : this.SERVER_WEB_PORT) +
      "/#/";
    if (typeof param.callError != "undefined") {
      this.callError = param.callError;
    }
  },
  apis: {
    get: function(dataSign) {
      return cmx.SERVER_REPOS_URL + dataSign + "/get";
    },
    post: function(dataSign) {
      return cmx.SERVER_REPOS_URL + dataSign + "/post";
    },
    put: function(dataSign) {
      return cmx.SERVER_REPOS_URL + dataSign + "/put";
    },
    upsert: function(dataSign) {
      return cmx.SERVER_REPOS_URL + dataSign + "/upsert";
    },
    delete: function(dataSign) {
      return cmx.SERVER_REPOS_URL + dataSign + "/delete";
    },
    getorganizetree: function() {
      return cmx.SERVER_USER_URL + "getorganizetree";
    },
    getworkspaceinfo: function() {
      return cmx.SERVER_WORKSPACE_URL + "getworkspaceinfo";
    },
    getuserlist: function() {
      return cmx.SERVER_USER_URL + "user/workspace/get";
    },
    getuserlistbyrole: function() {
      return cmx.SERVER_APPLICATION_URL + "getuserarraybyrole";
    },
    getuserinfo: function(_openid) {
      return cmx.SERVER_USER_URL + "get/" + _openid;
    },
    getuserinfoandauth: function() {
      return cmx.SERVER_EXTRA_URL + "getuserinfoandauth";
    },
    uploadfile: function(path) {
      return cmx.SERVER_FILE_URL + "uploadandarchive";
    },
    clientgetaccesstoken: function() {
      return cmx.SERVER_USER_URL + "clientgetaccesstoken";
    },
    bus: function() {
      return cmx.SERVER_MESSAGE_URL + "bus";
    }
  },
  callBus(func, data, cb) {
    var socketUUID = cmx.getParentUUID();
    var accesstoken = cmx.getAccesstoken();
    if (!library.isEmpty(socketUUID)) {
      request
        .get(cmx.apis.bus(), {
          params: {
            token: accesstoken,
            target: socketUUID,
            message: JSON.stringify({
              function: func,
              data: data
            })
          }
        })
        .then(response => {
          if (typeof cb != "undefined") cb(true);
        })
        .catch(error => {
          if (typeof cb != "undefined") cb(false);
        });
      return true;
    } else {
      return false;
    }
  },
  callError(msg) {
    alert(msg);
  },
  clearAll() {
    this.library.clearData(this.appkey + "-accesstoken");
    this.library.clearData(this.appkey + "-openid");
  },
  setAccesstoken(data) {
    if (!this.library.isEmpty(data))
      this.library.putData(this.appkey + "-accesstoken", data);
  },
  setOpenid(data) {
    if (!this.library.isEmpty(data))
      this.library.putData(this.appkey + "-openid", data);
  },
  getOpenid() {
    return this.library.getData(this.appkey + "-openid");
  },
  getParentUUID() {
    var socketUUID = this.library.getUrlParam("socketUUID");
    if (!this.library.isEmpty(socketUUID)) {
      this.library.putData("socketUUID", socketUUID);
    } else {
      socketUUID = this.library.getData("socketUUID");
    }
    return socketUUID;
  },
  getAccesstoken() {
    if (
      this.library.isEmpty(this.appkey) ||
      this.library.isEmpty(this.redirecturi)
    ) {
      this.callError("请配置cmx.init初始化函数");
      return undefined;
    }
    if (
      (this.library.isEmpty(
        this.library.getData(this.appkey + "-accesstoken")
      ) &&
        this.library.isEmpty(this.library.getUrlParam("accesstoken"))) ||
      (this.library.isEmpty(this.library.getData(this.appkey + "-openid")) &&
        this.library.isEmpty(this.library.getUrlParam("openid")))
    ) {
      if (!this.library.isEmpty(this.library.getUrlParam("token")))
        location.href =
          this.CMX_AUTHORIZE_URL +
          "Authorize/" +
          this.library.getUrlParam("token") +
          "/" +
          this.appkey +
          "/" +
          encodeURIComponent(this.redirecturi);
      else if (!this.library.isEmpty(this.locationLoginUrl))
        location.href = this.locationLoginUrl;
      else this.callError("跳转登录失败");
      return undefined;
    } else {
      if (!this.library.isEmpty(this.library.getUrlParam("accesstoken"))) {
        this.library.putData(
          this.appkey + "-accesstoken",
          this.library.getUrlParam("accesstoken")
        );
      }
      let _accesstoken = this.library.getData(this.appkey + "-accesstoken");
      var lastAuthExpire = this.library.getData("lastAuthExpire");
      var lastAuth = this.library.getData("lastAuth");
      if (
        lastAuthExpire != "" &&
        new Date().getTime() - lastAuthExpire <= 1000 * 60 * 30 &&
        lastAuth == _accesstoken + this.library.getUrlParam("token")
      ) {
        return _accesstoken;
      } else {
        this.library.clearData(this.appkey + "-accesstoken");
        this.library.clearData(this.appkey + "-openid");
        var httpRequest = new XMLHttpRequest();
        httpRequest.open(
          "GET",
          cmx.SERVER_USER_URL +
            "refreshaccesstoken?accesstoken=" +
            _accesstoken +
            "&token=" +
            this.library.getUrlParam("token"),
          false
        );

        /**
         * 获取数据后的处理程序
         */
        httpRequest.onreadystatechange = function() {
          if (httpRequest.readyState == 4 && httpRequest.status == 200) {
            var result = JSON.parse(httpRequest.responseText);
            if (result.state == "200" && !cmx.library.isEmpty(result.data)) {
              cmx.library.putData(
                cmx.appkey + "-accesstoken",
                result.data.accesstoken
              );
              cmx.library.putData(cmx.appkey + "-openid", result.data.openid);
              window.webfunny && webfunny.wmInitUser(result.data.openid, "1");
            } else if (result.state == "401") {
              cmx.library.clearData(cmx.appkey + "-accesstoken");
              cmx.library.clearData(cmx.appkey + "-openid");
              if (!cmx.library.isEmpty(cmx.library.getUrlParam("token")))
                location.href =
                  cmx.CMX_AUTHORIZE_URL +
                  "Authorize/" +
                  cmx.library.getUrlParam("token") +
                  "/" +
                  cmx.appkey +
                  "/" +
                  encodeURIComponent(cmx.redirecturi);
              else if (!cmx.library.isEmpty(cmx.locationLoginUrl))
                location.href = cmx.locationLoginUrl;
              else this.callError("跳转登录失败");
              return undefined;
            }
          } else {
            cmx.callError("网络连接失败，请重试");
          }
        };
        httpRequest.send();
        this.library.putData(
          "lastAuth",
          this.library.getData(this.appkey + "-accesstoken") +
            this.library.getUrlParam("token")
        );
        this.library.putData("lastAuthExpire", new Date().getTime());
        return this.library.getData(this.appkey + "-accesstoken");
      }
    }
  },
  loadUserInfoAndPermission(cb) {
    var httpRequest = new XMLHttpRequest();
    httpRequest.open(
      "GET",
      cmx.SERVER_EXTRA_URL +
        "getuserinfoandauth?token=" +
        this.library.getData(this.appkey + "-accesstoken"),
      false
    );

    /**
     * 获取数据后的处理程序
     */
    httpRequest.onreadystatechange = function() {
      if (httpRequest.readyState == 4 && httpRequest.status == 200) {
        var result = JSON.parse(httpRequest.responseText);
        if (result.state == "200" && !cmx.library.isEmpty(result.data)) {
          result.data.userinfo.isadmin = library.isInArray(
            !result.data.userinfo.special ? [] : result.data.userinfo.special,
            "develop"
          );
          library.putData("userinfo", JSON.stringify(result.data.userinfo));
          library.putData("orginfo", JSON.stringify(result.data.orginfo));
          library.putData("permission", JSON.stringify(result.data.permission));
          library.putData("roleinfo", JSON.stringify(result.data.roleinfo));
          cb(
            result.data.userinfo,
            result.data.permission,
            result.data.orginfo,
            result.data.roleinfo
          );
        } else if (result.state == "401") {
          return false;
        }
      } else {
        cmx.callError("网络连接失败，请重试");
        return false;
      }
    };
    httpRequest.send();
  },
  library,
  componentHelper
};
export { cmx, library };
