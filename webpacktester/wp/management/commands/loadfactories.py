from django.core.management.base import BaseCommand, CommandError
from . import _factories
from wp.models import Survey, Question, Section, QuestionForm
import random, json

schema = """
{
"schema":
 {
  "type": "object",
  "title": "Comment",
  "properties": {
    "name": {
      "title": "Name",
      "type": "string",
      "default": "Steve"
    },
    "email": {
      "title": "Email",
      "type": "string",
      "pattern": """ + r'"^\\S+@\\S+$"' + """,
      "validationMessage": "Email must be of proper format: example@example",
      "description": "Email will be used for evil."
    },
    "port": {
      "title": "Port",
      "type": "integer",
      "default" : 80,
      "validationMessage" : "Please use a port"

    }
  },
  "required": [
    "name",
    "email",
    "port"
  ]
},
"form" :
[
  "*"
]
}"""

class Command(BaseCommand):
    help = 'Runs the Factory Boy fixtures'

    # def add_arguments(self, parser):
    #     parser.add_argument('poll_id', nargs='+', type=int)

    def handle(self, *args, **options):
        # for poll_id in options['poll_id']:
        #     try:
        #         poll = Poll.objects.get(pk=poll_id)
        #     except Poll.DoesNotExist:
        #         raise CommandError('Poll "%s" does not exist' % poll_id)
        Survey.objects.all().delete()
        Question.objects.all().delete()
        Section.objects.all().delete()

        _factories.SurveyFactory.create_batch(20)

        for i in range(0, random.randrange(20000, 50000)):
            sample_set = set(random.sample(set(Survey.objects.all()), 2))
            _factories.SectionFactory.create(survey=sample_set)

        QuestionForm.objects.all().delete()
        qf = QuestionForm()
        qf.name = "QF1"
        qf.type = 1
        qf.schema_json = schema
        qf.save()

        self.stdout.write(self.style.SUCCESS('Successfully loaded factory data'))
