import { config } from 'dotenv';
config({ path: '.env.local' });

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
  console.log('Admin kullanıcı oluşturuluyor...');

  const { data, error } = await supabase.auth.admin.createUser({
    email: 'feza6377@gmail.com',
    password: 'Feza6377',
    email_confirm: true,
    user_metadata: {
      role: 'admin',
      company_name: 'Admin Firma'
    }
  });

  if (error) {
    console.error('Seed hatası:', error.message);
  } else {
    console.log('Admin kullanıcı başarıyla oluşturuldu:', data.user.email);
  }
}

seed();
