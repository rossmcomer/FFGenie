import type {allPlayers} from '../types'

const getSleeperUser = async (username: string) => {
    const response = await fetch(`https://api.sleeper.app/v1/user/${username}`)
    const data = await response.json()
    const { display_name, user_id, avatar } = data
    return { display_name, user_id, avatar, leagues:[] }
}

const getSleeperUserLeagues = async (userId: string) => {
    const response = await fetch(`https://api.sleeper.app/v1/user/${userId}/leagues/nfl/2024`)
    const data = await response.json()
    const leagues = data.map((league: any) => ({
        league_id: league.league_id,
        name: league.name
    }))
    return leagues
}

const getSleeperUserRosterFromLeague = async (userId: string, leagueId: string) => {
    const response = await fetch (`https://api.sleeper.app/v1/league/${leagueId}/rosters`)
    const rosters = await response.json()
    const userRoster = rosters.find((team: any) => team.owner_id == userId)
    const { players, reserve } = userRoster
    return { players, reserve }
}

const getAllPlayersDetailed = async (players: string[], reserve: string[], allPlayers: allPlayers) => {
    const data = allPlayers
    let allPlayersDetailed: any[] = []

    for (let i=0; i<players.length; i++) {
        const playerToAdd = data[players[i]]
        allPlayersDetailed.push(playerToAdd)
    }
    if (reserve) {
    for (let i = 0; i < reserve.length; i++) {
        const playerToAdd = data[reserve[i]]
        allPlayersDetailed.push(playerToAdd)
    }
    }
    console.log(allPlayersDetailed)
    return allPlayersDetailed
}

export default { getSleeperUser, getSleeperUserLeagues, getSleeperUserRosterFromLeague, getAllPlayersDetailed }