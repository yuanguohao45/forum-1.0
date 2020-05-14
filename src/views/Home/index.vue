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
        <div class="date-img" v-for="(item,index) in dateOptions" :key="item.id" :class="clickIndex==index?'choose-bgc':''" @click="chooseDate(item,index)">
          <p class="month">
            {{item.date.slice(0,2)}}
          </p>
          <p class="day">
            {{item.date.slice(2,)}}
          </p>
        </div>
      </div>
      <div class="agenda">
        <div class="title border-b-1">上午议程</div>
        <div class="subject">
          <div class="topic">
            <p>{{chooseItem.amTopic}}</p>
            <p>{{chooseItem.amTime}}</p>
            <el-button size="mini" plain @click="handleViewLive">观看直播</el-button>
          </div>
        </div>
      </div>
      <div class="agenda">
        <div class="title border-b-1">下午议程</div>
        <div class="subject">
          <div class="topic">
            <p>{{chooseItem.bmTopic}}</p>
            <p>{{chooseItem.bmTime}}</p>
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
        <div class="swiper-container">
          <swiper ref="mySwiper" :options="swiperOptions">
            <swiper-slide v-for="item in imgOptions" :key="item.id">
              <img style="width:100%;" :src="item.url" alt="">
            </swiper-slide>
          </swiper>
          <div class="swiper-button-prev"></div>
          <div class="swiper-button-next"></div>
        </div>
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
import { Swiper, SwiperSlide, directive } from "vue-awesome-swiper";
import "swiper/css/swiper.css";

export default {
  name: "Home",
  components: {
    Swiper,
    SwiperSlide
  },
  directives: {
    swiper: directive
  },
  data() {
    return {
      swiperOptions: {
        observer: true, //修改swiper自己或子元素时，自动初始化swiper
        observeParents: true, //修改swiper的父元素时，自动初始化swiper
        loop: true,
        autoplay: {
          delay: 5000,
          disableOnInteraction: false
        },
        speed: 1000,
        slidesPerView: 3,
        spaceBetween: 1,
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
          hideOnClick: false, //点击slide时显示/隐藏按钮
          disabledClass: "my-button-disabled", //前进后退按钮不可用时的类名。
          hiddenClass: "my-button-hidden" //按钮隐藏时的Class
        }
      },
      imgOptions: [
        { id: "1", url: require("@/assets/image/u56_normal.png") },
        { id: "2", url: require("@/assets/image/u56_normal.png") },
        { id: "3", url: require("@/assets/image/u56_normal.png") },
        { id: "4", url: require("@/assets/image/u56_normal.png") },
        { id: "5", url: require("@/assets/image/u56_normal.png") }
      ],
      dateOptions: [
        {
          id: "1",
          date: "5月21日",
          amTopic: "主题演讲：电力大数据",
          amTime: "5月21日 9：00-13：00",
          bmTopic: "主题演讲：大数据应用",
          bmTime: "5月21日 14：00-16：00"
        },
        {
          id: "2",
          date: "5月22日",
          amTopic: "主题演讲：电力大数据",
          amTime: "5月22日 9：00-13：00",
          bmTopic: "主题演讲：大数据应用",
          bmTime: "5月22日 14：00-16：00"
        }
      ],
      clickIndex: 0,
      chooseItem: {}
    };
  },
  computed: {
    swiper() {
      return this.$refs.mySwiper.$swiper;
    }
  },
  created() {
    this.chooseItem = this.dateOptions[0];
  },
  mounted() {
    this.swiper.slideTo(1, 1000, false);
    //鼠标移出隐藏按钮，移入显示按钮
    // this.swiper.el.onmouseover = () => {
    //   this.swiper.navigation.$nextEl.removeClass("hide");
    //   this.swiper.navigation.$prevEl.removeClass("hide");
    // };
    // this.swiper.el.onmouseout = () => {
    //   this.swiper.navigation.$nextEl.addClass("hide");
    //   this.swiper.navigation.$prevEl.addClass("hide");
    // };
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
    handleViewLive() {},
    /**
     *  选择日期
     */
    chooseDate(row, index) {
      this.clickIndex = index;
      this.chooseItem = row;
    }
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
      height: 58px;
      width: 100%;
      display: flex;
      justify-content: space-around;
      background: url("../../assets/image/u28_normal.png") 100% 100%;
      .date-img {
        margin-top: 4px;
        border-radius: 50%;
        width: 50px;
        height: 50px;
        text-align: center;
        font-size: 16px;
        font-weight: 500;
        color: #fff;
        &:active {
          background-color: #3e88ff;
        }
        p {
          margin: 0;
          padding: 0;
        }
        .month {
          margin-top: 2px;
        }
      }
      .choose-bgc {
        background-color: #3994fd;
        box-shadow: inset 2px 2px 5px #1c74d3;
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
        background: url("../../assets/image/u28_normal.png") 100% 100%;
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
      .swiper-container {
        .swiper-button-next,
        .swiper-button-prev {
          position: absolute;
          top: 50%;
          outline: 0;
          transition: opacity 0.5s;
          &::after {
            font-size: 20px;
          }
        }
        .hide {
          opacity: 0;
        }
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
