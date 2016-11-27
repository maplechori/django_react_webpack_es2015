from django.db import models

QUESTION_TYPE = (
    ('NI', 'No input'),
    ('ST', 'String'),
    ('RA', 'Radios'),
    ('DD', 'Drop Down'),
    ('CK', 'CheckBoxes')
)

# Create your models here.
class Survey(models.Model):
    name = models.CharField(max_length=50)

    def __str__(self):
        return self.name


class Question(models.Model):
    name = models.CharField(max_length=50)
    question_text = models.TextField()
    question_type = models.CharField(max_length=20, choices=QUESTION_TYPE, default='NI')
    data_label = models.CharField(max_length=50)

    def __str__(self):
        return self.name


class Section(models.Model):
    name = models.CharField(max_length=50)
    question = models.ForeignKey(Question)
    survey = models.ManyToManyField(Survey)

    def __str__(self):
        return self.name
