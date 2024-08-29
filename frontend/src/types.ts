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
  roster: string[]
  reserve: string[]
}

//sleeperUser end

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
  commence_time: Date
  home_team: string
  away_team: string
  over_under: number
  last_update: Date
}

//nflOdds service end