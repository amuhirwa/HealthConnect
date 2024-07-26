from django.urls import path
from . import views

urlpatterns = [
    path('get_random_match', views.random_match, name="get_random"),
]
