<template>
  <div class="sms">
    <div class="sms-center" align="center">
      <div class="font-20 font-w">
        短信群发
      </div>
      <el-form :model="queryParams" :rules="rules" ref="queryParams" size="mini" label-width="100px">
        <el-form-item label="发送内容" prop="content">
          <el-input v-model="queryParams.content" type="textarea" :autosize="{ minRows: 4, maxRows: 10}" placeholder="请输入内容"></el-input>
        </el-form-item>
        <el-form-item align="center">
          <el-button type="primary" @click="submitForm('queryParams')">立即发送</el-button>
          <el-button @click="resetForm('queryParams')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import qs from "qs";
import { apis } from "@/utils/apis";
import request from "@/utils/request";

export default {
  data() {
    return {
      lessTime: "2020-05-21 08:30:00", // 发送时间
      queryParams: {
        content:
          "【第四届电力大数据高峰论坛】尊敬的XX，第四届电力大数据高峰论坛直播将于9：00开始，请您准时进入观看直播，还有幸运大奖等你拿。", // 发送内容
        userList: [] // 手机号集合
      },
      rules: {
        time: [
          { required: true, message: "请选择发送时间", trigger: "change" }
        ],
        content: [
          { required: true, message: "请填写发送内容", trigger: "blur" }
        ]
      }
    };
  },
  created() {},
  mounted() {},
  methods: {
    /**
     *  获取预约人员
     */
    getPreList() {
      request
        .get(apis.sms.getPreData, { params: { token: "" } })
        .then(res => {
          if (res.data.code == 200) {
            this.queryParams.userList = res.data.data;
            return;
          }
          this.$message.error(res.data.message);
        })
        .catch(err => {});
    },
    /**
     *  时间换算
     */
    getLimitTime() {
      let preTime = new Date(this.lessTime).getTime();
      let nowTime = new Date().getTime();
      let limitTime = nowTime - preTime;
      if (limitTime) {
        setTimeout(() => {
          this.submitForm("queryParams");
        }, limitTime);
      }
    },
    /**
     *  发送
     */
    submitForm(formName) {
      let preTime = new Date(this.lessTime).getTime();
      let nowTime = new Date().getTime();
      let limitTime = nowTime - preTime;
      if (limitTime) {
        setTimeout(() => {
          this.$refs[formName].validate(valid => {
            if (valid) {
              request
                .post(apis.sms.postSms, qs.stringify(this.queryParams))
                .then(res => {
                  if (res.data.code == 200) {
                    this.$message.success("群发成功");
                    return;
                  }
                  this.$message.error(res.data.message);
                })
                .catch(err => {});
            } else {
              return false;
            }
          });
        }, limitTime);
      }
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
};
</script>

<style lang="scss" scoped>
.sms {
  display: flex;
  justify-content: center;
  align-items: center;
  .sms-center {
    margin-top: 100px;
    .font-w {
      margin-bottom: 40px;
    }
    .el-form {
      width: 50vw;
    }
  }
}
</style>