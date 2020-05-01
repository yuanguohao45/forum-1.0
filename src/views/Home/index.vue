<template>
  <div class="home">
    <!-- 头 -->
    <div class="header">
      <img src="@/assets/image/u4_normal.png" alt="">
      <div class="v-line" align="right">
        <el-button size="mini" plain @click="handlePreOrder">预约报名</el-button>
      </div>
    </div>
    <!-- 海报 -->
    <div class="poster">
      <img src="@/assets/image/u10_normal.png" alt="">
    </div>
    <!-- 论坛说明 -->
    <div class="desc">
      <div class="title border-b-1">高峰论坛</div>
      <div class="content border-b-1">
        对数字经济的影响，国家大数据战略在电力行业的实施路径和发展思路，分享和交流电力行业在大数据理论、技术、安全、治理和应用等方面的创新成果和实践经验，探讨电力行业新时代视野下如何发挥大数据的创新驱动力，打造国家电网公司主导的电力大数据生态圈，拓展数字蓝海市场，推动电力行业数字化转型升级。
      </div>
    </div>
    <!-- 直播区 -->
    <div class="desc">
      <div class="title border-b-1">高峰直播</div>
      <div class="date">
        <img src="@/assets/image/u49_normal.png" alt="">
      </div>
      <div class="agenda">
        <div class="title border-b-1">上午议程</div>
        <div class="subject">
          <div class="topic">
            <p>主题演讲：电力大数据</p>
            <p>5月21日 9：00-13：00</p>
            <el-button size="mini" plain @click="handleViewLive">观看直播</el-button>
          </div>
        </div>
      </div>
      <div class="agenda">
        <div class="title border-b-1">下午议程</div>
        <div class="subject">
          <div class="topic">
            <p>主题演讲：大数据应用</p>
            <p>5月21日 14：00-16：00</p>
            <el-button size="mini" plain @click="handleViewLive">观看直播</el-button>
          </div>
        </div>
      </div>
    </div>
    <!-- 专家 -->
    <div class="desc">
      <div class="title border-b-1">
        专家介绍
      </div>
      <div class="expert">
        <img src="@/assets/image/u56_normal.png" alt="">
        <img src="@/assets/image/u56_normal.png" alt="">
      </div>
    </div>
    <!-- 线上展区 -->
    <div class="desc">
      <div class="title border-b-1">
        线上展区
      </div>
      <div class="online">
        <img src="@/assets/image/u64_normal.png" alt="">
      </div>
    </div>
    <!-- 伙伴支持 -->
    <div class="desc">
      <div class="title border-b-1">
        伙伴支持
      </div>
      <div class="guys">
        <img src="@/assets/image/u47_normal.png" alt="">
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {};
  },
  methods: {
    /**
     *  预约报名
     */
    handlePreOrder() {
      this.$router.push({
        name: "PreOrder"
      });
    },
    /**
     *  观看直播
     */
    handleViewLive() {}
  }
};
</script>

<style lang="scss" scoped>
.home {
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
  .poster {
    width: 100vw;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .desc {
    font-weight: 500;
    .title {
      text-align: center;
      font-size: 20px;
      line-height: 35px;
    }
    .content {
      padding: 4px 3px 4px 4px;
      font-size: 16px;
    }
    .date {
      img {
        width: 100%;
        height: 58px;
      }
    }
    .agenda {
      font-size: 16px;
      font-weight: 500;
      .title {
        font-size: 16px;
        line-height: 25px;
        border: none;
      }
      .subject {
        height: 141px;
        width: 100vw;
        background: url("../../assets/image/u28_normal.png") no-repeat 100% 100%;
        position: relative;
        .topic {
          position: absolute;
          top: 20px;
          left: 50px;
          text-align: center;
          color: #fff;
          p {
            margin: 0;
            padding: 0;
            margin-bottom: 10px;
          }
        }
      }
    }
    .expert {
      width: 100vw;
      display: flex;
      justify-content: space-between;
      img {
        width: 49.8%;
      }
    }
    .online {
      img {
        width: 100%;
      }
    }
    .guys {
      height: 100px;
      img {
        width: 100vw;
        height: 100%;
      }
    }
  }
}
</style>