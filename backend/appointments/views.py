from datetime import timedelta
from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import *
from authentication.models import *
from authentication.serializers import DoctorProfileSerializer
from rest_framework import status
from .serializers import *
from django.utils import timezone

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def random_match(request):
    specialty = request.data.get('specialty')

    if not specialty:
        return Response({'error': 'Specialty is required'}, status=status.HTTP_400_BAD_REQUEST)

    available_doctors = DoctorProfile.objects.filter(specialization=specialty, available=True)

    if not available_doctors.exists():
        return Response({'message': 'No available doctors'}, status=status.HTTP_404_NOT_FOUND)

    random_doctor = available_doctors.order_by('?').first()

    doctor_data = DoctorProfileSerializer(random_doctor).data

    return Response(doctor_data, status=status.HTTP_200_OK)

@api_view(['GET', 'OPTIONS'])
@permission_classes([IsAuthenticated])
def get_available_doctors(request):
    doctors = DoctorProfile.objects.filter(available=True)
    serializer = DoctorProfileSerializer(doctors, many=True)
    return Response(serializer.data)

@api_view(['GET', 'OPTIONS'])
@permission_classes([IsAuthenticated])
def get_upcoming_appointments(request):
    now = timezone.now()
    soon = now + timedelta(minutes=30)
    recent = now - timedelta(minutes=30)
    
    soon_appointments = Appointment.objects.filter(
        patient=PatientProfile.objects.get(user=request.user),
        start__gte=recent,
        start__lte=soon,
        completed=False,
        cancelled=False
    )
    
    other_upcoming_appointments = Appointment.objects.filter(
        patient=PatientProfile.objects.get(user=request.user),
        start__gt=soon,
        completed=False,
        cancelled=False
    )
    
    soon_serializer = AppointmentSerializer(soon_appointments, many=True)
    other_serializer = AppointmentSerializer(other_upcoming_appointments, many=True)
    
    return Response({
        'soon_appointments': soon_serializer.data,
        'other_upcoming_appointments': other_serializer.data
    })

@api_view(['GET', 'OPTIONS'])
@permission_classes([IsAuthenticated])
def get_past_appointments(request):
    appointments = Appointment.objects.filter(patient=PatientProfile.objects.get(user=request.user), start__lt=timezone.now(), completed=True)
    serializer = AppointmentSerializer(appointments, many=True)
    return Response(serializer.data)

@api_view(['POST', 'OPTIONS'])
@permission_classes([IsAuthenticated])
def create_appointment(request):
    serializer = AppointmentSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(patient=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PATCH', 'OPTIONS'])
@permission_classes([IsAuthenticated])
def cancel_appointment(request, id):
    appointment = Appointment.objects.get(id=id)
    if appointment.patient != PatientProfile.objects.get(user=request.user):
        return Response({'error': 'You are not authorized to cancel this appointment'}, status=status.HTTP_403_FORBIDDEN)
    appointment.cancelled = True
    appointment.save()
    return Response({'message': 'Appointment canceled successfully'}, status=status.HTTP_200_OK)

@api_view(['PATCH', 'OPTIONS'])
@permission_classes([IsAuthenticated])
def update_appointment(request, id):
    appointment = Appointment.objects.get(id=id)
    if appointment.patient != PatientProfile.objects.get(user=request.user):
        return Response({'error': 'You are not authorized to update this appointment'}, status=status.HTTP_403_FORBIDDEN)
    serializer = AppointmentSerializer(appointment, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)