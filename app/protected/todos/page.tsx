import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import TodoList from '@/components/todo-list'

export default async function TodosPage() {

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: todos } = await supabase
    .from('todos')
    .select('*')
    .order('created_at', { ascending: true })

  return (
    <div className="w-full max-w-lg flex flex-col">
      <h2 className="font-bold text-4xl mb-4 text-center text-white">Todo List</h2>
      <TodoList todos={todos ?? []} />
    </div>
  )
}
