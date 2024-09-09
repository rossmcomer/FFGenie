//sleeperUser begin

export interface SleeperUser {
  user_id: string
  display_name: string
  avatar: string
  leagues: League[]
}

export interface League {
  league_id: string;
  name: string;
}

export interface SelectedRoster {
  players: string[]
}

export interface allPlayers {
  [key:string]: any
}

export type playersDetailed = any[]

//sleeperUser end

// teams.json begin

export interface TeamAbbreviation {
  name: string
  abbreviation: string
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
  over_under: number
  last_update: Date
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
  home_team: string,
  away_team: string,
  stadium: string,
  weather: WeatherResponse | string
}

type WeatherResponse = {
  coord: {
    lon: number
    lat: number
  }
  weather: {
    id: number
    main: string
    description: string
    icon: string
  }[];
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
  };
  visibility: number
  wind: {
    speed: number
    deg: number
    gust?: number
  }
  rain?: {
    '1h': number
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