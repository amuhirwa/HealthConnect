from django.db import models
from authentication.models import *

# Create your models here.
class Appointment(models.Model):
    start = models.DateTimeField()
    report = models.TextField(blank=True)
    patient = models.ForeignKey(PatientProfile, on_delete=models.CASCADE)
    doctor = models.ForeignKey(DoctorProfile, on_delete=models.CASCADE)
    completed = models.BooleanField(default=False)
    cancelled = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return str(f"Appointment between {self.patient} and Dr. {self.doctor}")

class Prescription(models.Model):
    appointment = models.ForeignKey(Appointment, on_delete=models.CASCADE)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)