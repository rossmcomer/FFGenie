import type { GameInfo, ReducedGameInfo } from "../types"

const getNflOdds = async () => {
  const response = await fetch(
    `https://api.the-odds-api.com/v4/sports/americanfootball_nfl/odds?apiKey=${import.meta.env.VITE_ODDS_API_KEY}&bookmakers=draftkings&markets=totals,spreads`,
  )
  const data: GameInfo[] = await response.json()
  const filteredData: GameInfo[] = data.filter((item) => item.bookmakers[0])

  if (data) {
    const reducedData: ReducedGameInfo[] = filteredData.map(
      (item: GameInfo) => ({
        id: item.id,
        home_team: item.home_team,
        away_team: item.away_team,
        commence_time: new Date(item.commence_time),
        last_update: new Date(item.bookmakers[0].last_update),
        over_under: item.bookmakers[0].markets?.[1]?.outcomes?.[0]?.point ?? 0,
        spread: item.bookmakers[0].markets?.[0]?.outcomes ?? {name: 'spread unavailable', price: 0, point: 0},
      }),
    )
    return reducedData
  }
}

export default { getNflOdds }
