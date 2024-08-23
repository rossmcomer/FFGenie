from django.http import JsonResponse
from .controllers.injuries import get_all_injuries_data

def injuries(request):
    all_injuries_data = get_all_injuries_data()

    print(all_injuries_data[0])
    return JsonResponse({'all_injuries_data': all_injuries_data})