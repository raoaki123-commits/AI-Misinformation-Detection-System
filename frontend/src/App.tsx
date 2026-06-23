import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import { HomePage } from './pages/HomePage';
import { AnalyzePage } from './pages/AnalyzePage';
import { ReportsPage } from './pages/ReportsPage';
import { ComparePage } from './pages/ComparePage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Home has its own layout (no sidebar) */}
        <Route path="/" element={<HomePage />} />

        {/* All console routes get the AppShell sidebar */}
        <Route
          path="/analyze"
          element={
            <AppShell>
              <AnalyzePage />
            </AppShell>
          }
        />
        <Route
          path="/reports"
          element={
            <AppShell>
              <ReportsPage />
            </AppShell>
          }
        />
        <Route
          path="/compare"
          element={
            <AppShell>
              <ComparePage />
            </AppShell>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
