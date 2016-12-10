from django.db import models
from django.contrib.auth.models import User

class Authorization_Denied(models.Model):
    pass


# Create your models here.
class Survey(models.Model):
    name = models.CharField(max_length=50)
    created_by = models.ForeignKey(User)
    def __str__(self):
        return self.name


class Question(models.Model):

    name = models.CharField(max_length=50)
    question_text = models.TextField()
    created_by = models.ForeignKey(User, related_name='questions')

    QUESTION_CHOICES = [
        (1, 'Checkbox'),
        (2, 'String'),
        (3, 'No Input'),
        (4, 'Radio')
    ]
    question_type = models.PositiveSmallIntegerField(choices=QUESTION_CHOICES, default=3)
    data_label = models.CharField(max_length=50)

    def __str__(self):
        return self.name


class Section(models.Model):
    name = models.CharField(max_length=50)
    question = models.ForeignKey(Question)
    survey = models.ManyToManyField(Survey)
    created_by = models.ForeignKey(User)
    def __str__(self):
        return self.name
