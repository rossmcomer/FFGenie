import { shallowMount, mount } from "@vue/test-utils"
import { createStore } from "vuex"
import { beforeEach, describe, expect, it, vi } from "vitest"
import Home from "../home.vue"

//Unit Tests, Snapshot tests, integration tests, mocking and spying, asynchronous tests

describe("home.vue", () => {
  let store: any
  let actions

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
        setSelectedLeague: vi.fn(),
        fetchRosterFromLeague: vi.fn(),
        fetchAllPlayers: vi.fn(),
        fetchPlayerDetails: vi.fn(),
        getWeekNumber: vi.fn(),
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
    vi.spyOn(store, 'dispatch')

    const wrapper = mount(Home, {
      global: {
        plugins: [store],
      },
    })

    await wrapper.find("input[name='usernameInput']").setValue("testUser")
    await wrapper.find('form').trigger('submit.prevent')

    // expect(fetchUser).toHaveBeenCalled()
    expect(store.dispatch).toHaveBeenCalledWith("fetchSleeperUser", "testUser")
    })
})
