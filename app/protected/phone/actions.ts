'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function upsertPhone(formData: FormData) {
  const supabase = await createClient()
  const phone = formData.get('phone') as string

  console.log(phone)
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {

    const { data, error } = await supabase.from('phone').upsert({ phone, user_id: user.id }, { onConflict: 'user_id' }).select();
    revalidatePath('/protected/phone')

    if (error) {
  console.error('Error during upsert:', error.message);
} else {
  console.log('Upserted data:', data);
}
  }
}
