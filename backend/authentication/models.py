from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.utils.translation import gettext_lazy as _

# Create your models here.
class UserManager(BaseUserManager):
    """Define a model manager for User model with no username field."""

    use_in_migrations = True

    def _create_user(self, email, password, **extra_fields):
        """Create and save a User with the given email and password."""
        if not email:
            raise ValueError('The given email must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, email, password, **extra_fields):
        """Create and save a regular User with the given email and password."""
        extra_fields.setdefault('is_staff', False)
        extra_fields.setdefault('is_superuser', False)
        return self._create_user(email, password, **extra_fields)

    def create_superuser(self, email, password, **extra_fields):
        """Create and save a SuperUser with the given email and password."""
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self._create_user(email, password, **extra_fields)


class UserRoleChoices(models.TextChoices):
    """
    Enum representing the roles of a user.

    Choices:
        waste_collector (String): The name of the Waste Collector role.
        house_user (String): The name of the Household User role.
        admin_user (String): The name of the Admin User role.
    """
    health_professional = "Health Professional"
    patient = "Patient"
    admin_user = "admin"

class GenderChoices(models.TextChoices):
    """
    Enum representing the genders of a user.

    Choices:
        male (String): The name of the Male gender.
        female (String): The name of the Female gender.
        other (String): The name of the Other gender.
    """
    male = "Male"
    female = "Female"
    other = "Other"
    

class User(AbstractUser):
    """
    Model representing a User.

    Attributes:
        id (Integer): The primary key and unique identifier of the user.
        email (String): The email of the user.
        phone_number (String): The phone number of the user.
        first_name (String): The first name of the user.
        last_name (String): The last name of the user.
        password (String): The password of the user.
        user_role (String): The role of the user.
        created_at (DateTime): The date and time when the user was created.
    """
    username = None
    USERNAME_FIELD = 'email'
    email = models.EmailField(_('email address'), unique=True)
    phone = models.CharField(max_length=20)
    REQUIRED_FIELDS = []      # No additional required fields
    user_role = models.CharField(max_length=20, choices=UserRoleChoices.choices, default=UserRoleChoices.patient)
    gender = models.CharField(max_length=10, choices=GenderChoices.choices)
    dob = models.DateField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    objects = UserManager()

    groups = models.ManyToManyField(
        'auth.Group',
        related_name='custom_user_set',
        blank=True,
        help_text=_(
            'The groups this user belongs to. A user will get all permissions '
            'granted to each of their groups.'
        ),
        verbose_name=_('groups'),
    )

    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='custom_user_set',
        blank=True,
        help_text=_('Specific permissions for this user.'),
        verbose_name=_('user permissions'),
    )

    def __str__(self):
        return self.first_name + " " + self.last_name


class Notification(models.Model):
    """
    Model representing a Notification.

    Attributes:
        id (Integer): The primary key and unique identifier of the notification.
        user (Relationship): Foreign key referencing the User.
        message (String): The message of the notification.
        seen (Boolean): The status of the notification (seen or not).
        created (DateTime): When the notification was created.
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    message = models.TextField()
    created = models.DateTimeField(auto_now_add=True)
    seen = models.BooleanField(default=False)

class DoctorProfile(models.Model):
    """
    Model representing a doctor profile.

    Attributes:
        id (Integer): The primary key and unique identifier of the doctor profile.
        user (Relationship): Foreign key referencing the User.
        specialization (String): The specialization of the doctor.
        available (Boolean): Whether the doctor is available or not.
        created_at (DateTime): The date and time when the doctor profile was created.
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    specialization = models.CharField(max_length=100)
    available = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Dr. {self.user.first_name}"
    
class Allergy(models.Model):
    """
    Model representing an allergy.

    Attributes:
        id (Integer): The primary key and unique identifier of the allergy.
        name (String): The name of the allergy.
        created_at (DateTime): The date and time when the allergy was created.
    """
    name = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class PatientProfile(models.Model):
    """
    Model representing a patient profile.

    Attributes:
        id (Integer): The primary key and unique identifier of the patient profile.
        user (Relationship): Foreign key referencing the User.
        weight (Float): The weight of the patient.
        height (Float): The height of the patient.
        blood_glucose (Float): The blood glucose level of the patient.
        blood_pressure (Float): The blood pressure of the patient.
        allergies (Relationship): The allergies of the patient.
        created_at (DateTime): The date and time when the patient profile was created.
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    weight = models.FloatField(blank=True, null=True)
    height = models.FloatField(blank=True, null=True)
    blood_glucose = models.FloatField(blank=True, null=True)
    blood_pressure = models.FloatField(blank=True, null=True)
    allergies = models.ManyToManyField(
        Allergy,
        related_name='user',
        blank=True,
        help_text=_('Specific allergies for this patient.'),
        verbose_name=_('allergies'),
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.first_name} {self.user.last_name}"
    