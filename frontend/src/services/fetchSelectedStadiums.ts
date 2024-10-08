import stadiums from "../assets/stadiums.json"
import internationalGames from "../assets/internationalGames.json"
import type { ReducedGameInfo, Stadium, InternationalGame } from "../types"

const fetchSelectedStadiums = async (
    games: ReducedGameInfo[],
  ): Promise<Stadium[]> => {
    const weeklyStadiums = []
  
    for (const game of games) {
      const matchedInternationalGame = internationalGames.find(
        (internationalGame: InternationalGame) =>
          internationalGame.gameId === game.id,
      )
  
      if (matchedInternationalGame) {
        weeklyStadiums.push({
          home_team: matchedInternationalGame.home_team,
          away_team: matchedInternationalGame.away_team,
          stadium: matchedInternationalGame.stadium,
          lat: matchedInternationalGame.lat,
          lon: matchedInternationalGame.lon,
          dome: matchedInternationalGame.dome,
        })
      } else {
        const stadium = stadiums.find(
          (stadium) => stadium.team === game.home_team,
        )
        if (stadium) {
          weeklyStadiums.push({
            home_team: game.home_team,
            away_team: game.away_team,
            stadium: stadium.stadium,
            lat: stadium.lat,
            lon: stadium.lon,
            dome: stadium.dome,
          })
        }
      }
    }
  
    return weeklyStadiums
}

export default fetchSelectedStadiums