from django.shortcuts import render
from ..services.api_services import get_all_NFL_injuries

def home(request):
    all_injuries_data = get_all_NFL_injuries()
    
    print(all_injuries_data[0])

    context = {
            'all_injuries_data': all_injuries_data
        }
    
    return render(request, 'home.html', context)