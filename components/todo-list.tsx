import { type Todo } from '@/lib/types'
import AddTodoForm from './add-todo-form'
import TodoItem from './todo-item'

export default function TodoList({ todos }: { todos: Todo[] }) {
  return (
    <div>
      <AddTodoForm />
      <ul className="flex flex-col gap-4">
        {todos.map((todo) => (
          <TodoItem key={todo.id} todo={todo} />
        ))}
      </ul>
    </div>
  )
}
