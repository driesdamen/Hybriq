import { useState } from 'react';
import { Overview } from './components/Overview';
import { LogSession } from './components/LogSession';
import { RecoveryScreen } from './components/RecoveryScreen';
import { PrehabScreen } from './components/PrehabScreen';
import { BottomNav } from './components/BottomNav';

type Tab = 'overview' | 'log' | 'recovery' | 'prehab';

export default function App() {
  const [tab, setTab] = useState<Tab>('overview');

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <div className="max-w-lg mx-auto relative min-h-screen">
        <div className="overflow-y-auto">
          {tab === 'overview' && <Overview onLogSession={() => setTab('log')} />}
          {tab === 'log' && <LogSession onDone={() => setTab('overview')} />}
          {tab === 'recovery' && <RecoveryScreen />}
          {tab === 'prehab' && <PrehabScreen />}
        </div>
      </div>
      <BottomNav active={tab} onChange={setTab} />
    </div>
  );
}
