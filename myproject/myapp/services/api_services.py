import requests

def get_teams_url():
    teams_url = "https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/teams"

    try:
        response = requests.get(teams_url)
        response.raise_for_status()
        data = response.json()
        teams = [item['$ref'] for item in data['items']]

        print(data, "data")
    except requests.exceptions.RequestException as e:
        # Log the error and return an empty list or a message to the template
        print(f"Error fetching data: {e}")
        data = {}
        teams = []

    context = {
            'teams': teams,
        }