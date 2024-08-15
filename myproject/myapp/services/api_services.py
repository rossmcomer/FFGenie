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

def get_all_injuries_urls():
    teams_injuries_urls = get_teams_injuries_url()
    all_injuries_urls = []

    for injury_url in teams_injuries_urls:
        try:
            response = requests.get(injury_url)
            response.raise_for_status()
            team_injury_data = response.json()
            injury_links = [item["$ref"] for item in team_injury_data.get("items", [])]
            all_injuries_urls.extend(injury_links)
        except requests.exceptions.RequestException as e:
            print(f"Error fetching injury data for {injury_url}: {e}")
            continue

    return all_injuries_urls

def get_all_injuries_data():
    all_injuries_urls = get_all_injuries_urls()
    top_20_urls = all_injuries_urls[:20]
    all_injuries_data = []

    for injury_url in top_20_urls:
        try:
            response = requests.get(injury_url)
            response.raise_for_status()
            injury_data = response.json()
            all_injuries_data.append(injury_data)
        except requests.exceptions.RequestException as e:
            print(f"Error fetching injury data for {injury_url}: {e}")
            continue

    return all_injuries_data