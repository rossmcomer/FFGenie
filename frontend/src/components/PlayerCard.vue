<script lang="ts" setup>
import { ref, onMounted, watch } from "vue"
import teams from "../assets/teams.json"
import domeIcon from "../assets/domeicon3-white.png"
import type {
  PlayerDetailed,
  Weather,
  WeatherResponse,
  Stadium,
  NflTeam,
  ReducedGameInfo,
} from "../types"

const props = defineProps<{
  player: PlayerDetailed
  selectedWeather: Weather[]
  selectedStadiums: Stadium[]
  selectedGames: ReducedGameInfo[]
  selectedWeek: number
}>()

const team = ref<NflTeam | undefined>(undefined)
const stadium = ref<Stadium | undefined>(undefined)
const weather = ref<WeatherResponse | string | undefined>(undefined)
const odds = ref<ReducedGameInfo | undefined>(undefined)
const showWeatherModal = ref<Boolean>(false)
const showOddsModal = ref<Boolean>(false)
const isByeWeek = ref<Boolean>(false)
const opponent = ref<NflTeam | undefined>(undefined)

const toggleWeatherModal = () => {
  showWeatherModal.value = !showWeatherModal.value
}

const toggleOddsModal = () => {
  showOddsModal.value = !showOddsModal.value
}

const getPlayerTeam = async (
  player: PlayerDetailed
): Promise<NflTeam | undefined> => {
  const foundTeam = teams.find(
    (team: NflTeam) => team.abbreviation === player.team,
  )

  return foundTeam
}

const setIsByeWeek = async (): Promise<Boolean> => {
  const team = teams.find(
    (team: NflTeam) => team.abbreviation === props.player.team,
  )
    return props.selectedWeek === team?.byeWeek
}

const getPlayerStadium = async (): Promise<Stadium | undefined> => {
  return new Promise((resolve) => {
    if (!team.value) {
      resolve(undefined)
    } else {
      const foundStadium = props.selectedStadiums.find(
        (stadium: Stadium) =>
          stadium.home_team === team.value?.name ||
          stadium.away_team === team.value?.name,
      )
      resolve(foundStadium)
    }
  })
}

const getWeatherForPlayer = async (): Promise<
  WeatherResponse | string | undefined
