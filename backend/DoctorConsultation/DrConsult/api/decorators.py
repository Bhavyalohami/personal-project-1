from django.http import HttpResponseForbidden
from functools import wraps

def superuser_required(view_func):
    @wraps(view_func)
    def _wrapped_view(request, *args, **kwargs):
        print(request.user.is_superuser)
        print(request.user.is_authenticated)
        if request.user.is_authenticated and request.user.is_superuser:
            return view_func(request, *args, **kwargs)  
        else:
            return HttpResponseForbidden("You do not have permission to access this page.")  # Deny access

    return _wrapped_view