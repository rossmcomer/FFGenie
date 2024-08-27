import { createStore } from 'vuex'
import type { ReducedGameInfo } from './types'
import nflOddsService from "./services/nflOdds"

interface State {
    nflOdds: ReducedGameInfo[]
}

const store = createStore<State>({
    state () {
        return {
            nflOdds: []
        }
    },
    mutations: {
        setNflOdds(state, nflOdds: ReducedGameInfo[]) {
        state.nflOdds = nflOdds
        }
    },
    actions: {
        async fetchNflOdds({ state, commit }) {
            if (state.nflOdds.length > 0) {
                return
            }
            try {
                const response = await nflOddsService.getNflOdds()
                commit('setNflOdds', response)
                console.log('nflOdds state',state.nflOdds)
            } catch (error) {
                console.error('Failed to fetch NFL odds from DraftKings', error)
            }
        }
    }
    })
  
export default store