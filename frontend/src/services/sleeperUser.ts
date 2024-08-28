const getSleeperUser = async (username: string) => {
    const response = await fetch(`https://api.sleeper.app/v1/user/${username}`)
    const data = await response.json()
    const { display_name, user_id, avatar } = data
    return { display_name, user_id, avatar }
}

const getSleeperUserLeagues = async (userId: string) => {
    const response = await fetch(`https://api.sleeper.app/v1/user/${userId}/leagues/<sport>/2024`)
    const data = await response.json()
    const { league_id, avatar } = data
    return { league_id, avatar }
}

export default { getSleeperUser, getSleeperUserLeagues}