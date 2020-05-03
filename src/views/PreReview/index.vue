<template>
  <div class="draft-view-mgt">
    <el-card class="normal-card header-panel">
      <div slot="header">
        <span class="font-20 font-w">预约审核</span>
      </div>
      <el-row :gutter="10">
        <el-col :span="6">
          <el-input clearable placeholder="请输入手机号" v-model="queryParams.phone" size="mini">
          </el-input>
        </el-col>
        <el-col :span="6">
          <el-input clearable placeholder="请输入姓名" v-model="queryParams.name" size="mini">
          </el-input>
        </el-col>
        <el-col :span="6">
          <el-select style="width:100%" clearable size="mini" v-model="queryParams.status" placeholder="请选择状态" @change="statusChange">
            <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" size="mini" @click="handleCurrentChange(1)">查询</el-button>
        </el-col>
      </el-row>
    </el-card>
    <el-card class="normal-card m-b-0 main-panel">
      <el-table :data="tableData" style="width: 100%" :header-cell-style="headerStyle" v-loading="tableLoading" element-loading-text="给我一点时间" highlight-current-row>
        <el-table-column type="index" label="序号" align="center" min-width="100" :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column prop="name" label="姓名" min-width="50" align="center" :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column prop="phone" label="手机" min-width="50" align="center" :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column prop="company" label="公司" min-width="50" align="center" :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column prop="job" label="职位" min-width="50" align="center" :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column prop="terminal" label="观看意向" min-width="50" align="center" :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column prop="status" label="审核状态" min-width="50" align="center" :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column label="审核" align="center">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="handlePass(scope.row)">审核通过</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="m-20 m-b-10" align="right">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryParams.currentPage" :page-sizes="[10, 20, 30, 40,50]" :page-size="queryParams.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
import qs from "qs";
import { apis } from "@/utils/apis";
import request from "@/utils/request";
import { headerStyle } from "@/utils/public";

export default {
  data() {
    return {
      headerStyle,
      tableData: [
        {
          name: "王小虎",
          phone: 1312131321,
          company: "s第三方士大夫",
          job: "水电费第三方",
          terminal: "水电费第三方是",
          status: "审核通过",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          name: "王小虎",
          phone: 1312131321,
          company: "s第三方士大夫",
          job: "水电费第三方",
          terminal: "水电费第三方是",
          status: "审核通过",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          name: "王小虎",
          phone: 1312131321,
          company: "s第三方士大夫",
          job: "水电费第三方",
          terminal: "水电费第三方是",
          status: "审核通过",
          address: "上海市普陀区金沙江路 1518 弄"
        }
      ],
      tableKey: 0, // 表格key
      tableLoading: false,
      total: 0,

      queryParams: {
        name: "",
        phone: "",
        status: "",
        currentPage: 1,
        pageSize: 10
      },

      statusOptions: [
        { label: "未审核", value: "0" },
        { label: "已审核", value: "1" }
      ],

      userInfo: {
        content:
          "【第四届电力大数据高峰论坛】尊敬的XX，您已成功预约由中国电力大数据创新联盟、中国电机工程学会电力信息化专业委员会、华北电力大学联合主办的第四届电力大数据高峰论坛直播！邀请您关注“大数据中心”微信公众号，5月21日进入直播观看，还有幸运大奖等你拿。"
      }
    };
  },
  created() {
    this.getTableData();
  },
  methods: {
    /**
     *  表格数据
     */
    getTableData() {
      request
        .get(apis.preReview.getTableData, { params: this.queryParams })
        .then(res => {
          if (res.data.code == 200) {
            this.tableData = res.data.data;
            this.total = res.data.count;
            return;
          }
          this.$message.error(res.data.message);
        })
        .catch(err => {});
    },
    /**
     *  状态检索
     */
    statusChange(val) {
      this.queryParams.status = val;
      this.getTableData();
    },
    /**
     *  审核通过
     */
    handlePass(row) {
      this.userInfo = Object.assign({}, this.userInfo, row);
      request
        .post(apis.preReview.pass, row)
        .then(res => {
          if (res.data.code == 200) {
            this.$message.success("审核通过");
            this.sendMessage();
            return;
          }
          this.$message.error(res.data.message);
        })
        .catch(err => {});
    },
    sendMessage() {
      request
        .post(apis.sms.postSmsSingle, qs.stringify(this.userInfo))
        .then(res => {
          if (res.data.code == 200) {
            this.$message.success("发送成功");
            return;
          }
          this.$message.error(res.data.message);
        })
        .catch(err => {});
    },
    /**
     *  分页
     */
    handleCurrentChange(val) {
      this.queryParams.currentPage = val;
      this.getTableData();
    },
    handleSizeChange(val) {
      this.queryParams.pageSize = val;
      this.handleCurrentChange(1);
    }
    //
  }
};
</script>

<style lang="scss" scoped>
.draft-view-mgt {
  /deep/ .el-card__body {
    padding-bottom: 15px !important;
  }
  .main-panel {
    height: calc(100vh - 160px);
    /deep/ .el-card__body {
      padding: 20px;
    }
  }
}
</style>