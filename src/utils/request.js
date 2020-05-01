/*
 * @Author: liuxiangnan
 * @Date: 2018-12-13 00:48:36
 * @Last Modified by: wamgxinyu
 * @Last Modified time: 2019-03-24 14:05:15
 */
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
        if (config.url.indexOf("/api-cms-") > 0 || config.url.indexOf("/api-wage-") > 0) {
            if (
                config.url.indexOf("api-cms-production/cms/selection/subject/addTask") >
                0 ||
                config.url.indexOf("api-cms-production/performance/info/evaluate") >
                0 ||
                config.url === apis.testBaseUrl + "/api-cms-work/cms/work/" ||
                config.url.indexOf("/api-cms-weixin3/wx/updateMenu") > 0 ||
                config.url.indexOf("/api-cms-weixin3/wx/addMenu") > 0 ||
                config.url.indexOf("/api-cms-weixin3/wx/menuNewsEvent") > 0 ||
                config.url.indexOf("/api-cms-government/appProble") > 0 ||
                config.url.indexOf("/api-cms-production/performance/scoreadjust") > 0 ||
                config.url.indexOf("/api-cms-production/performance/score") > 0 ||
                config.url.indexOf(
                    "/api-cms-production/performance/infocategory/update"
                ) > 0 ||
                config.url ===
                apis.testBaseUrl + "/api-wage-accounting/wage/yearsalary" ||
                config.url.indexOf("/cms/selection/task") > 0 ||
                config.url.indexOf("/cms/selection/groupTask") > 0 ||
                config.url.indexOf("/cms/production/matgroup") > 0 ||
                (config.url.indexOf("/cms/production/quick/adt") > 0 &&
                    config.url.indexOf("matCommitToSecond") == -1) ||
                config.url === apis.meeting.meeting ||
                config.url.indexOf("/api-cms-production/cms/selection/addSubjectInfo") >
                0 ||
                config.url.indexOf(
                    "api-cms-production/scheduling/schedulingRole/updateSchedulingRoleByPageName"
                ) > 0 ||
                config.url === apis.createdWord ||
                config.url.indexOf(
                    "/cms/production/workitem/business/scoreadjustlist"
                ) > 0 ||
                config.url ===
                apis.testBaseUrl + "/api-cms-production/viewUser" || config.url.indexOf("/api-wage-accounting/wage/accessscore/submit") > 0 ||
                config.url.indexOf("/api-wage-accounting/wage/accessscore/save") > 0 ||
                config.url.indexOf("/api-wage-accounting/wage/accessscore/listHistoryAccessScore") > 0 ||
                config.url.indexOf("/cms/material/imgInfo/save") > 0 ||
                config.url.indexOf("/cms/material/audioInfo/save") > 0 ||
                config.url.indexOf("/cms/material/videoInfo/save") > 0
            ) {
                config.headers = { "Content-Type": "application/json;charset=UTF-8" };
            } else {
                config.headers = {
                    "Content-Type": "application/x-www-form-urlencoded"
                };
            }
        } else {
            config.headers = { "Content-Type": "application/json;charset=UTF-8" };
        }
        //记录请求时间
        config.requestStartDate = Date.parse(new Date())
        return config;
    },
    error => {
        //记录并提供信息
        errorlos(error, error.status || 0)
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
        errorlos(response, response.status || 0)
        return response;
    },
    error => {
        $message.error("网络连接失败");
        errorlos(error, error.status || error.response.status || 0)
        return Promise.reject(error);
    }
);
export default service;