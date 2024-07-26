from django.utils.timezone import make_aware, get_current_timezone
from django.contrib.auth import authenticate
import datetime
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import *

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    Custom serializer for obtaining JWT tokens.

    Attributes:
        username_field (str): The field used for authentication (email).
    """
    username_field = 'email'

    @classmethod
    def get_token(cls, user):
        """
        Customize the token to include additional user information.

        Args:
            user (User): The user for whom the token is generated.

        Returns:
            token (Token): The customized JWT token.
        """
        token = super().get_token(user)

        token['email'] = user.email
        token['user_role'] = user.user_role
        
        token['is_active'] = user.is_active
        token['is_staff'] = user.is_staff

        token['full_name'] = f"{user.first_name} {user.last_name}"
        
        

        return token

    def validate(self, attrs):
        """
        Validate user credentials and authenticate the user.

        Args:
            attrs (dict): The attributes containing the email and password.

        Returns:
            attrs (dict): The validated attributes.
        """
        # Take email from the input data
        email = attrs.get('email')
        password = attrs.get('password')

        if email and password:
            user = authenticate(request=self.context.get('request'),
                              email=email, password=password)
            print(User.objects.get(email=email))

            if not user:
                msg = 'Unable to authenticate with provided credentials.'
                raise serializers.ValidationError(msg, code='authorization')
        else:
            msg = 'Must include "email" and "password".'
            raise serializers.ValidationError(msg, code='authorization')

        attrs['user'] = user

        return super().validate(attrs)


class UserSerializer(serializers.ModelSerializer):
    """
    Serializer for User model.

    Meta:
        model (User): The User model.
        fields (list): The fields to include in the serialized data.
    """
    class Meta:
        model = User
        fields = '__all__'


class AllergySerializer(serializers.ModelSerializer):
    class Meta:
        model = Allergy
        fields = ['id', 'name']


class UserSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()

    def get_name(self, obj):
        if obj.user_role == UserRoleChoices.health_professional:
            return f"Dr. {obj.first_name} {obj.last_name}"
        return f"{obj.first_name} {obj.last_name}"

    class Meta:
        model = User
        fields = ['id', 'email', 'name', 'phone']


class PatientProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    allergies = AllergySerializer(many=True)


    class Meta:
        model = PatientProfile
        fields = ['id', 'user', 'weight', 'height', 'blood_glucose', 'blood_pressure', 'allergies']


class DoctorProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = DoctorProfile
        fields = ['id', 'user', 'specialization', 'available']
