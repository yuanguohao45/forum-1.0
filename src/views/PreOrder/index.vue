<template>
  <div class="pre-order">
    <el-card class="m-r-15">
      <div class="title">
        第四届电力大数据高峰论坛
      </div>
    </el-card>
    <el-card class="m-15">
      <el-form :model="ruleForm" class="p-r-15" :rules="rules" ref="ruleForm" label-width="100px" size="mini">
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="ruleForm.phone" placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item label="验证码" prop="code">
          <div class="v-line">
            <el-input v-model="ruleForm.code"></el-input>
            <el-button size="mini" plain @click="handleCode">获取验证码</el-button>
          </div>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="ruleForm.name" placeholder="请输入姓名"></el-input>
        </el-form-item>
        <el-form-item label="公司名称" prop="company">
          <el-input v-model="ruleForm.company" placeholder="请输入公司名称"></el-input>
        </el-form-item>
        <el-form-item label="职位" prop="job">
          <el-input v-model="ruleForm.job" placeholder="请选填职位"></el-input>
        </el-form-item>
        <el-form-item label="观看直播意向" prop="terminal">
          <p></p>
          <el-checkbox-group v-model="ruleForm.terminal" style="display:block;">
            <el-checkbox style="display:block;" label="主题峰会1" name="type1"></el-checkbox>
            <el-checkbox style="display:block;" label="主题峰会2" name="type2"></el-checkbox>
            <el-checkbox style="display:block;" label="主题峰会3" name="type3"></el-checkbox>
            <el-checkbox style="display:block;" label="主题峰会4" name="type4"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item>
          <el-button class="sing-btn" type="primary" @click="hanldeSingUP('ruleForm')">报名</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "PreOrder",
  data() {
    return {
      ruleForm: {
        name: "",
        phone: "",
        company: "",
        job: "",
        terminal: []
      },
      rules: {
        name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
        phone: [{ required: true, message: "请输入手机号", trigger: "blur" }],
        company: [
          { required: true, message: "请输入公司名称", trigger: "blur" }
        ],
        job: [{ required: true, message: "请选填职位", trigger: "change" }]
      }
    };
  },
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
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
};
</script>

<style lang="scss" scoped>
.pre-order {
  .m-r-15 {
    .title {
      font-weight: 600;
    }
  }
  .p-r-15 {
    height: calc(100vh - 135px);
    .v-line {
      display: flex;
      justify-content: space-between;
      .el-button {
        margin-left: 5px;
        flex: 1;
      }
    }
    .sing-btn {
      width: 100px;
    }
  }
}
</style>