from ..services.api_services import get_all_NFL_injuries

def register(request):
    all_injuries_data = get_all_NFL_injuries()

    context = {
            'all_injuries_data': all_injuries_data
        }
    return render(request, 'register.html', context)