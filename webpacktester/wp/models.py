from django.db import models

# Create your models here.
class Survey(models.Model):
    name = models.CharField(max_length=50)

    def __str__(self):
        return self.name


class Question(models.Model):
    name = models.CharField(max_length=50)

    def __str__(self):
        return self.name


class Section(models.Model):
    name = models.CharField(max_length=50)
    question = models.ForeignKey(Question)
    survey = models.ManyToManyField(Survey)

    def __str__(self):
        return self.name
