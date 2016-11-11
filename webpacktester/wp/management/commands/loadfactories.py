from django.core.management.base import BaseCommand, CommandError
from . import _factories
from wp.models import Survey, Question, Section
import random

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

        for i in range(0, random.randrange(5, 15)):
            _factories.SectionFactory.create(survey=set(random.sample(set(Survey.objects.all()), 2)))

        self.stdout.write(self.style.SUCCESS('Successfully loaded factory data'))
