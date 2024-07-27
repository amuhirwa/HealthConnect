from django.db import models
from authentication.models import *
from django.utils import timezone

# Create your models here.
class Appointment(models.Model):
    """
    Model representing an appointment between a patient and a doctor.

    Attributes:
        id (Integer): The primary key and unique identifier of the appointment.
        start (DateTime): The start time of the appointment.
        call_id (String): The call ID of the appointment.
        report (String): The report of the appointment.
        diagnosis (String): The diagnosis of the appointment.
        patient (ForeignKey): The patient associated with the appointment.
        doctor (ForeignKey): The doctor associated with the appointment.
        completed (Boolean): Whether the appointment is completed or not.
        cancelled (Boolean): Whether the appointment is cancelled or not.
        created_at (DateTime): The date and time when the appointment was created.
    """
    start = models.DateTimeField(default=timezone.now)
    call_id = models.CharField(max_length=100, blank=True, null=True)
    report = models.TextField(blank=True, null=True)
    diagnosis = models.TextField(blank=True, null=True)
    patient = models.ForeignKey(PatientProfile, on_delete=models.CASCADE)
    doctor = models.ForeignKey(DoctorProfile, on_delete=models.CASCADE)
    completed = models.BooleanField(default=False)
    cancelled = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return str(f"Appointment between {self.patient} and Dr. {self.doctor}")

class Prescription(models.Model):
    """
    Model representing a prescription for an appointment.

    Attributes:
        id (Integer): The primary key and unique identifier of the prescription.
        description (String): The description of the prescription.
        created_at (DateTime): The date and time when the prescription was created.
        appointment (ForeignKey): The appointment associated with the prescription.
    """
    appointment = models.ForeignKey(Appointment, on_delete=models.CASCADE)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

