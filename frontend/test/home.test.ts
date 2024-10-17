import { shallowMount } from "@vue/test-utils"
import { createStore } from "vuex"
import { beforeEach, describe, expect, it, vi } from "vitest"
import Home from '@/pages/home.vue'

describe("home.vue", () => {
    let store: any

    beforeEach(() => {
        store = createStore({
          state: {
            nflOdds: [],
            sleeperUser: {
              user_id: "",
              leagues: [],
              display_name: "",
              avatar: "",
            },
            selectedLeague: {
                league_id: "",
                name: "",
              },
            selectedRoster: {
              players: []
            },
            playersDetailed: [],
            weekNumber: 1,
            positions: ["QB", "RB", "WR", "TE", "K", "DEF"],
          },
          actions: {
            fetchSleeperUser: vi.fn(),
            fetchNflOdds: vi.fn(),
            setSelectedLeague: vi.fn(),
            fetchRosterFromLeague: vi.fn(),
            fetchAllPlayers: vi.fn(),
            fetchPlayerDetails: vi.fn(),
            getWeekNumber: vi.fn()
          },
        })
      })
})