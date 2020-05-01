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
        <el-col :span="6" align="right">
          <el-button type="primary" size="mini" @click="searchData">查询</el-button>
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
      <div class="m-20" align="right">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryParams.currentPage" :page-sizes="[10, 20, 30, 40,50]" :page-size="queryParams.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
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

      queryParams: {
        name: "",
        phone: "",
        status: "",
        currentPage: 1,
        pageSize: 10
      }
    };
  },
  created() {},
  methods: {
    /**
     *  表格数据
     */
    getTableData() {},
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
      console.log(111, row);
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