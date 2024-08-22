from django.urls import path
from .views.players import players
from .views.watchlist import watchlist
from .views.register import register

urlpatterns = [
    path('api/players', players, name='players'),
]