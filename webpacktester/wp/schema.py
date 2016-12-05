from graphene import relay, ObjectType, AbstractType, resolve_only_args
from graphene_django import DjangoObjectType
from graphene_django.filter import DjangoFilterConnectionField
from .models import Survey as SurveyModel
from .models import Section as SectionModel
from .models import Question as QuestionModel
from django.contrib.auth.models import User as UserModel
from graphene_django.debug import DjangoDebug
from graphql_relay.node.node import from_global_id, to_global_id

import django_filters
import graph_auth.schema
from graph_auth.schema import UserNode
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
class DeleteQuestion(relay.ClientIDMutation):

    class Input:
        id = graphene.String(required=True)

    viewer = graphene.Field(UserNode)
    questionId = graphene.String()

    @classmethod
    def mutate_and_get_payload(cls, input, context, info):
        global_id = input.get("id")
        id = from_global_id(global_id)[1]
        question = QuestionModel.objects.get(pk=id)
        viewer = question.created_by
        question.delete()
        return DeleteQuestion(viewer=viewer, questionId=global_id)


class AddQuestion(relay.ClientIDMutation):

    class Input:
        name = graphene.String(required=True)
        question_type = graphene.Int(required=True)
        data_label = graphene.String(required=True)
        question_text = graphene.String(required=True)

    viewer = graphene.Field(UserNode)
    questionEdge = graphene.Field(Question.Connection.Edge)



    @classmethod
    def mutate_and_get_payload(cls, input, context, info):
        question = QuestionModel()
        question.question_type = input.get('question_type')
        question.name = input.get('name')
        question.data_label = input.get('data_label')
        question.question_text = input.get('question_text')
        viewer = UserModel.objects.get(id=4)
        question.created_by = viewer
        question.save()
        viewer = UserModel.objects.get(id=4)
        viewer.questions.add(question)
        viewer.save()
        edge = Question.Connection.Edge(node=question, cursor=0)


        return AddQuestion(viewer=viewer, questionEdge=edge)

class SurveyMutation(graph_auth.schema.Mutation, graphene.ObjectType, AbstractType):
    add_question = AddQuestion.Field()
    delete_question = DeleteQuestion.Field()

class SurveyQuery(graph_auth.schema.Query, graphene.ObjectType, AbstractType):
    node = relay.Node.Field()
    user = relay.Node.Field(lambda: UserNode)

    surveys = DjangoFilterConnectionField(Survey)
    survey = relay.Node.Field(Survey)

    questions = DjangoFilterConnectionField(Question)
    question = relay.Node.Field(Question)

    sections = DjangoFilterConnectionField(Section) #, filterset_class=SectionFilter)
    section = relay.Node.Field(Section)
    #viewer = graphene.Field(lambda: SurveyQuery)
    viewer = graphene.Field(lambda: UserNode)
    #@resolve_only_args
    #def resolve_viewer(self):
    #    return get_view()
    @classmethod
    def resolve_viewer(self, args, context, info, extra):
        return get_viewer(info)

def get_viewer(request):
    viewer = UserModel.objects.get(pk=4)
    return viewer #SurveyQuery
