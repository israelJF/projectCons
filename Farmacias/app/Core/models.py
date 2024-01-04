# core/models.py
from django.db import models


class YourPharmacyModel(models.Model):
    name = models.CharField(max_length=255)
    address = models.CharField(max_length=255)

    def __str__(self):
        return self.name

