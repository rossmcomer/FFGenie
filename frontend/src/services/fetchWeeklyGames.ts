import { isWithinInterval, addDays, startOfDay } from "date-fns"
import type { ReducedGameInfo } from "../types"

const fetchWeeklyGames = async (
  week: number,
  nflOdds: ReducedGameInfo[],
): Promise<ReducedGameInfo[]> => {
  const seasonStartDate = new Date("2025-09-04T00:00:00Z")
  const startOfWeekDate = addDays(seasonStartDate, (week - 1) * 7)
  const endOfWeekDate = addDays(startOfWeekDate, 6)

  const filteredGames = nflOdds.filter((game: ReducedGameInfo) => {
    return isWithinInterval(game.commence_time, {
      start: startOfDay(startOfWeekDate),
      end: startOfDay(endOfWeekDate),
    })
  })

  return filteredGames
}

export default fetchWeeklyGames
