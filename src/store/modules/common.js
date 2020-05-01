import * as types from '../mutation-types.js'

//全局状态
const state = {
  username: '',
  password: '',
  tabData: [],
  treeData: [],
  token: '',
  typeOptions: []
}

//getters 
const getters = {
  username: state => {
    return state.username
  },
  password: state => {
    return state.password
  },
  tabData: state => {
    return state.tabData
  },
  treeData: state => {
    return state.treeData
  },
  token: state => {
    return state.token
  },
  typeOptions: state => {
    return state.typeOptions
  }
}

const mutations = {
  [types.SET_USERNAME](state, username) {
    state.username = username
  },
  [types.SET_PASSWORD](state, password) {
    state.password = password
  },
  [types.SET_TABDATA](state, tabData) {
    state.tabData = tabData
  },
  [types.SET_TREEDTA](state, treeData) {
    state.treeData = treeData
  },
  [types.SET_TOKEN](state, token) {
    state.token = token
  },
  [types.SET_TYPEOPTIONS](state, typeOptions) {
    state.typeOptions = typeOptions
  },
}

const actions = {
  // hideFooter(context) { //自定义触发mutations里函数的方法，context与store 实例具有相同方法和属性
  //   context.commit('hide');
  // },
  // showFooter(context) { //同上注释
  //   context.commit('show');
  // },
  // getNewNum(context, num) { //同上注释，num为要变化的形参
  //   context.commit('newNum', num)
  // }
};

export default {
  state,
  mutations,
  getters,
  actions
}