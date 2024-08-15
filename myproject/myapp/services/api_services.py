import requests

def get_teams_injuries_url():
    teams_url = "https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/teams"

    try:
        response = requests.get(teams_url)
        response.raise_for_status()
        data = response.json()
        teams_injuries_urls = [item['$ref'].split('?')[0].replace("seasons/2024/", "") + "/injuries?" + item['$ref'].split('?')[1] for item in data['items']]
        return teams_injuries_urls
    except requests.exceptions.RequestException as e:
        # Log the error and return an empty list or a message to the template
        print(f"Error fetching team injury urls: {e}")
        return []

def get_all_injuries():
    teams_injuries_urls = get_teams_injuries_url()
    all_injuries = []

    for injury_url in teams_injuries_urls:
        try:
            response = requests.get(injury_url)
            response.raise_for_status()
            injury_data = response.json()
            injury_links = [item["$ref"] for item in injury_data.get("items", [])]
            print(injury_links)
            # Add injury items to the all_injuries list
            all_injuries.extend(injury_links)
        except requests.exceptions.RequestException as e:
            print(f"Error fetching injury data for {injury_url}: {e}")
            continue

    return all_injuries