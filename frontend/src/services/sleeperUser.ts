const getSleeperUser = async () => {
//   const response = await fetch(`https://api.sleeper.app/v1/user/${username}`)
    const response = await fetch(`https://api.sleeper.app/v1/user/rosscomer`)
    const data = await response.json()
    const { avatar, display_name, user_id } = data
    return { avatar, display_name, user_id }
}

export default { getSleeperUser }