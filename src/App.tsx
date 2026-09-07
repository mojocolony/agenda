import { SpatialPlanes } from './components/navigation/SpatialPlanes';
import { SixMonthView } from './components/calendar/SixMonthView';
import { PlaceholderView } from './components/PlaceholderView';
import { MonthView } from './components/calendar/MonthView';
import './styles/navigation.css';
import './styles/six-month.css';
import './styles/month.css';

export default function App() {
  return (
    <main className="agenda-shell">
      <SpatialPlanes
        settings={<PlaceholderView label="SETTINGS" />}
        sixMonth={<SixMonthView />}
        month={<MonthView anchor={new Date()} today={new Date()} />}
        agenda={<PlaceholderView label="AGENDA" />}
      />
    </main>
  );
}
