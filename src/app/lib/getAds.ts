
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export const getActiveAds = async (position: string) => {
  const { data, error } = await supabase
    .from('banners')
    .select('*')
    .eq('is_active', true)
    .eq('position', position)
    .order('slot_index', { ascending: true })

  if (error) {
    console.error('Reklam çekilemedi:', error)
    return []
  }

  return data
}
