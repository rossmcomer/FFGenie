import { createStore } from 'vuex'
import type { ReducedGameInfo, SleeperUser } from './types'
import nflOddsService from "./services/nflOdds"
import sleeperUserService from "./services/sleeperUser"

interface State {
    nflOdds: ReducedGameInfo[]
    sleeperUser: SleeperUser
}

const store = createStore<State>({
    state () {
        return {
            nflOdds: [],
            sleeperUser: {
                user_id: '',
                display_name: ''
            } as SleeperUser
        }
    },
    mutations: {
        setNflOdds(state, nflOdds: ReducedGameInfo[]) {
        state.nflOdds = nflOdds
        },
        setSleeperUser(state, sleeperUser: SleeperUser) {
            state.sleeperUser = sleeperUser
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
            } catch (error) {
                console.error('Failed to fetch NFL odds from DraftKings', error)
            }
        },
        async fetchSleeperUser({ commit }, username: string) {
            try {
              const response = await sleeperUserService.getSleeperUser(username)
              commit('setSleeperUser', response)
            } catch (error) {
              console.error('Failed to fetch Sleeper user', error)
            }
          }
    }
    })
  
export default store