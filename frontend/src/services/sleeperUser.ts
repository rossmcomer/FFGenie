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

const getAllPlayersFromRoster = async (roster: string[], reserve: string[]) => {
    const response = await fetch (`https://api.sleeper.app/v1/players/nfl`)
    const data = await response.json()
    let players: {[key: string]: any} = {}
    for(let i=0; i<roster.length; i++){
        const playerToAdd = data.roster[i]
        players[roster[i]] = playerToAdd
    }
    for (let i = 0; i < reserve.length; i++) {
        const playerToAdd = data[reserve[i]]
        if (playerToAdd) {
            players[reserve[i]] = playerToAdd
        }
    }
    return players
}

export default { getSleeperUser, getSleeperUserLeagues, getSleeperUserRosterFromLeague, getAllPlayersFromRoster }