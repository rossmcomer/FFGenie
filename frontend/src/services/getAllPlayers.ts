const getAllPlayers = async () => {
  const response = await fetch(`https://api.sleeper.app/v1/players/nfl`)
  const data = await response.json()

  return data
}

export default { getAllPlayers }
