from datetime import timedelta
from django.shortcuts import get_object_or_404, render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import *
from authentication.models import *
from authentication.serializers import DoctorProfileSerializer
from rest_framework import status
from .serializers import *
from django.utils import timezone
from authentication.views import generate_token
from django.contrib.sites.shortcuts import  get_current_site

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
    if request.user.user_role == UserRoleChoices.health_professional:
        appointments = Appointment.objects.filter(doctor=DoctorProfile.objects.filter(user=request.user)[1], completed=True)
    elif request.user.user_role == UserRoleChoices.patient:
        appointments = Appointment.objects.filter(patient=PatientProfile.objects.get(user=request.user), completed=True)
    else:
        appointments = Appointment.objects.filter(completed=True)
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
def update_appointment(request):
    print(request.data)
    id = request.data.get('id')
    appointment = Appointment.objects.get(id=id)
    if appointment.patient != PatientProfile.objects.get(user=request.user):
        return Response({'error': 'You are not authorized to update this appointment'}, status=status.HTTP_403_FORBIDDEN)
    
    if request.data.get('call_id'):
        appointment.call_id = request.data.get('call_id')
        appointment.save()
        return Response({'message': 'Call ID updated successfully'}, status=status.HTTP_200_OK)
    serializer = AppointmentSerializer(appointment, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST', 'OPTIONS'])
@permission_classes([IsAuthenticated])
def join_call(request):
    data = request.data
    patient_user = User.objects.get(id=data['patient'])
    doctor_user = User.objects.get(id=data['doctor'])
    print(data)
    print(doctor_user)
    patient = PatientProfile.objects.get(user=patient_user)
    doctor = DoctorProfile.objects.get(user=doctor_user, specialization=data['specialization'])
    if Appointment.objects.filter(patient=patient, doctor=doctor, completed=False, cancelled=False).exists():
        appointment = Appointment.objects.filter(patient=patient, doctor=doctor, completed=False, cancelled=False).first()
        return Response({'message': 'Call already created', 'call_id': appointment.call_id}, status=status.HTTP_200_OK)
    else:
        appointment = Appointment(start=timezone.now(), patient=patient, doctor=doctor)
    print(appointment.id)
    appointment.save()
    return Response({'message': 'Call created successfully', 'appointment_id': appointment.id}, status=status.HTTP_200_OK)

@api_view(['POST', 'OPTIONS'])
@permission_classes([IsAuthenticated])
def create_prescription(request):
    data = request.data
    appointment = Appointment.objects.get(id=data['appointment_id'])
    if appointment.doctor.user != request.user:
        return Response({'error': 'You are not authorized to create a prescription for this appointment'}, status=status.HTTP_403_FORBIDDEN)
    if Prescription.objects.filter(appointment=appointment).exists():
        return Response({'error': 'Prescription already exists for this appointment'}, status=status.HTTP_403_FORBIDDEN)
    prescription = Prescription(appointment=appointment, description=data.get('description'), prescription=data['prescription'], dosage=data.get('dosage'))
    prescription.save()
    unique_link = f"http://{get_current_site(request).domain}/api/appointments/{prescription.id}/{generate_token.make_token(prescription)}/invalidate"
    prescription.unique_link = unique_link
    prescription.save()
    appointment.prescription = prescription
    appointment.save()
    return Response({'message': 'Prescription created successfully', 'unique_link': unique_link}, status=status.HTTP_200_OK)

@api_view(['POST', 'OPTIONS'])
@permission_classes([IsAuthenticated])
def create_report(request):
    data = request.data
    appointment = Appointment.objects.get(id=data['appointment_id'])
    if appointment.doctor.user != request.user:
        return Response({'error': 'You are not authorized to create a report for this appointment'}, status=status.HTTP_403_FORBIDDEN)
    appointment.report = data['fullReport']
    appointment.diagnosis = data['diagnosis']
    appointment.save()
    return Response({'message': 'Report saved successfully'}, status=status.HTTP_200_OK)

@api_view(['GET', 'OPTIONS'])
def invalidate_prescription(request, id, token):
    prescription = get_object_or_404(Prescription, id=id)
    if generate_token.check_token(prescription, token) is False:
        return Response({'error': 'Invalid token'}, status=status.HTTP_403_FORBIDDEN)
    
    context = {
    'is_valid': prescription.valid,
    'prescription_id': prescription.id,
    'patient_name': prescription.appointment.patient,
    'doctor_name': prescription.appointment.doctor,
    'doctor_contact': prescription.appointment.doctor.user.email,
    'medication': prescription.prescription,
    'dosage': prescription.dosage,
    'issued_date': prescription.created_at,
    }

    if prescription.valid:
        prescription.valid = False
        prescription.save()
        return render(request, 'prescription_status.html', context)
    return render(request, 'prescription_status.html', context)
        
@api_view(['GET', 'OPTIONS'])
@permission_classes([IsAuthenticated])
def get_doctor_appointments(request, doctor_id):
    try:
        appointments = Appointment.objects.filter(doctor_id=doctor_id)
        serializer = AppointmentSerializer(appointments, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Appointment.DoesNotExist:
        return Response({"error": "No appointments found for the specified doctor."}, status=status.HTTP_404_NOT_FOUND)
