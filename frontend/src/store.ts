import { createStore } from 'vuex'
// import injuriesService from '../services/injuries'

interface State {
    injuries: any[]
}

const store = createStore<State>({
state () {
    return {
        injuries: []
    }
},
mutations: {
    setInjuries(state, injuries: any[]) {
    state.injuries = injuries
    }
},
actions: {
    async fetchInjuries({ commit }) {
    const response = await fetch('/api/injuries')
    const data = await response.json()
    commit('setInjuries', data)
    }
}
})
  
  export default store