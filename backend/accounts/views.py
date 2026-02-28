# accounts/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
from rest_framework.permissions import AllowAny  # <- add this

class RegisterView(APIView):
    permission_classes = [AllowAny]  # anyone can register

    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")

        if not email or not password:
            return Response({"error": "Email and password are required"}, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(username=email).exists():
            return Response({"error": "User already exists"}, status=status.HTTP_400_BAD_REQUEST)

        # Create the user
        user = User.objects.create_user(username=email, email=email, password=password)
        user.save()

        # Create token immediately
        token, _ = Token.objects.get_or_create(user=user)

        return Response({"token": token.key}, status=status.HTTP_201_CREATED)


class LoginView(APIView):
    permission_classes = [AllowAny]  # anyone can login

    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")

        if not email or not password:
            return Response({"error": "Email and password are required"}, status=status.HTTP_400_BAD_REQUEST)

        user = authenticate(username=email, password=password)
        if user is None:
            return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

        # Get or create token
        token, _ = Token.objects.get_or_create(user=user)
        return Response({"token": token.key}, status=status.HTTP_200_OK)