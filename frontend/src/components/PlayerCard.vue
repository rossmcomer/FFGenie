<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import teams from '../assets/teams.json'
import domeIcon from '../assets/dome-icon.png'
import type { PlayerDetailed, Weather, WeatherResponse, Stadium, TeamAbbreviation, ReducedGameInfo } from '../types'

const props = defineProps<{
    player: PlayerDetailed
    selectedWeather: Weather[]
    selectedStadiums: Stadium[]
    selectedGames: ReducedGameInfo[]
}>()

const team = ref<TeamAbbreviation | undefined>(undefined)
const stadium = ref<Stadium | undefined>(undefined)
const weather = ref<WeatherResponse | string | undefined>(undefined)
const odds = ref<ReducedGameInfo | undefined>(undefined)
const showWeatherModal = ref<Boolean>(false)
const showOddsModal = ref<Boolean>(false)

const getPlayerTeam = async (player: PlayerDetailed): Promise<TeamAbbreviation | undefined> => {
        const foundTeam = teams.find((team: TeamAbbreviation) => team.abbreviation === player.team)

        return foundTeam
}

const getPlayerStadium = async (): Promise<Stadium | undefined> => {
    return new Promise((resolve) => {
        if (!team.value) {
            resolve(undefined)
        } else {
            const foundStadium = props.selectedStadiums.find((stadium: Stadium) => 
                stadium.home_team === team.value?.name || stadium.away_team === team.value?.name
            )
            resolve(foundStadium)
        }
    })
}

const getWeatherForPlayer = async (): Promise<WeatherResponse | string | undefined> => {
    return new Promise((resolve) => {
        if (!team.value) {
            resolve(undefined)
        } else {
            const weatherForPlayer = props.selectedWeather.find(
                weather => 
                weather.home_team === team.value?.name || weather.away_team === team.value?.name
            )

            if (weatherForPlayer) {
                if (weatherForPlayer.dome) {
                    resolve('dome')
                } else {
                    resolve(weatherForPlayer.weather)
                }
            } else {
                resolve(undefined)
            }
        }
    })
}

const getOddsForPlayer = async (): Promise<ReducedGameInfo | undefined> => {
    const oddsForPlayer = props.selectedGames.find(
        game =>  game.home_team === team.value?.name || game.away_team === team.value?.name
        )

    return oddsForPlayer
}

onMounted(async () => {
    try {
        team.value = await getPlayerTeam(props.player)

        stadium.value = await getPlayerStadium()

        weather.value = await getWeatherForPlayer()

        odds.value = await getOddsForPlayer()
        
    } catch (error) {
    console.error('Error fetching data:', error)
    }
})

const isString = (data: WeatherResponse | string | undefined): data is string => {
    return typeof data === 'string'
}

const kelvinToFahrenheit = (kelvin: number): number => {
  return (kelvin - 273.15) * 9/5 + 32
}

const isHomeTeam = (homeTeam: TeamAbbreviation): Boolean => {
    if (homeTeam.name == team.value?.name) {
        return true
    }
    else return false
}

</script>

<template>
    <div v-if="team" class="playerCardContainer">
        <div class="playerCardHeader">
            <div class="playerPicContainer">
                <img :src="`https://sleepercdn.com/content/nfl/players/${player.player_id}.jpg`" class="playerPic"/>
            </div>
            <div class="playerDescription">
                <div>{{ player.full_name }}</div>
                <div class="positionAndTeam">
                    <div>{{ player.position }} /</div>
                    <div>&nbsp;{{ player.team }}</div>
                </div>
            </div>
            <div class="weatherAndOddsContainer">
                <img v-if="weather && !isString(weather)" 
                    :src="`http://openweathermap.org/img/wn/${weather.weather[0].icon}.png`" 
                    alt="Weather icon"
                    @mouseover="showWeatherModal = true"
                    @mouseleave="showWeatherModal = false">
                <div v-if="odds" class="oddsIcon"  
                    @mouseover="showOddsModal = true"
                    @mouseleave="showOddsModal = false">
                    O/U:{{ odds.over_under }}
                </div>
            </div>
        </div>
        <div v-if="odds && showOddsModal">
            <div>Start time:{{ odds.commence_time }}</div>
            <div>Home Team:{{ odds.home_team }}</div>
            <div>{{ odds.away_team }}</div>
            <div><i>last updated:</i>{{ odds.last_update }}</div>
        </div>
        <div v-if="showWeatherModal">
            <div v-if="weather && !isString(weather)" class="weatherContainer">
                <p v-if="stadium">@ {{ stadium?.stadium }}</p>
                <p>Temp: {{ Math.floor(kelvinToFahrenheit(weather.main.temp)) }}°F</p>
                <p>Descrtiption: {{ weather.weather[0].description }}</p>
                <p>Wind: {{ weather.wind.speed }} mph</p>
                <p>Cloud Coverage: {{ weather.clouds.all }}%</p>
            </div>
            <div v-if="weather === 'dome'" class="weatherContainer">
                <img :src="`${domeIcon}`" alt="Dome icon">
            </div>
        </div>
    </div>
</template>

<style scoped>
.playerCardContainer {
    background-color: rgba(10, 43, 16, 0.9);
    width: 350px;
    box-shadow: #000000 2px 2px 4px;
    min-height: 50px;
    margin:4px;
}

.playerCardHeader {
    display: flex;
    align-items: center;
}

.playerDescription {
    display:flex;
    flex-direction: column;
}

.positionAndTeam {
    display:flex
}

.playerPicContainer {
    width:60px;
    display:flex;
    justify-content: center;
    align-items: center;
}

.playerPic {
    height:40px;
    margin: 2px;
}

.weatherAndOddsContainer {
    display:flex;
    align-items: center;
}

.weatherContainer {
    width: 100%;
    z-index: 1000;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}
</style>
  