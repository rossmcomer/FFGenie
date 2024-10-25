import { shallowMount } from "@vue/test-utils"
import { createStore } from "vuex"
import { beforeEach, describe, expect, it, vi } from "vitest"
import Home from "../home.vue"
import PlayerCard from "../../components/PlayerCard.vue"

//Unit Tests, Snapshot tests, integration tests, mocking and spying, asynchronous tests

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
          players: [],
        },
        playersDetailed: [],
        weekNumber: 1,
        positions: ["QB", "RB", "WR", "TE", "K", "DEF"],
      },
      actions: {
        fetchUser: vi.fn(),
        fetchSleeperUser: vi.fn(),
        fetchNflOdds({ commit }, gameInfo) {
          commit("setNflOdds", gameInfo)
        },
        setSelectedLeague({ commit }, league) {
          commit("setSelectedLeague", league)
        },
        fetchRosterFromLeague: vi.fn(),
        fetchAllPlayers: vi.fn(),
        fetchPlayerDetails: vi.fn(),
        getWeekNumber({ commit }, weekNumber) {
          commit("setWeekNumber", weekNumber)
        },
      },
      mutations: {
        setSelectedLeague(state, league) {
          state.selectedLeague = league
        },
        setNflOdds(state, nflOdds) {
          state.nflOdds = nflOdds
        },
        setWeekNumber(state, weekNumber) {
          state.weekNumber = weekNumber
        },
      },
    })
  })

  it("renders the input box for Sleeper username", () => {
    const wrapper = shallowMount(Home, {
      global: {
        plugins: [store],
      },
    })

    const input = wrapper.find("input[name='usernameInput']")
    expect(input.exists()).toBe(true)
    expect(input.attributes("placeholder")).toBe("Sleeper username")
  })

  it("fetches the Sleeper user when the form is submitted", async () => {
    vi.spyOn(store, "dispatch")

    const wrapper = shallowMount(Home, {
      global: {
        plugins: [store],
      },
    })

    await wrapper.find("input[name='usernameInput']").setValue("testUser")
    await wrapper.find("form").trigger("submit.prevent")

    expect(store.dispatch).toHaveBeenCalledWith("fetchSleeperUser", "testUser")
  })

  it("shows a dropdown to select the league when the user is fetched", async () => {
    store.state.sleeperUser = {
      user_id: "12345",
      leagues: [
        { league_id: "1", name: "League 1" },
        { league_id: "2", name: "League 2" },
      ],
      display_name: "testUser",
      avatar: "abcdefg12345",
    }

    const wrapper = shallowMount(Home, {
      global: {
        plugins: [store],
      },
    })

    const dropdown = wrapper.find("select[name='leagueSelector']")
    expect(dropdown.exists()).toBe(true)
    expect(dropdown.findAll("option").length).toBe(3) // 2 leagues + 1 disabled
  })

  it("fetches the roster when a league is selected", async () => {
    vi.spyOn(store, "dispatch")

    store.state.sleeperUser = {
      user_id: "12345",
      leagues: [
        { league_id: "1", name: "League 1" },
        { league_id: "2", name: "League 2" },
      ],
      display_name: "testUser",
      avatar: "abcdefg12345",
    }

    const wrapper = shallowMount(Home, {
      global: {
        plugins: [store],
      },
    })

    await wrapper
      .find("select[name='leagueSelector']")
      .setValue(store.state.sleeperUser.leagues[0])

    expect(store.dispatch).toHaveBeenCalledWith("setSelectedLeague", {
      league_id: "1",
      name: "League 1",
    })

    expect(store.state.selectedLeague).toEqual({
      league_id: "1",
      name: "League 1",
    })

    expect(store.dispatch).toHaveBeenCalledWith("fetchRosterFromLeague", {
      userId: "12345",
      leagueId: "1",
    })
  })

  it("fetches weekNumber after NflOdds are fetched on mount", async () => {
    vi.spyOn(store, "dispatch")

    const wrapper = shallowMount(Home, {
      global: {
        plugins: [store],
      },
    })

    await store.dispatch("fetchNflOdds", [
      {
        id: "game123",
        commence_time: new Date("2024-11-10T18:30:00Z"),
        home_team: "Packers",
        away_team: "Bears",
        last_update: new Date("2024-11-10T12:00:00Z"),
        over_under: 45.5,
        spread: [
          {
            team: "Packers",
            odds: -110,
            point: -3.5,
          },
          {
            team: "Bears",
            odds: -110,
            point: 3.5,
          },
        ],
      },
    ])

    await wrapper.vm.$nextTick()

    expect(store.dispatch).toHaveBeenCalledWith("fetchNflOdds")
    expect(store.dispatch).toHaveBeenCalledWith("getWeekNumber")
  })

  it("renders the expected amount of PlayerCards", async () => {
    store.state.selectedRoster = { players: ["123", "234", "345"] }

    store.state.playersDetailed = [
      { id: "123", position: "QB" },
      { id: "234", position: "RB" },
      { id: "345", position: "WR" },
    ]

    const wrapper = shallowMount(Home, {
      global: {
        plugins: [store],
      },
    })

    await wrapper.vm.$nextTick()

    const playerCards = wrapper.findAllComponents(PlayerCard)

    expect(playerCards.length).toBe(3)
  })
})
