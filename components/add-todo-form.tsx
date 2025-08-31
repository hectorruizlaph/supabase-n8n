'use client'

import { addTodo } from '@/app/protected/todos/actions'
import { useRef } from 'react'
import { Input } from './ui/input'
import { Button } from './ui/button'

export default function AddTodoForm() {
  const formRef = useRef<HTMLFormElement>(null)
  return (
    <form
      ref={formRef}
      action={async (formData) => {
        await addTodo(formData)
        formRef.current?.reset()
      }}
      className="flex gap-2 mb-4"
    >
      <Input name="task" placeholder="add a new todo" />
      <Button type="submit">Add</Button>
    </form>
  )
}
