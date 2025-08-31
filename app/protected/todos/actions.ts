'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function addTodo(formData: FormData) {
  const supabase = await createClient()
  const task = formData.get('task') as string

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    await supabase.from('todos').insert({ task, user_id: user.id })
    revalidatePath('/protected/todos')
  }
}

export async function updateTodoStatus(id: number, is_complete: boolean) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    await supabase
      .from('todos')
      .update({ is_complete })
      .match({ id, user_id: user.id })
    revalidatePath('/protected/todos')
  }
}

export async function updateTodoTask(id: number, task: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    await supabase
      .from('todos')
      .update({ task })
      .match({ id, user_id: user.id })
    revalidatePath('/protected/todos')
  }
}

export async function deleteTodo(id: number) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    await supabase
      .from('todos')
      .delete()
      .match({ id, user_id: user.id })
    revalidatePath('/protected/todos')
  }
}
