import type { allPlayers, PlayerDetailed } from "../types"

const getSleeperUser = async (username: string) => {
  const response = await fetch(`https://api.sleeper.app/v1/user/${username}`)
  const data = await response.json()
  const { display_name, user_id, avatar } = data
  return { display_name, user_id, avatar, leagues: [] }
}

const getSleeperUserLeagues = async (userId: string) => {
  const response = await fetch(
    `https://api.sleeper.app/v1/user/${userId}/leagues/nfl/2024`,
  )
  const data = await response.json()
  const leagues = data.map((league: any) => ({
    league_id: league.league_id,
    name: league.name,
  }))
  return leagues
}

const getSleeperUserRosterFromLeague = async (
  userId: string,
  leagueId: string,
) => {
  const response = await fetch(
    `https://api.sleeper.app/v1/league/${leagueId}/rosters`,
  )
  const rosters = await response.json()
  const userRoster = rosters.find((team: any) => team.owner_id == userId)

  const { players } = userRoster
  return { players }
}

const getAllPlayersDetailed = async (
  players: string[],
  allPlayers: allPlayers,
) => {
  const data = allPlayers
  let allPlayersDetailed: any[] = []

  for (let i = 0; i < players.length; i++) {
    const playerToAdd = data[players[i]]
    allPlayersDetailed.push(playerToAdd)
  }

  const positionOrder: any = {
    QB: 1,
    RB: 2,
    WR: 3,
    TE: 4,
    K: 5,
    DEF: 6,
  }

  const sortedPlayersDetailed = allPlayersDetailed.sort(
    (a: PlayerDetailed, b: PlayerDetailed) => {
      const aPosition = positionOrder[a.position] || 7
      const bPosition = positionOrder[b.position] || 7
      return aPosition - bPosition
    },
  )

  return sortedPlayersDetailed
}

export default {
  getSleeperUser,
  getSleeperUserLeagues,
  getSleeperUserRosterFromLeague,
  getAllPlayersDetailed,
}
