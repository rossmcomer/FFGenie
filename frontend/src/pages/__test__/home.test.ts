import { shallowMount } from "@vue/test-utils"
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
    const wrapper = shallowMount(Home, {
      global: {
        plugins: [store],
      },
    })

    const fetchUserSpy = vi.spyOn(wrapper.vm, "fetchUser")
    const input = wrapper.find("input[name='usernameInput']")
    await input.setValue("testUser")

    await wrapper.find("form").trigger("submit.prevent")
    expect(fetchUserSpy).toHaveBeenCalled()
    expect(store.dispatch).toHaveBeenCalledWith("fetchSleeperUser", "testUser")
  })
})
