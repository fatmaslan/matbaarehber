// lib/hooks/useLatestActivities.ts
import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";


export interface Activity {
  tarih: string;
  islem: string;
  kullanici: string;
  durum: string;
  firma: string;
}

export const useLatestActivities = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchActivities = async () => {
      setLoading(true);
      const { data, error } = await supabase.rpc("get_latest_companies_activity");

      if (error) {
        setError(error.message);
        setActivities([]);
      } else {
        setActivities(data);
      }

      setLoading(false);
    };

    fetchActivities();
  }, []);

  return { activities, loading, error };
};
