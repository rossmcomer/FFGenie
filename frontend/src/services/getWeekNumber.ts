import getNflState from "./getNflState"

const getWeekNumber = async (): Promise<number> => {
    try {
      const nflState = await getNflState()
      const weekNumber = nflState.week
      return weekNumber
    } catch (error) {
      console.error("Error fetching NFL state:", error)
      return -1
    }
  }

  export default getWeekNumber