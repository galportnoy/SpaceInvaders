from django.db import models

class ScoreBoard (models.Model):
    name = models.CharField(max_length=200)
    score = models.IntegerField()
