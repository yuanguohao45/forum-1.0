<template>
  <div class="pre-order">
    <div class="container">
      <div class="header">
        <div class="title">
          <img src="@/assets/image/预约界面切图/第四届电力大数据高峰论坛.png" alt="">
        </div>
      </div>
      <div class="content">
        <el-form :model="ruleForm" class="content-form" :rules="rules" ref="ruleForm" label-width="80px" size="mini">
          <el-form-item label="手机号：" prop="phone">
            <el-input v-model="ruleForm.phone" placeholder="请输入手机号"></el-input>
          </el-form-item>
          <el-form-item label="验证码：" prop="code">
            <div class="v-line">
              <el-input v-model="ruleForm.code" placeholder="请输入验证码"></el-input>
              <el-button size="mini" plain @click="handleCode">获取验证码</el-button>
            </div>
          </el-form-item>
          <el-form-item label="姓名：" prop="name">
            <el-input v-model="ruleForm.name" placeholder="请输入姓名"></el-input>
          </el-form-item>
          <el-form-item label="公司：" prop="company">
            <el-input v-model="ruleForm.company" placeholder="请输入公司名称"></el-input>
          </el-form-item>
          <el-form-item label="邮箱：" prop="job">
            <el-input v-model="ruleForm.job" placeholder="请填写邮箱"></el-input>
          </el-form-item>
          <el-form-item label="观看直播意向：" class="live-item" prop="terminal">
          </el-form-item>
          <el-form-item label="" class="live-item" prop="terminal">
            <el-checkbox-group v-model="ruleForm.terminal">
              <el-checkbox style="display:block;" label="主论坛：数聚引领，赋智电力" name="type1"></el-checkbox>
              <el-checkbox style="display:block;" label="专题论坛1：电力大数据应用" name="type2"></el-checkbox>
              <el-checkbox style="display:block;" label="专题论坛2：人工智能与区块链技术" name="type3"></el-checkbox>
              <el-checkbox style="display:block;" label="专题论坛3：大数据与网路安全" name="type4"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="footer" align="center">
      <!-- <img src="@/assets/image/预约界面切图/圆角矩形6.png" alt="">
      <el-button class="sing-btn" type="primary" @click="hanldeSingUP('ruleForm')">报名</el-button> -->
      <div class="bg-btn" @click="hanldeSingUP('ruleForm')">
        <span>我要报名</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PreOrder',
  data() {
    return {
      ruleForm: {
        name: '',
        phone: '',
        company: '',
        terminal: [],
        email: ''
      },
      imgType: '1',
      rules: {
        name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        phone: [{ required: true, message: '请输入手机号', trigger: 'blur' }],
        company: [
          { required: true, message: '请输入公司名称', trigger: 'blur' }
        ],
        job: [{ required: true, message: '请选填职位', trigger: 'change' }]
      }
    }
  },
  mounted() {},
  methods: {
    /**
     *  获取验证码
     */
    handleCode() {},
    /**
     *  报名
     */
    hanldeSingUP(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
        } else {
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>

<style lang="scss" scoped>
.pre-order {
  width: 100vw;
  height: 100vh;
  background: url('../../assets/image/预约界面切图/摄图网_401122141.png')
    no-repeat;
  background-size: 100% 100%;
  position: relative;
  display: flex;
  justify-content: center;
  .container {
    position: absolute;
    top: 10vh;
    display: flex;
    justify-content: center;
    .header {
      .title {
        width: 80vw;
        img {
          width: 100%;
        }
      }
    }
    .content {
      width: 100vw;
      height: 60vh;
      position: absolute;
      top: 15vh;
      background: url('../../assets/image/预约界面切图/矩形1.png') no-repeat;
      background-size: 100% 100%;
      color: #fff;
      .content-form {
        padding: 1rem 1rem 1rem 0.3rem;
        /deep/ .el-form-item {
          margin-bottom: 12px !important;
          /deep/ .el-form-item__label {
            color: #fff !important;
            font-size: 0.1rem;
          }
        }
        .live-item {
          /deep/ .el-form-item__label {
            width: 120px !important;
          }
          /deep/ .el-checkbox-group {
            margin-left: -40px;
            margin-top: -10px;
            /deep/ .el-checkbox__label {
              color: #fff;
              font-size: 12px;
            }
          }
        }
      }
    }
  }

  .v-line {
    width: 100%;
    display: flex;
    justify-content: space-between;
    .el-button {
      margin-left: 5px;
      flex: 1;
    }
  }
  .footer {
    position: absolute;
    bottom: 4vh;
    .bg-btn {
      width: 100px;
      height: 33px;
      background: url('../../assets/image/预约界面切图/圆角矩形6.png') no-repeat;
      background-size: 100% 100%;
      line-height: 30px;
      span {
        font-size: 17px;
        color: #fff;
      }
    }
  }
}
@media screen and (max-width: 568px) {
  .content {
    width: 100vw;
    height: 60vh;
    position: absolute;
    top: 15vh;
    background: url('../../assets/image/预约界面切图/矩形1.png') no-repeat;
    background-size: 100% 100%;
    color: #fff;
    .content-form {
      padding: 0.3rem 0.3rem 0.3rem 0.1rem !important;
      /deep/ .el-form-item {
        margin-bottom: 6px !important;
        /deep/ .el-form-item__label {
          color: #fff !important;
          font-size: 0.1rem;
        }
      }
      .live-item {
        /deep/ .el-form-item__label {
          width: 120px !important;
        }
        /deep/ .el-checkbox-group {
          margin-left: -40px;
          margin-top: -10px;
          /deep/ .el-checkbox__label {
            color: #fff;
            font-size: 12px;
          }
        }
      }
    }
  }
}
</style>