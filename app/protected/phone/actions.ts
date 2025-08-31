'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function upsertPhone(formData: FormData) {
  const supabase = await createClient()
  const phone = formData.get('phone') as string

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    await supabase.from('phone').upsert({ phone, user_id: user.id })
    revalidatePath('/protected/phone')
  }
}
