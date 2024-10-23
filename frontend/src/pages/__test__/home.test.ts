import { shallowMount, mount } from "@vue/test-utils"
import { createStore } from "vuex"
import { beforeEach, describe, expect, it, vi } from "vitest"
import Home from "../home.vue"

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
        fetchNflOdds: vi.fn(),
        setSelectedLeague({ commit }, league) {
          commit('setSelectedLeague', league);
        },
        fetchRosterFromLeague: vi.fn(),
        fetchAllPlayers: vi.fn(),
        fetchPlayerDetails: vi.fn(),
        getWeekNumber: vi.fn(),
      },
      mutations: {
        setSelectedLeague(state, league) {
          state.selectedLeague = league;
        }}
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
    vi.spyOn(store, 'dispatch')

    const wrapper = shallowMount(Home, {
      global: {
        plugins: [store],
      },
    })

    await wrapper.find("input[name='usernameInput']").setValue("testUser")
    await wrapper.find('form').trigger('submit.prevent')

    expect(store.dispatch).toHaveBeenCalledWith("fetchSleeperUser", "testUser")
    })

  it('shows a dropdown to select the league when the user is fetched', async () => {
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
    vi.spyOn(store, 'dispatch')

    store.state.sleeperUser = {
      user_id: "12345",
      leagues: [
        { league_id: "1", name: "League 1" },
        { league_id: "2", name: "League 2" },
      ],
      display_name: "testUser",
      avatar: "abcdefg12345",
    }

    const wrapper = mount(Home, {
      global: {
        plugins: [store],
      },
    })

    await wrapper.find("select[name='leagueSelector']").setValue(store.state.sleeperUser.leagues[0])

    expect(store.dispatch).toHaveBeenCalledWith("setSelectedLeague", {
      league_id: "1",
      name: "League 1",
    })

    expect(store.state.selectedLeague).toEqual({ league_id: "1", name: "League 1" })

    expect(store.dispatch).toHaveBeenCalledWith("fetchRosterFromLeague", {
      userId: "12345",
      leagueId: "1",
    })
  })
})
