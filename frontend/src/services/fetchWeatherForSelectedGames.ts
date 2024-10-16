import type { ReducedGameInfo, Stadium, Weather } from "../types"
import weatherService from "./weather"

const fetchWeatherForSelectedGames = async (
  selectedGames: ReducedGameInfo[],
  selectedStadiums: Stadium[],
): Promise<Weather[]> => {
  const weatherData = await Promise.all(
    selectedGames.map(async (game: ReducedGameInfo) => {
      const stadium = selectedStadiums.find(
        (stadium) => stadium.home_team === game.home_team,
      )

      if (stadium && !stadium.dome) {
        try {
          const weather = await weatherService.getWeather(stadium)

          return {
            home_team: game.home_team,
            away_team: game.away_team,
            stadium: stadium.stadium,
            weather,
          }
        } catch (error) {
          console.error(
            `Error fetching weather for game ${game.home_team} vs ${game.away_team}:`,
            error,
          )
          return null
        }
      } else if (stadium) {
        return {
          home_team: game.home_team,
          away_team: game.away_team,
          stadium: stadium.stadium,
          weather: null,
          dome: true,
        }
      } else {
        return null
      }
    }),
  )
  const weather = weatherData.filter((data) => data !== null) as Weather[]

  return weather
}

export default fetchWeatherForSelectedGames
