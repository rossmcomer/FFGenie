const getSleeperUser = async (username: string) => {
    const response = await fetch(`https://api.sleeper.app/v1/user/${username}`)
    const data = await response.json()
    const { display_name, user_id } = data
    return { display_name, user_id }
}

export default { getSleeperUser }