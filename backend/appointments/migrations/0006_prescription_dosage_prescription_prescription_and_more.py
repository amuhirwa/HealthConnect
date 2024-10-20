# Generated by Django 5.0.6 on 2024-07-29 11:06

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('appointments', '0005_appointment_call_id'),
    ]

    operations = [
        migrations.AddField(
            model_name='prescription',
            name='dosage',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='prescription',
            name='prescription',
            field=models.TextField(default='Medicine'),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='prescription',
            name='description',
            field=models.TextField(blank=True, null=True),
        ),
    ]
