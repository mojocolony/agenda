import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { LocalCalendarProvider } from './calendar/LocalCalendarProvider';
import { CalendarProviderRoot } from './state/CalendarContext';
import { AgendaRepository } from './storage/AgendaRepository';

async function startAgenda() {
  const repository = new AgendaRepository();
  await repository.open();
  const provider = new LocalCalendarProvider(repository);

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <CalendarProviderRoot provider={provider}>
        <App />
      </CalendarProviderRoot>
    </StrictMode>
  );
}

void startAgenda().catch((error: unknown) => {
  console.error('Agenda failed to start', error);
  const root = document.getElementById('root');
  if (root) {
    root.innerHTML = '<main style="padding:2rem;font-family:system-ui;color:#4d535c">Agenda could not start.</main>';
  }
});
