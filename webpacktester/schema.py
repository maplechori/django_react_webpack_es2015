import graphene

from wp.schema import SurveyQuery


class Query(SurveyQuery, graphene.ObjectType):
    # This class will inherit from multiple Queries
    # as we begin to add more apps to our project
    pass

schema = graphene.Schema(query=Query)
