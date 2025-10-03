import { readFile, writeFile } from "fs/promises" // Use fs/promises to work with async/await

// Input and output file names
const inputFile = "playerADP2024PPR.json" // Change this to the actual ADP file
const outputFile = "player_points_data.json" // This is where the updated player data will go

async function updatePlayersWithADP() {
  try {
    // Read the ADP data from the input file
    const adpData = await readFile(inputFile, "utf8")

    // Parse ADP data into a dictionary (name -> adp)
    const adpMap = {}
    adpData.split("\n").forEach((line) => {
      line = line.trim()
      if (!line) return // Skip empty lines

      const parts = line.split("\t") // Split by tab character
      if (parts.length !== 2) return // Skip invalid lines

      let [adp, name] = parts
      adp = parseFloat(adp)
      if (!isNaN(adp)) {
        adpMap[name] = adp
      }
    })

    // Read the player data from the output file
    const jsonData = await readFile(outputFile, "utf8")
    let players = JSON.parse(jsonData)

    // Update players with ADP values if found in adpMap
    players = players.map((player) => {
      if (adpMap[player.name]) {
        return { ...player, adp: adpMap[player.name] }
      }
      return player
    })

    // Write the updated player data back to the output file
    await writeFile(outputFile, JSON.stringify(players, null, 4), "utf8")

    console.log(`Updated '${outputFile}' with ADP values successfully!`)
  } catch (err) {
    console.error("Error:", err)
  }
}

updatePlayersWithADP()