> => {
  return new Promise((resolve) => {
    if (!team.value) {
      resolve(undefined)
    } else {
      const weatherForPlayer = props.selectedWeather.find(
        (weather) =>
          weather.home_team === team.value?.name ||
          weather.away_team === team.value?.name,
      )

      if (weatherForPlayer) {
        if (weatherForPlayer.dome) {
          resolve("dome")
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
    (game) =>
      game.home_team === team.value?.name ||
      game.away_team === team.value?.name,
  )

  return oddsForPlayer
}

const getOpponent = (
  odds: ReducedGameInfo | undefined,
  playerTeam: NflTeam | undefined,
): NflTeam | undefined => {
  if (playerTeam?.name === odds?.home_team) {
    const awayTeam = teams.find((team) => team.name === odds?.away_team)
    return awayTeam
  }

  const homeTeam = teams.find((team) => team.name === odds?.home_team)

  return homeTeam
}

const fetchPlayerData = async () => {
  try {
    team.value = await getPlayerTeam(props.player)
    isByeWeek.value = await setIsByeWeek()
    if (!isByeWeek.value) {
    stadium.value = await getPlayerStadium()
    weather.value = await getWeatherForPlayer()
    odds.value = await getOddsForPlayer()
    opponent.value = getOpponent(odds.value, team.value)
    }
  } catch (error) {
    console.error("Error fetching data for playerCard states", error)
  }
}

onMounted(() => {
  fetchPlayerData()
})

watch(
  () => props.player,
  () => {
    fetchPlayerData()
  },
  { immediate: true },
)

const isString = (
  data: WeatherResponse | string | undefined,
): data is string => {
  return typeof data === "string"
}

const kelvinToFahrenheit = (kelvin: number): number => {
  return ((kelvin - 273.15) * 9) / 5 + 32
}

const formatDate = (dateString: Date | undefined): string | undefined => {
  if (dateString) {
    const date = new Date(dateString)

    const day = date.toLocaleDateString("en-US", { weekday: "short" })

    const time = date
      .toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      })
      .toLowerCase()

    return `${day} ${time}`
  }
}
</script>

<template>
  <div
    v-if="team"
    class="playerCardContainer"
    :style="`background-image: url(https://a.espncdn.com/i/teamlogos/nfl/500/${team.abbreviation}.png)`"
  >
    <div class="playerCardHeader">
      <div class="picAndDescriptionContainer">
        <div class="playerPicContainer">
          <img
            v-if="player.position !== 'DEF'"
            :src="`https://sleepercdn.com/content/nfl/players/${player.player_id}.jpg`"
            class="playerPic"
          />
          <img
            v-if="player.position == 'DEF'"
            :src="`https://a.espncdn.com/i/teamlogos/nfl/500/${team.abbreviation}.png`"
            class="playerPic"
          />
        </div>
        <div class="playerDescription">
          <div class="playerName">{{ player.full_name }}</div>
          <div class="positionAndTeam">
            <div class="position">{{ player.position }} /</div>
            <div>&nbsp;{{ player.team }}</div>
          </div>
        </div>
      </div>
      <div v-if="isByeWeek" class="weatherOpponentAndOddsContainer">BYE</div>
      <div v-else class="weatherOpponentAndOddsContainer">
        <div class="opponentContainer">
          <div style="font-size: 9px; text-align: center">
            {{ formatDate(odds?.commence_time) }}
          </div>
          <div
            v-if="opponent?.name === odds?.away_team && opponent?.name"
            style="font-size: 10px"
          >
            vs.
          </div>
          <div v-else-if="opponent?.name" style="font-size: 10px">@</div>
          <div v-else style="font-size: 14px">N/A</div>
          <div style="font-size: 10px">{{ opponent?.abbreviation }}</div>
        </div>
        <div>|</div>
        <div class="weatherIconContainer" 
          @mouseenter="showWeatherModal = true"
          @mouseleave="showWeatherModal = false"
          @click="toggleWeatherModal">
          <img
            v-if="weather && !isString(weather)"
            :src="`http://openweathermap.org/img/wn/${weather.weather[0].icon}.png`"
            alt="Weather icon"
          />
          <img
            v-else-if="weather === 'dome'"
            :src="`${domeIcon}`"
            alt="Dome icon"
            class="domeImg"
            @mouseenter="showWeatherModal = true"
            @mouseleave="showWeatherModal = false"
          />
          <div v-else>N/A</div>
        </div>
        <div>|</div>
        <div class="oddsIconContainer"
            @mouseenter="showOddsModal = true"
            @mouseleave="showOddsModal = false"
            @click="toggleOddsModal">
          <div
            v-if="odds"
            class="oddsIcon"
          >
            <div style="font-size: 10px">O/U</div>
            <div v-if="odds.over_under != 0">{{ odds.over_under }}</div>
          </div>
          <div v-else class="oddsIcon">N/A</div>
        </div>
    </div>
    </div>
    <div v-if="odds && showOddsModal" class="oddsModal">
      <div v-if="odds.spread[0].point < 0">
        {{ odds.spread[0].name }} {{ odds.spread[0].point }}
      </div>
      <div v-if="odds.spread[1].point < 0">
        {{ odds.spread[1].name }} {{ odds.spread[1].point }}
      </div>
      <div style="font-size: 10px">
        <i>last updated:</i>{{ formatDate(odds.last_update) }}
      </div>
    </div>
    <div v-if="showWeatherModal">
      <div v-if="weather && !isString(weather)" class="weatherModal">
        <p>Temp: {{ Math.floor(kelvinToFahrenheit(weather.main.temp)) }}°F</p>
        <p>Wind: {{ weather.wind.speed }} mph</p>
        <p>{{ weather.weather[0].description }}</p>
        <p>Cloud Coverage: {{ weather.clouds.all }}%</p>
        <p v-if="stadium">@ {{ stadium?.stadium }}</p>
      </div>
      <div v-if="weather === 'dome'" class="weatherModal">
        <p v-if="stadium">@ {{ stadium?.stadium }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.playerCardContainer {
  background-color: rgba(10, 43, 16, 0.9);
  width: 350px;
  box-shadow: #0000006c 1px 1px 10px;
  min-height: 50px;
  margin: 4px;
  display: flex;
  align-items: center;
  background-position: left;
  background-position: 33% center;
  background-size: 50%;
  background-repeat: no-repeat;
  background-blend-mode: soft-light;
  border-radius: 5px;
  box-sizing: border-box;
  position: relative;
  color: #ffffff;
  font-size: 14px;
}

.playerCardHeader {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  box-sizing: border-box;
}

.picAndDescriptionContainer {
  display: flex;
  align-items: center;
  width: 175px;
}

.playerDescription {
  display: flex;
  flex-direction: column;
}

.playerName {
  font-weight: 500;
}

.positionAndTeam {
  display: flex;
  font-size: 12px;
}

.playerPicContainer {
  width: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.playerPic {
  height: 40px;
  width: 60px;
  margin: 2px;
}

.weatherOpponentAndOddsContainer {
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  width: 175px;
  margin-right: 10px;
}

.opponentContainer {
  width: 70px;
  /* border: dotted #b1b1b1d0 2px; */
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: default;
  height: 40px;
  /* background-color: #50505096; */
}

.weatherIconContainer {
  width: 54px;
  /* border: dotted #b1b1b1d0 2px; */
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 40px;
  cursor: default;
  /* background-color: #50505096; */
}

.oddsIcon {
  width: 54px;
  height: 54px;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  /* border: dotted #b1b1b1d0 2px; */
  align-items: center;
  cursor: default;
  height: 40px;
}

.domeImg {
  width: 40px;
  fill: #ffffff;
}

.oddsModal,
.weatherModal {
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 10px;
  border-radius: 8px;
  z-index: 100;
  width: 350px;
  text-align: center;
  box-sizing: border-box;
}
</style>
