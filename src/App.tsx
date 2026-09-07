import { SpatialPlanes } from './components/navigation/SpatialPlanes';
import { SixMonthView } from './components/calendar/SixMonthView';
import { PlaceholderView } from './components/PlaceholderView';
import './styles/navigation.css';
import './styles/six-month.css';

export default function App() {
  return (
    <main className="agenda-shell">
      <SpatialPlanes
        settings={<PlaceholderView label="SETTINGS" />}
        sixMonth={<SixMonthView />}
        month={<PlaceholderView label="SEPTEMBER 2026" />}
        agenda={<PlaceholderView label="AGENDA" />}
      />
    </main>
  );
}
