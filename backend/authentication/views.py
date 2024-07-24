import json
import subprocess
from django.shortcuts import render
from rest_framework import viewsets
from datetime import datetime, timedelta
from rest_framework.response import Response
from rest_framework.decorators import action, api_view, permission_classes, authentication_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken
from rest_framework_simplejwt.authentication import JWTAuthentication

from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.core.mail import send_mail, EmailMultiAlternatives
from healthconnect import settings
import git
import os
import logging
from threading import Thread

from .models import *
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import *
from rest_framework import status

from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.contrib.auth import get_user_model
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from six import text_type
from django.contrib.sites.shortcuts import get_current_site  
from django.utils.encoding import force_bytes, force_str
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode  
# Create your views here.
class TokenGenerator(PasswordResetTokenGenerator):  
    def _make_hash_value(self, user, timestamp):  
        return (  
            text_type(user.pk) + text_type(timestamp)
        )  
generate_token = TokenGenerator()


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

@api_view(['GET', 'OPTIONS'])
def activate(request, uidb64, token):  
    User = get_user_model()
    try:  
        uid = force_str(urlsafe_base64_decode(uidb64))  
        user = User.objects.get(pk=uid)  
    except(TypeError, ValueError, OverflowError, User.DoesNotExist):  
        user = None
    if user is not None and generate_token.check_token(user, token):  
        user.is_active = True  
        user.save()  
        return Response({'success': 'Account activated successfully.'}, status=200)
    else:  
        return Response({'error': 'Invalid activation link.'}, status=400)


# Create your views here.
@api_view(['POST', 'OPTIONS'])
@authentication_classes([])
def register(request):
    """
    Register a new user.

    Args:
        request (Request): The request object containing user data.

    Returns:
        Response: A response object with success or error message.
    """
    if request.method == 'POST':
        user_data = request.data.copy()
        if 'first_name' not in user_data or 'last_name' not in user_data or 'email' not in user_data or 'password' not in user_data:
            return Response({'error': 'Missing required fields'}, status=400)
        
        user = User.objects.filter(email=user_data['email']).first()
        if user:
            return Response({'error': 'User already exists.'}, status=409)
        
        if not user_data.get('userRole'):
            user_data['userRole'] = UserRoleChoices.patient
        
        new_user = User(
            first_name=user_data['first_name'],
            last_name=user_data['last_name'],
            email=user_data['email'],
            user_role=user_data['userRole'],
            phone=user_data['phone'],
            gender=user_data['gender'],
            dob=user_data['dob'],
        )
        new_user.set_password(user_data['password'])
        
        new_user.save()

        # current_site = get_current_site(request)
        # subject = "Welcome to HealthConnect"
        # html_message = render_to_string('new-email.html', {  
        # 'user': new_user,  
        # 'domain': current_site.domain,  
        # 'uid':urlsafe_base64_encode(force_bytes(new_user.pk)),  
        # 'token':generate_token.make_token(new_user),  
        # })
        # plain_message = strip_tags(html_message)
        # email = EmailMultiAlternatives(
        #     from_email=settings.EMAIL_HOST_USER,
        #     to=[new_user.email],
        #     body=plain_message,
        #     subject=subject,
        # )
        # email.attach_alternative(html_message, 'text/html')
        # email.send()

        return Response({'message': 'User registered successfully', 'status': 201}, status=201)
