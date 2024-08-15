import requests
from django.shortcuts import render
from ..services.api_services import get_teams_injuries_url, get_all_injuries

def home(request):
    teams_injuries_urls = get_teams_injuries_url()
    all_injuries = get_all_injuries()

    context = {
            'teams_injuries_urls': teams_injuries_urls,
            'all_injuries': all_injuries
        }
    return render(request, 'home.html', context)