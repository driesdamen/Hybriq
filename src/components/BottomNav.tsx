import { BarChart2, PlusCircle, Activity, Shield } from 'lucide-react';

type Tab = 'overview' | 'log' | 'recovery' | 'prehab';

interface Props {
  active: Tab;
  onChange: (tab: Tab) => void;
}

const TABS: { id: Tab; label: string; Icon: typeof BarChart2 }[] = [
  { id: 'overview', label: 'Overzicht', Icon: BarChart2 },
  { id: 'log', label: 'Log', Icon: PlusCircle },
  { id: 'recovery', label: 'Herstel', Icon: Activity },
  { id: 'prehab', label: 'Prehab', Icon: Shield },
];

export function BottomNav({ active, onChange }: Props) {
  return (
    <div className="fixed bottom-0 inset-x-0 z-50 bg-[#0a0a0f]/95 backdrop-blur-md border-t border-[#1a1a1f]">
      <div className="flex max-w-lg mx-auto">
        {TABS.map(({ id, label, Icon }) => (
          <button
            key={id}
            onClick={() => onChange(id)}
            className={`flex-1 flex flex-col items-center gap-1 py-3 transition-colors ${
              active === id ? 'text-white' : 'text-zinc-600'
            }`}
          >
            <Icon size={20} strokeWidth={active === id ? 2.5 : 1.8} />
            <span className="text-[10px] font-semibold tracking-wide uppercase">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
