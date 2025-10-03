//sleeperUser begin

export interface SleeperUser {
  user_id: string
  display_name: string
  avatar: string
  leagues: League[]
}

export interface League {
  league_id: string
  name: string
}

export interface SelectedRoster {
  players: string[]
}

export interface allPlayers {
  [key: string]: any
}

export type PlayerDetailed = {
  hashtag: string
  depth_chart_position: number
  status: string
  sport: string
  fantasy_positions: string[]
  number: number
  search_last_name: string
  injury_start_date: string | null
  weight: string
  position: string
  practice_participation: string | null
  sportradar_id: string
  team: string
  last_name: string
  college: string
  fantasy_data_id: number
  injury_status: string | null
  full_name: string
  player_id: string
  height: string
  search_full_name: string
  age: number
  stats_id: string
  birth_country: string
  espn_id: string
  search_rank: number
  first_name: string
  depth_chart_order: number
  years_exp: number
  rotowire_id: number | null
  rotoworld_id: number
  search_first_name: string
  yahoo_id: number | null
}

export type PlayersDetailed = PlayerDetailed[]

//sleeperUser end

// teams.json begin

export interface NflTeam {
  name: string
  abbreviation: string
  byeWeek: number
}
// teams.json end

//nflOdds service begin

export interface Outcome {
  name: string
  price: number
  point: number
}

export interface Market {
  key: string
  last_update: string
  outcomes: Outcome[]
}

export interface Bookmaker {
  key: string
  title: string
  last_update: string
  markets: Market[]
}

export interface GameInfo {
  id: string
  sport_key: string
  sport_title: string
  commence_time: string
  home_team: string
  away_team: string
  bookmakers: Bookmaker[]
}

export interface ReducedGameInfo {
  id: string
  commence_time: Date
  home_team: string
  away_team: string
  last_update: Date
  over_under: number
  spread: Outcome[]
}

//nflOdds service end

//stadiums start

export interface InternationalGame {
  gameId: string
  home_team: string
  away_team: string
  stadium: string
  lat: number
  lon: number
  dome: Boolean
}

export interface Stadium {
  home_team: string
  away_team: string
  stadium: string
  lat: number
  lon: number
  dome: Boolean
}

//stadiums end

//weather start

export interface Weather {
  home_team: string
  away_team: string
  stadium: string
  weather: WeatherResponse
  dome?: Boolean
}

export type WeatherResponse = {
  coord: {
    lon: number
    lat: number
  }
  weather: {
    id: number
    main: string
    description: string
    icon: string
  }[]
  base: string
  main: {
    temp: number
    feels_like: number
    temp_min: number
    temp_max: number
    pressure: number
    humidity: number
    sea_level?: number
    grnd_level?: number
  }
  visibility: number
  wind: {
    speed: number
    deg: number
    gust?: number
  }
  rain?: {
    "1h": number
  }
  clouds: {
    all: number
  }
  dt: number
  sys: {
    type: number
    id: number
    country: string
    sunrise: number
    sunset: number
  }
  timezone: number
  id: number
  name: string
  cod: number
}
//weather end

//analytics start
export interface PositionData {
  position: string
  mean: number
  median: number
  min: number
  max: number
  stdDev?: number
}
//analytics end
