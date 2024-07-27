from django.urls import path
from . import views

urlpatterns = [
    path('get_random_match', views.random_match, name="get_random"),
    path('get_available_doctors', views.get_available_doctors, name="get_available_doctors"),
    path('get_upcoming_appointments', views.get_upcoming_appointments, name="get_upcoming_appointments"),
    path('get_past_appointments', views.get_past_appointments, name="get_past_appointments"),
    path('create_appointment', views.create_appointment, name="create_appointment"),
    path('<int:id>/cancel', views.cancel_appointment, name="cancel_appointment"),
]
