import Vue from 'vue'
import Vuex from 'vuex'
import Api from '../services/Api'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    events: []
  },
  mutations: {
    setEvents (state, events) {
      state.events = events
    }
  },
  actions: {
    loadEvents ({ commit }) {
      const reqbody = {
        query: `
        query{
  events{
    _id
    title
    description
    date
  }
}
        `
      }
      return Api().post('/graphql', reqbody).then(result => {
        console.log(result.data.data.events)
        commit('setEvents', result.data.data.events)
        return result.data.data.events
      }).catch(err => {
        console.log(err)
        throw err
      })
    }
  },
  modules: {
  },
  getters: {
    loadEvents (state) {
      return state.events
    }
  }
})
