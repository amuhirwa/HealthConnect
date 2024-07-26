from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import *
from authentication.models import *
from authentication.serializers import DoctorProfileSerializer
from rest_framework import status

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
