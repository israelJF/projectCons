from django.core.management.base import BaseCommand
from app.models import YourPharmacyModel

class Command(BaseCommand):
    help = 'Crea objetos personalizados'

    def handle(self, *args, **options):
        # Aquí va tu lógica para crear objetos
        YourPharmacyModel.objects.create(name='Ejemplo', address='Ejemplo Dirección')

        self.stdout.write(self.style.SUCCESS('¡Objetos creados exitosamente!'))
