
import { format, endOfDay } from 'date-fns';
import { toast } from "sonner";
import { CalendarEvent, EventFormData } from '@/types/calendar';
import { getWebhookUrl, clearWebhookCache } from './webhookService';
import { WEBHOOK_IDENTIFIERS } from '@/types/webhook';

// Fetch events with GET method
export async function fetchCalendarEvents(selectedDate?: Date | null) {
  try {
    // Busca a URL do webhook dinamicamente
    const baseUrl = await getWebhookUrl(WEBHOOK_IDENTIFIERS.CARREGA_AGENDA);
    
    if (!baseUrl) {
      throw new Error('Webhook de carregamento de agenda não configurado');
    }
    
    // Format date parameters for the API
    let url = baseUrl;
    
    // If a date is selected, add query parameters for start and end dates
    if (selectedDate) {
      const startDateTime = format(selectedDate, "yyyy-MM-dd'T'00:00:00.000xxx");
      const endDateTime = format(endOfDay(selectedDate), "yyyy-MM-dd'T'23:59:59.999xxx");
      
      url += `?start=${encodeURIComponent(startDateTime)}&end=${encodeURIComponent(endDateTime)}`;
      console.log('Fetching events with date range:', { startDateTime, endDateTime });
    }
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.error('Error fetching calendar events:', err);
    throw err;
  }
}

// Refresh events with POST method
export async function refreshCalendarEventsPost(selectedDate?: Date | null) {
  try {
    // Busca a URL do webhook dinamicamente
    const baseUrl = await getWebhookUrl(WEBHOOK_IDENTIFIERS.CARREGA_AGENDA);
    
    if (!baseUrl) {
      throw new Error('Webhook de carregamento de agenda não configurado');
    }
    
    // Create payload with selected date if available
    const payload: any = {};
    
    if (selectedDate) {
      const startDateTime = format(selectedDate, "yyyy-MM-dd'T'00:00:00.000xxx");
      const endDateTime = format(endOfDay(selectedDate), "yyyy-MM-dd'T'23:59:59.999xxx");
      
      payload.start = startDateTime;
      payload.end = endDateTime;
      console.log('Refreshing events with payload:', payload);
    }
    
    const response = await fetch(baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const data = await response.json();
    toast.success("Eventos atualizados com sucesso!");
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.error('Error refreshing calendar events:', err);
    toast.error("Não conseguimos atualizar os eventos, tente novamente.");
    throw err;
  }
}

// Add a new event
export async function addCalendarEvent(formData: EventFormData) {
  try {
    console.log('Starting to add calendar event with data:', formData);
    
    // Limpa o cache antes de buscar o webhook
    clearWebhookCache();
    
    // Busca a URL do webhook dinamicamente
    const baseUrl = await getWebhookUrl(WEBHOOK_IDENTIFIERS.CRIA_EVENTO);
    console.log('Retrieved webhook URL for creating event:', baseUrl);
    
    if (!baseUrl) {
      console.error('Webhook URL not found for identifier:', WEBHOOK_IDENTIFIERS.CRIA_EVENTO);
      throw new Error('Webhook de criação de evento não configurado');
    }
    
    // Format the date and times for the API
    const { date, startTime, endTime, summary, description, email } = formData;
    const dateStr = format(date, "yyyy-MM-dd");
    
    const startDateTime = `${dateStr}T${startTime}:00-03:00`;
    const endDateTime = `${dateStr}T${endTime}:00-03:00`;
    
    const payload = {
      summary,
      description,
      start: startDateTime,
      end: endDateTime,
      email
    };
    
    console.log('Adding event with payload:', payload);
    console.log('Sending request to webhook URL:', baseUrl);
    
    const response = await fetch(baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    
    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error(`HTTP error! Status: ${response.status} - ${errorText}`);
    }
    
    const responseData = await response.json();
    console.log('Success response:', responseData);
    
    toast.success("Evento adicionado com sucesso!");
    return true;
  } catch (err) {
    console.error('Error adding event:', err);
    toast.error(`Erro ao adicionar evento: ${err instanceof Error ? err.message : 'Erro desconhecido'}`);
    return false;
  }
}

// Edit an existing event
export async function editCalendarEvent(eventId: string, formData: EventFormData) {
  try {
    // Limpa o cache antes de fazer a requisição
    clearWebhookCache();
    
    // Busca a URL do webhook dinamicamente
    const baseUrl = await getWebhookUrl(WEBHOOK_IDENTIFIERS.ALTERA_EVENTO);
    
    if (!baseUrl) {
      throw new Error('Webhook de alteração de evento não configurado');
    }
    
    // Format the date and times for the API
    const { date, startTime, endTime, summary, description, email } = formData;
    const dateStr = format(date, "yyyy-MM-dd");
    
    const startDateTime = `${dateStr}T${startTime}:00-03:00`;
    const endDateTime = `${dateStr}T${endTime}:00-03:00`;
    
    const payload = {
      id: eventId,
      summary,
      description,
      start: startDateTime,
      end: endDateTime,
      email
    };
    
    console.log('Updating event with payload:', payload);
    
    const response = await fetch(baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    toast.success("Evento atualizado com sucesso!");
    return true;
  } catch (err) {
    console.error('Error updating event:', err);
    toast.error("Erro ao atualizar evento. Tente novamente.");
    return false;
  }
}

// Delete an event
export async function deleteCalendarEvent(eventId: string) {
  try {
    // Limpa o cache antes de fazer a requisição
    clearWebhookCache();
    
    // Busca a URL do webhook dinamicamente
    const baseUrl = await getWebhookUrl(WEBHOOK_IDENTIFIERS.EXCLUI_EVENTO);
    
    if (!baseUrl) {
      throw new Error('Webhook de exclusão de evento não configurado');
    }
    
    const payload = {
      id: eventId
    };
    
    console.log('Deleting event with payload:', payload);
    
    const response = await fetch(baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    toast.success("Evento excluído com sucesso!");
    return true;
  } catch (err) {
    console.error('Error deleting event:', err);
    toast.error("Erro ao excluir evento. Tente novamente.");
    return false;
  }
}
