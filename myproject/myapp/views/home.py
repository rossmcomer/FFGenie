import requests
from django.shortcuts import render
from ..services.api_services import get_nfl_teams, get_other_api_data

def home(request):
    
    return render(request, 'home.html')