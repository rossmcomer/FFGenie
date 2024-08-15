import requests
from django.shortcuts import render
from ..services.api_services import get_teams_url

def home(request):
    teams= get_teams_url()

    context = {
            'teams': teams,
        }
    return render(request, 'home.html', context)