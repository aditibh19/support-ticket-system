from django.contrib import admin
from django.contrib.auth.models import User
from django.contrib.auth.admin import UserAdmin

# optional: if you want custom admin, unregister first
# admin.site.unregister(User)
# admin.site.register(User, UserAdmin)