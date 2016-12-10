"""webpacktester URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.10/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import url, include
from django.contrib import admin
from graphene_django.views import GraphQLView
from django.views.decorators.csrf import csrf_exempt
from rest_framework_jwt.views import refresh_jwt_token
import json, re
from django.http import HttpResponse



class GraphQLView_Response(GraphQLView):

    def dispatch(request, *args, **kwargs):
        response = GraphQLView.dispatch(request, *args, **kwargs)

        if not isinstance(response, HttpResponse):
            content = json.loads(response.content.decode('utf-8'))

            if content and ('errors' in content):
                if "Authorization_Denied" in content['errors'][0]['message']:
                    return HttpResponse('401 Unauthorized', status=401)

        return response


urlpatterns = [
    url(r'^admin/', admin.site.urls),
    url(r'^', include('wp.urls')),
    url(r'^graphql', csrf_exempt(GraphQLView_Response.as_view(graphiql=True))),
    url(r'^jwt-refresh/', refresh_jwt_token)
]
