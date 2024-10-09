import { createStore } from "vuex"
import type {
  ReducedGameInfo,
  SleeperUser,
  SelectedRoster,
  allPlayers,
  PlayersDetailed,
} from "./types"
import nflOddsService from "./services/nflOdds"
import sleeperUserService from "./services/sleeperUser"
import getAllPlayersService from "./services/getAllPlayers"

interface State {
  nflOdds: ReducedGameInfo[]
  sleeperUser: SleeperUser
  selectedRoster: SelectedRoster
  allPlayers: allPlayers
  playersDetailed: any[]
  weekNumber: Number
}

const store = createStore<State>({
  state() {
    return {
      nflOdds: [] as ReducedGameInfo[],
      sleeperUser: {
        user_id: "",
        display_name: "",
        avatar: "",
        leagues: [],
      } as SleeperUser,
      selectedRoster: {
        players: [],
      } as SelectedRoster,
      playersDetailed: [] as PlayersDetailed,
      allPlayers: {} as allPlayers,
      weekNumber: -1 as Number
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
    },
    setAllPlayers(state, allPlayers: allPlayers) {
      state.allPlayers = allPlayers
    },
    setPlayersDetailed(state, playersDetailed: PlayersDetailed) {
      state.playersDetailed = playersDetailed
    },
    setWeekNumber(state, weekNumber: Number) {
      state.weekNumber = weekNumber
    }
  },
  actions: {
    async fetchNflOdds({ state, commit }) {
      if (state.nflOdds.length > 0) {
        return
      }
      try {
        const response = await nflOddsService.getNflOdds()
        commit("setNflOdds", response)
      } catch (error) {
        console.error("Failed to fetch NFL odds from DraftKings", error)
      }
    },
    async fetchSleeperUser({ commit }, username: string) {
      try {
        commit("setSleeperUser", {
          user_id: "",
          display_name: "",
          avatar: "",
          leagues: [],
        })
        const response = await sleeperUserService.getSleeperUser(username)
        const leagues = await sleeperUserService.getSleeperUserLeagues(
          response.user_id,
        )
        response.leagues = leagues
        commit("setSleeperUser", response)
      } catch (error) {
        console.error("Failed to fetch Sleeper user", error)
      }
    },
    async fetchRosterFromLeague(
      { commit },
      { userId, leagueId }: { userId: string; leagueId: string },
    ) {
      try {
        const response =
          await sleeperUserService.getSleeperUserRosterFromLeague(
            userId,
            leagueId,
          )
        commit("setSelectedRoster", response)
      } catch (error) {
        console.error("Failed to fetch roster from league", error)
      }
    },
    async fetchAllPlayers({ commit }) {
      try {
        const response = await getAllPlayersService.getAllPlayers()
        commit("setAllPlayers", response)
      } catch (error) {
        console.error("Failed to fetch all NFL players", error)
      }
    },
    async fetchPlayerDetails(
      { commit, state },
      { players }: { players: string[] },
    ) {
      try {
        const allPlayers = state.allPlayers
        const response = await sleeperUserService.getAllPlayersDetailed(
          players,
          allPlayers,
        )
        commit("setPlayersDetailed", response)
      } catch (error) {
        console.error("Failed to fetch player details from roster", error)
      }
    },
    async getWeekNumber({ commit }) {
      try {
        const response = await fetch('https://api.sleeper.app/v1/state/nfl')
        const data = await response.json()
        const weekNumber = data.week
        commit('setWeekNumber', weekNumber)
      } catch (error) {
        console.error('Error fetching NFL state:', error)
        commit('setWeekNumber', -1)
      }
    },
  },
})

export default store
