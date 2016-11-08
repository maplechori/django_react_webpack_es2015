from graphene import relay, ObjectType, AbstractType
from graphene_django import DjangoObjectType
from .models import Survey as SurveyModel
import graphene

class Survey(DjangoObjectType):
    class Meta:
        model = SurveyModel
        interfaces = (relay.Node,)


class SurveyQuery(graphene.ObjectType, AbstractType):
    surveys = graphene.List(Survey)

    @graphene.resolve_only_args
    def resolve_surveys(self):
        return SurveyModel.objects.all()
