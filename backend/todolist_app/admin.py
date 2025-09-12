from django.contrib import admin
from .models import TaskList

@admin.register(TaskList)
class TaskListAdmin(admin.ModelAdmin):
    list_display = ('id', 'task', 'gestionnaire', 'done')
    list_display_links = ('task',)
    list_filter = ('done', 'gestionnaire')
    search_fields = ('task', 'gestionnaire__username')
    ordering = ('id',)
    actions = ['marquer_terminee', 'marquer_en_attente']

    def marquer_terminee(self, request, queryset):
        """Marquer les tâches sélectionnées comme terminées"""
        updated = queryset.update(done=True)
        self.message_user(request, f"{updated} tâche(s) marquée(s) comme terminée(s).")
    marquer_terminee.short_description = "Marquer comme terminée"

    def marquer_en_attente(self, request, queryset):
        """Marquer les tâches sélectionnées comme en attente"""
        updated = queryset.update(done=False)
        self.message_user(request, f"{updated} tâche(s) marquée(s) comme en attente.")
    marquer_en_attente.short_description = "Marquer comme en attente"
