# from ..services.api_services import get_all_NFL_injuries
from django.shortcuts import render

def register(request):
    # all_injuries_data = get_all_NFL_injuries()

    # context = {
    #         'all_injuries_data': all_injuries_data
    #     }

    context = {
    }
    return render(request, 'register.html', context)