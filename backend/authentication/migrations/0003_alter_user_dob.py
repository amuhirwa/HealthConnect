# Generated by Django 5.0.6 on 2024-07-25 19:34

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('authentication', '0002_allergy_doctorprofile_patientprofile'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='dob',
            field=models.DateField(blank=True, null=True),
        ),
    ]
