from graphene import relay, ObjectType, AbstractType, resolve_only_args
from graphene_django import DjangoObjectType, DjangoConnectionField
from graphene_django.filter import DjangoFilterConnectionField
from .models import Survey as SurveyModel
from .models import Section as SectionModel
from .models import Question as QuestionModel
from .models import QuestionForm as QuestionFormModel
from django.contrib.auth.models import User as UserModel
from graphene_django.debug import DjangoDebug
from graphql_relay.node.node import from_global_id, to_global_id
import jwt, json, django_filters, graphene, random, django
from rest_framework_jwt.settings import api_settings
from django.conf import settings


def get_user(request):
    print("get_user")
    JWT_ALGORITHM = 'HS256'
    JWT_SECRET = django.conf.settings.SECRET_KEY

    if hasattr(request, "META") and "HTTP_AUTHORIZATION" in request.META:
        jwt_token = request.META['HTTP_AUTHORIZATION'].split(' ')[1]

        if jwt_token:
            try:
                payload = jwt.decode(jwt_token,JWT_SECRET,algorithms=[JWT_ALGORITHM])
                print("Got user (get_user)")
                user = UserModel.objects.get(id=payload['user_id'])
                return user
            except (jwt.DecodeError, jwt.ExpiredSignatureError) as e:
                print("Got exception", e)
                return None
    print("No HTTP AUTHORIZATION")
    return None

class UserViewer(DjangoObjectType):

    class Meta:
        model = UserModel
        interfaces = (relay.Node,)

    @classmethod
    def get_node(cls, id, context, info):
        user = super(UserViewer, cls).get_node(id, context, info)
        print("get_node", user.id)

        if user.id: #context.user.id and user.id == context.user.id:
            return user
        else:
            print("failed get node")
            return None

    questionforms = DjangoConnectionField(lambda: QuestionForm)
    def resolve_question_forms(self, args, context, info):
        print("RESOLVE QUESTION FORMS")
        return QuestionForm.objects.all()

    questions = DjangoConnectionField(lambda: Question)
    def resolve_questions(self, args, context, info):
        print("RESOLVE QUESTIONS")
        return QuestionModel.objects.all()

    token = graphene.String()
    def resolve_token(self, args, context, info):
        print("RESOLVE TOKEN")
        if self.id != context.user.id and not getattr(self, 'is_current_user', False):
            return None

        jwt_payload_handler = api_settings.JWT_PAYLOAD_HANDLER
        jwt_encode_handler = api_settings.JWT_ENCODE_HANDLER

        payload = jwt_payload_handler(self)
        token = jwt_encode_handler(payload)

        return token



class LoginUser(relay.ClientIDMutation):
    class Input:
        username = graphene.String()
        email = graphene.String(required=True)
        password = graphene.String(required=True)

    ok = graphene.Boolean()
    user = graphene.Field(UserViewer)

    @classmethod
    def mutate_and_get_payload(cls, input, context, info):
        model = django.contrib.auth.get_user_model()

        params = {
            model.USERNAME_FIELD: input.get(model.USERNAME_FIELD, input.get('email')),
            'password': input.get('password')
        }

        user = django.contrib.auth.authenticate(**params)
        print(user)

        if user:
            user.is_current_user = True
            return LoginUser(ok=True, user=user)
        else:
            return LoginUser(ok=False,  user=None)

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

class QuestionForm(DjangoObjectType):

    class Meta:
        model = QuestionFormModel
        interfaces = (relay.Node,)




class DispatchForm(relay.ClientIDMutation):
    class Input:
        response_json = graphene.String(required=True)
        qformId = graphene.String(required=True)

    viewer = graphene.Field(UserViewer)
    questionForm = graphene.Field(QuestionForm)

    @classmethod
    def mutate_and_get_payload(cls, input, context, info):
        response = input.get("response_json")
        id = from_global_id(input.get("qformId"))[1]
        question = QuestionFormModel.objects.get(pk=id)
        viewer = get_user(context)

        question.response_json = response
        question.save()

        return DispatchForm(viewer=viewer, questionForm=question)



#Section.Connection = connection_for_type(Section)
class Question(DjangoObjectType):

    class Meta:
        model = QuestionModel
        interfaces = (relay.Node,)
        filter_fields = { 'name' : ['exact', 'icontains']}

    #question_type = graphene.String()
    #question_type = graphene.Field(QuestionType)
    count_a = graphene.Int()
    count_b = graphene.Int()
    count_c = graphene.Int()

    @staticmethod
    def resolve_count_a(self, args, context, info):
        return random.randint(3,12)
    @staticmethod
    def resolve_count_b(self, args, context, info):
        return random.randint(5,8)
    @staticmethod
    def resolve_count_c(self, args, context, info):
        return random.randint(3,5)

class DeleteQuestion(relay.ClientIDMutation):

    class Input:
        id = graphene.String(required=True)

    viewer = graphene.Field(UserViewer)
    questionId = graphene.String()

    @classmethod
    def mutate_and_get_payload(cls, input, context, info):
        global_id = input.get("id")
        id = from_global_id(global_id)[1]
        question = QuestionModel.objects.get(pk=id)
        question.delete()
        viewer = get_user(context)
        return DeleteQuestion(viewer=viewer, questionId=global_id)


class AddQuestion(relay.ClientIDMutation):

    class Input:
        name = graphene.String(required=True)
        question_type = graphene.Int(required=True)
        data_label = graphene.String(required=True)
        question_text = graphene.String(required=True)

    viewer = graphene.Field(UserViewer)
    questionEdge = graphene.Field(Question.Connection.Edge)

    @classmethod
    def mutate_and_get_payload(cls, input, context, info):
        question = QuestionModel()
        question.question_type = input.get('question_type')
        question.name = input.get('name')
        question.data_label = input.get('data_label')
        question.question_text = input.get('question_text')
        viewer = get_user(context)
        question.created_by = viewer
        question.save()
        edge = Question.Connection.Edge(node=question, cursor=0)
        return AddQuestion(viewer=viewer, questionEdge=edge)

class SurveyMutation(graphene.ObjectType, AbstractType):
    add_question = AddQuestion.Field()
    delete_question = DeleteQuestion.Field()
    login_user = LoginUser.Field()
    dispatch_form = DispatchForm.Field()

class SurveyQuery(graphene.ObjectType, AbstractType):
    node = relay.Node.Field()
    #user = relay.Node.Field(lambda: UserViewer)

    #surveys = DjangoFilterConnectionField(Survey)
    #survey = relay.Node.Field(Survey)

    #questions = DjangoFilterConnectionField(Question)
    #question = relay.Node.Field(Question)

    #sections = DjangoFilterConnectionField(Section) #, filterset_class=SectionFilter)
    #section = relay.Node.Field(Section)
    #viewer = graphene.Field(lambda: SurveyQuery)
    viewer = graphene.Field(lambda: UserViewer)


    def resolve_viewer(self, args, context, info):
        return get_user(context)
