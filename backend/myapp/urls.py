from django.urls import path
from myapp import views

urlpatterns = [
    path('api/injuries/', views.injuries, name='injuries'),
]