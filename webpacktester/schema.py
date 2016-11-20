import graphene

from wp.schema import SurveyQuery, SurveyMutation


schema = graphene.Schema(query=SurveyQuery, mutation=SurveyMutation)
