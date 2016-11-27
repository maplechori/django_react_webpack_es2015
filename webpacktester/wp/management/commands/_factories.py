
import datetime
import factory
from factory.fuzzy import FuzzyChoice
from wp.models import Question
import random

from wp.models import Survey
from wp.models import Question
from wp.models import Section

class SurveyFactory(factory.django.DjangoModelFactory):

    class Meta:
        model = Survey

    name = factory.Sequence(lambda n: "survey_%s" % n)


class QuestionFactory(factory.django.DjangoModelFactory):

    class Meta:
        model = Question

    name = factory.Sequence(lambda n: "question_%s" % n)
    question_type = factory.fuzzy.FuzzyChoice(Question.QUESTION_CHOICES)

    @factory.post_generation
    def section(self, create, extracted, **kwargs):
        if not create:
            return
        if extracted:
            for section in extracted:
                self.section.add(section)


class SectionFactory(factory.django.DjangoModelFactory):

    class Meta:
        model = Section

    name = factory.Sequence(lambda n: "section_%s" % n)
    question = factory.SubFactory(QuestionFactory)


    @factory.post_generation
    def survey(self, create, extracted, **kwargs):
        if not create:
            # Simple build, do nothing.
            return

        if extracted:
            # A list of groups were passed in, use them
            for survey in extracted:
                self.survey.add(survey)
