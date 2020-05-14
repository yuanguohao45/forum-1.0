<template>
  <div class="home">
    <!-- 头 -->
    <div class="header">
      <img src="@/assets/image/u4_normal.png" alt="">
    </div>
    <div class="content">
      <!-- 海报 -->
      <div class="poster">
        <img src="@/assets/image/u10_normal.png" alt="">
      </div>
      <div class="luck">
        <el-button size="mini" type="primary" v-show="showBtn" @click="handleLuckStart">开始抽奖</el-button>
        <div class="description" v-if="showCountDown">
          正在抽奖，请稍后。。。{{limitTime}}秒
        </div>
        <div class="luck-per" v-if="showTable">
          <div class="title">
            幸运观众
          </div>
          <div class="list">
            <table border="1" cellspacing="0">
              <tr>
                <td>序号</td>
                <td>姓名</td>
                <td>电话</td>
                <td>公司</td>
              </tr>
              <tr v-for="(item,index) in tableData" :key="item.id">
                <td>{{index+1}}</td>
                <td>{{item.name}}</td>
                <td>{{item.phone}}</td>
                <td>{{item.company}}</td>
              </tr>
            </table>
          </div>
        </div>
      </div>
      <!-- 伙伴支持 -->
      <div class="desc">
        <div class="title border-b-1">
          支持伙伴
        </div>
        <div class="guys">
          <img src="@/assets/image/u47_normal.png" alt="">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import qs from "qs";
import { apis } from "@/utils/apis";
import request from "@/utils/request";

export default {
  name: "Home",
  data() {
    return {
      tableData: [
        {
          id: "1",
          name: "水电费",
          phone: 12313213123,
          company: "所说的第三方"
        },
        {
          id: "2",
          name: "水电费",
          phone: 12313213123,
          company: "所说的第三方"
        },
        {
          id: "3",
          name: "水电费",
          phone: 12313213123,
          company: "所说的第三方"
        },
        {
          id: "4",
          name: "水电费",
          phone: 12313213123,
          company: "所说的第三方"
        },
        { id: "5", name: "水电费", phone: 12313213123, company: "所说的第三方" }
      ],
      showBtn: true,
      showCountDown: false,
      showTable: false,
      limitTime: 10,
      timer: null
    };
  },
  methods: {
    handleLuckStart() {
      this.showBtn = false;
      this.showCountDown = true;

      this.timer = setInterval(() => {
        if (this.limitTime > 0) {
          this.limitTime--;
        }
        if (this.limitTime == 0) {
          clearInterval(this.timer);
          this.showCountDown = false;
          this.showTable = true;
          this.getTableData();
        }
      }, 1000);
    },
    getTableData() {
      let json = {};
      request
        .post(apis.luckDraw.luckStart, json)
        .then(res => {
          if (res.data.code == 200) {
            this.tableData = res.data.data;
            return;
          }
          this.$message.error(res.data.message);
        })
        .catch(err => {});
    }
  }
};
</script>

<style lang="scss" scoped>
.home {
  height: 100vh;
  .border-b-1 {
    border-bottom: 1px solid #797979;
  }
  .header {
    display: flex;
    justify-content: space-between;
    img {
      height: 44px;
      width: 112px;
    }
    .v-line {
      flex: 1;
      line-height: 44px;
      .el-button {
        margin-right: 20px;
        width: 100px;
      }
    }
  }
  .content {
    height: calc(100vh - 44px);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .poster {
      width: 100vw;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .luck {
      text-align: center;
      .luck-per {
        .title {
          font-size: 20px;
        }
        .list {
          display: flex;
          justify-content: center;
        }
      }
    }
    .desc {
      font-weight: 500;
      border-top: 1px solid #797979;
      .title {
        text-align: center;
        font-size: 20px;
        line-height: 35px;
      }
      .guys {
        height: 175px;
        img {
          width: 100vw;
          height: 100%;
        }
      }
    }
  }
}
</style>