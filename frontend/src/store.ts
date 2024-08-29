import { createStore } from 'vuex'
import type { ReducedGameInfo, SleeperUser, SelectedRoster, League } from './types'
import nflOddsService from "./services/nflOdds"
import sleeperUserService from "./services/sleeperUser"

interface State {
    nflOdds: ReducedGameInfo[]
    sleeperUser: SleeperUser
    selectedRoster: SelectedRoster
}

const store = createStore<State>({
    state () {
        return {
            nflOdds: [] as ReducedGameInfo[],
            sleeperUser: {
                user_id: '',
                display_name: '',
                avatar:'',
                leagues:[]
            } as SleeperUser,
            selectedRoster: {
                roster: [],
                reserve: []
            } as SelectedRoster
        }
    },
    mutations: {
        setNflOdds(state, nflOdds: ReducedGameInfo[]) {
            state.nflOdds = nflOdds
        },
        setSleeperUser(state, sleeperUser: SleeperUser) {
            state.sleeperUser = sleeperUser
        },
        setSelectedRoster(state, selectedRoster: SelectedRoster) {
            state.selectedRoster = selectedRoster
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
              const leagues = await sleeperUserService.getSleeperUserLeagues(response.user_id)
              response.leagues= leagues
              commit('setSleeperUser', response)
            } catch (error) {
              console.error('Failed to fetch Sleeper user', error)
            }
        },
        async fetchRosterFromLeague({ commit }, { userId, leagueId }: { userId: string, leagueId: string }) {
            try {
              const response = await sleeperUserService.getSleeperUserRosterFromLeague(userId, leagueId)
              commit('setSelectedRoster', response)
              console.log(response)
            } catch (error) {
              console.error('Failed to fetch roster from league', error)
            }
        }
    }
    })
  
export default store