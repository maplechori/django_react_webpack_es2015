from graphene import relay, ObjectType, AbstractType
from graphene_django import DjangoObjectType
from graphene_django.filter import DjangoFilterConnectionField
import django_filters
from .models import Survey as SurveyModel
from .models import Section as SectionModel
from .models import Question as QuestionModel

import graphene

class Survey(DjangoObjectType):
    class Meta:
        model = SurveyModel
        interfaces = (relay.Node,)
        filter_fields = { 'name' : ['exact', 'icontains']}

    @staticmethod
    def to_global_id(type, id):
        return '{}:{}'.format(type, id)

class SectionFilter(django_filters.FilterSet):
    # Do case-insensitive lookups on 'name'
    name = django_filters.CharFilter(lookup_type='icontains')


    class Meta:
        model = SectionModel
        fields = ['name']
        filter_order_by = True

class Section(DjangoObjectType):
    class Meta:
        model = SectionModel
        interfaces = (relay.Node,)
        filter_fields = ['name'] #{ 'name' : ['exact', 'icontains']}
        filter_order_by = True

    @staticmethod
    def to_global_id(type, id):
        return '{}:{}'.format(type, id)


class Question(DjangoObjectType):
    class Meta:
        model = QuestionModel
        interfaces = (relay.Node,)
        filter_fields = { 'name' : ['exact', 'icontains']}

    @staticmethod
    def to_global_id(type, id):
        return '{}:{}'.format(type, id)


class SurveyQuery(graphene.ObjectType, AbstractType):
    node = relay.Node.Field()

    surveys = DjangoFilterConnectionField(Survey)
    survey = relay.Node.Field(Survey)

    questions = DjangoFilterConnectionField(Question)
    question = relay.Node.Field(Question)

    sections = DjangoFilterConnectionField(Section) #, filterset_class=SectionFilter)
    section = relay.Node.Field(Section)
