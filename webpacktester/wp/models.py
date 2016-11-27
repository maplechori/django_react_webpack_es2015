from django.db import models

STRING = 'string'
NOINPUT = 'noinput'
RADIO = 'radio'

QUESTION_CHOICES = (
    (STRING, 'String'),
    (NOINPUT, 'No Input'),
    (RADIO, 'Radio')
)


# Create your models here.
class Survey(models.Model):
    name = models.CharField(max_length=50)

    def __str__(self):
        return self.name


class Question(models.Model):

    name = models.CharField(max_length=50)
    question_text = models.TextField()
    question_type = models.CharField(max_length=1, choices=QUESTION_CHOICES, default=STRING)
    data_label = models.CharField(max_length=50)


    def __str__(self):
        return self.name


class Section(models.Model):
    name = models.CharField(max_length=50)
    question = models.ForeignKey(Question)
    survey = models.ManyToManyField(Survey)

    def __str__(self):
        return self.name
