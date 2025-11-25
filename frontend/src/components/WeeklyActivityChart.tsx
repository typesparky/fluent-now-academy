import { useEffect, useState } from 'react';
import { supabase } from '../integrations/supabase/client';
import { useAuth } from './AuthContext';

interface DayActivity {
  date: string;
  minutes: number;
}

const WeeklyActivityChart = () => {
  const { user } = useAuth();
  const [weekData, setWeekData] = useState<DayActivity[]>([]);

  useEffect(() => {
    if (!user) return;

    const fetchWeeklyData = async () => {
      const days = 7;
      const today = new Date();
      const datePromises = [];

      for (let i = 0; i < days; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        datePromises.push(date.toISOString().split('T')[0]);
      }

      const { data } = await supabase
        .from('daily_progress')
        .select('date, speaking_minutes')
        .eq('user_id', user.id)
        .gte('date', datePromises[days - 1])
        .order('date', { ascending: true });

      const dataMap = new Map(data?.map(d => [d.date, d.speaking_minutes]) || []);
      const result = datePromises.reverse().map(date => ({
        date,
        minutes: dataMap.get(date) || 0,
      }));

      setWeekData(result);
    };

    fetchWeeklyData();
  }, [user]);

  const maxMinutes = Math.max(...weekData.map(d => d.minutes), 10);
  const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  return (
    <div className="flex items-end justify-between gap-2 h-24">
      {weekData.map((day, i) => {
        const height = (day.minutes / maxMinutes) * 100;
        const isToday = i === weekData.length - 1;
        return (
          <div key={day.date} className="flex flex-col items-center flex-1 gap-1">
            <div className="w-full bg-muted rounded-t relative overflow-hidden" style={{ height: '80px' }}>
              <div
                className={`absolute bottom-0 w-full rounded-t transition-all duration-300 ${
                  isToday ? 'bg-primary' : 'bg-primary/60'
                }`}
                style={{ height: `${height}%` }}
              />
            </div>
            <span className="text-xs text-muted-foreground">{days[new Date(day.date).getDay()]}</span>
          </div>
        );
      })}
    </div>
  );
};

export default WeeklyActivityChart;
