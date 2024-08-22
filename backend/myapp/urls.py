from django.urls import path
from myapp import views

urlpatterns = [
    path('api/players/', views.players, name='players'),
]