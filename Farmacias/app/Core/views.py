import openai
from django.shortcuts import render, redirect
from django.views.generic.base import TemplateView
from django.views.generic.edit import FormView
from django.contrib.auth.forms import AuthenticationForm, UserCreationForm
from django.contrib.auth import login
from django.contrib import messages
from django.urls import reverse_lazy
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import YourPharmacyModel

class YourModalView(TemplateView):
    template_name = 'modal.html'

class HomeView(TemplateView):

    template_name = 'index.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)

        pharmacies = YourPharmacyModel.objects.all()
        context['pharmacies'] = pharmacies

        return context

def contact_view(request):
    return render(request, 'contact.html')

def about_us_view(request):
    return render(request, 'about.html')
def find_pharmacy(request):
    return render(request, 'find_pharmacy.html')

class RegisterPharmacyView(FormView):
    template_name = 'register_pharmacy.html'
    form_class = UserCreationForm
    success_url = reverse_lazy('home')

    def form_valid(self, form):
        pharmacy_name = form.cleaned_data.get('pharmacy_name')
        pharmacy_address = form.cleaned_data.get('pharmacy_address')

        pharmacy = YourPharmacyModel(name=pharmacy_name, address=pharmacy_address)
        pharmacy.save()

        messages.success(self.request, '¡Registro de farmacia exitoso!')
        return super().form_valid(form)

    def form_invalid(self, form):
        messages.error(self.request, 'Error en el formulario de registro.')
        return super().form_invalid(form)

def login_page(request):
    if request.method == 'POST':
        form = AuthenticationForm(request, request.POST)
        if form.is_valid():
            user = form.get_user()
            login(request, user)
            messages.success(request, '¡Inicio de sesión exitoso!')
            return redirect('home')
        else:
            messages.error(request, 'Nombre de usuario o contraseña incorrectos.')

    else:
        form = AuthenticationForm()

    return render(request, 'login_page.html', {'form': form})


# Configura la clave de la API de OpenAI (gestiona las claves de manera segura en producción)
openai.api_key = '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'

@csrf_exempt
def chat_view(request):
    if request.method == 'POST':
        # Procesar la solicitud del formulario
        name = request.POST.get('name', '')
        user_message = request.POST.get('message', '')

        # Llama a la API de OpenAI para obtener la respuesta del chatbot
        response = openai.Completion.create(
            engine="text-davinci-002",
            prompt=f"Usuario: {user_message}\nPregunta: ¿Qué acciones generales puedo tomar para aliviar estos síntomas?",
            max_tokens=200,
            temperature=0.7
        )

        # Obtén la respuesta del chatbot
        pharmacist_response = response.choices[0].text.strip()

        # Devuelve la respuesta en formato JSON
        return JsonResponse({'response': pharmacist_response})

    return render(request, 'index.html')


def cotizar_recetas_view(request):
    print("Cotizar recetas view reached.")

    if request.method == 'POST':
        # Lógica para procesar la cotización de recetas, si es necesario
        # Puedes agregar la lógica específica aquí

        # Después de procesar, puedes redirigir a la página de cotizar_recetas o mostrar un mensaje de éxito
        messages.success(request, 'Cotización de recetas exitosa')
        return redirect('cotizar_recetas')

    farmacias = YourPharmacyModel.objects.all()

    context = {
        'farmacias': farmacias,
    }
    return render(request, 'index.html', context)