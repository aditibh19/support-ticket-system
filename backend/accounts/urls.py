# accounts/urls.py
from django.urls import path
from .views import RegisterView, LoginView

urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),  # POST /api/accounts/register/
    path("login/", LoginView.as_view(), name="login"),           # POST /api/accounts/login/
]