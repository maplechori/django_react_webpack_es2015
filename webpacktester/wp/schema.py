from graphene import relay, ObjectType, AbstractType, resolve_only_args
from graphene_django import DjangoObjectType
from graphene_django.filter import DjangoFilterConnectionField
from .models import Survey as SurveyModel
from .models import Section as SectionModel
from .models import Question as QuestionModel
from django.contrib.auth.models import User as UserModel
from graphene_django.debug import DjangoDebug

import django_filters
import graph_auth.schema
import graphene

def connection_for_type(_type):
    class Connection(graphene.Connection):
        total_count = graphene.Int()

        class Meta:
            name = _type._meta.name + 'Connection'
            node = _type

        def resolve_total_count(self, args, context, info):
            return self.length

    return Connection

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
        #filter_order_by = True

class Section(DjangoObjectType):
    class Meta:
        model = SectionModel
        interfaces = (relay.Node,)
        filter_fields = ['name'] #{ 'name' : ['exact', 'icontains']}
        #filter_order_by = True

    totalCount = graphene.Int()
    completedCount = graphene.Int()

    @staticmethod
    def resolve_totalCount(self, args, context, info):
        return SectionModel.objects.count()

    @staticmethod
    def resolve_completedCount(self, args, context, info):
        return SectionModel.objects.filter(completed=True).count()

#Section.Connection = connection_for_type(Section)
class Question(DjangoObjectType):

    class Meta:
        model = QuestionModel
        interfaces = (relay.Node,)
        filter_fields = { 'name' : ['exact', 'icontains']}

    #question_type = graphene.String()
    #question_type = graphene.Field(QuestionType)

    #@classmethod
    #def resolve_question_type(self, args, context, info, extra):
    #    print(args.question_type)
    #    return literal_eval(args.question_type)[0]

class AddQuestion(relay.ClientIDMutation):
    class Input:
        name = graphene.String(required=True)
        question_type = graphene.String(required=True)
        data_label = graphene.String(required=True)
        question_text = graphene.Int(required=True)

    @classmethod
    def mutate_and_get_payload(cls, input, context, info):

        question = QuestionModel()
        question.question_type = input.get('question_type')
        question.name = input.get('name')
        question.data_label = input.get('data_label')
        question.question_text = input.get('question_text')
        question.save()

        return AddQuestionMutation(question=question)

class SurveyMutation(graph_auth.schema.Mutation, graphene.ObjectType, AbstractType):
    add_question = AddQuestion.Field()



class SurveyQuery(graph_auth.schema.Query, graphene.ObjectType, AbstractType):
    node = relay.Node.Field()

    surveys = DjangoFilterConnectionField(Survey)
    survey = relay.Node.Field(Survey)

    questions = DjangoFilterConnectionField(Question)
    question = relay.Node.Field(Question)

    sections = DjangoFilterConnectionField(Section) #, filterset_class=SectionFilter)
    section = relay.Node.Field(Section)
    viewer = graphene.Field(lambda: SurveyQuery)

    @resolve_only_args
    def resolve_viewer(self):
        return get_view()

def get_view():
    return SurveyQuery
