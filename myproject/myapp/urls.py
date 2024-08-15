from django.urls import path
from .views.home import home
from .views.watchlist import watchlist
from .views.register import register

urlpatterns = [
    path('', home, name='home'),
    path('watchlist/', watchlist, name='watchlist'),
    path('register/', register, name='register'),
]