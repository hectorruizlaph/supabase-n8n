'use client'

import { useState } from 'react'
import { type Todo } from '@/lib/types'
import {
  deleteTodo,
  enhanceTodo,
  updateTodoStatus,
  updateTodoTask,
} from '@/app/protected/todos/actions'
import { Checkbox } from './ui/checkbox'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { LightningBoltIcon, ReloadIcon } from "@radix-ui/react-icons"

export default function TodoItem({ todo }: { todo: Todo }) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedTask, setEditedTask] = useState(todo.task)
  const [isEnhancing, setIsEnhancing] = useState(false)

  const handleUpdate = async () => {
    await updateTodoTask(todo.id, editedTask)
    setIsEditing(false)
  }
  const handleEnhance = async (todo: Todo) => {
    setIsEnhancing(true)
    await enhanceTodo(todo)
    setIsEnhancing(false)
  }

  return (
    <li className="flex flex-col items-center gap-4 p-2 border rounded-md">
      <div className="flex items-center gap-4 p-2 border rounded-md justify-start w-full">
        {isEnhancing ? (
          <ReloadIcon className="animate-spin" />
        ) : (
          <Checkbox
            checked={todo.is_complete}
            onCheckedChange={() => updateTodoStatus(todo.id, !todo.is_complete)}
          />
        )}
      {isEditing ? (
        <Input
          value={editedTask}
          onChange={(e) => setEditedTask(e.target.value)}
          onBlur={handleUpdate}
          onKeyDown={(e) => e.key === 'Enter' && handleUpdate()}
          className="flex-1"
        />
      ) : (
        <span
          className={`flex-1 ${
            todo.is_complete ? 'line-through text-muted-foreground' : ''
          }`}
          onDoubleClick={() => setIsEditing(true)}
        >
          {todo.task}
        </span>
        )}
        </div>
      <div className="flex gap-2 justify-end w-full">
      <Button
          variant="outline"
          disabled={isEnhancing}
        size="sm"
        onClick={() => setIsEditing(!isEditing)}
      >
        {isEditing ? 'Cancel' : 'Edit'}
      </Button>
        <Button
          disabled={isEnhancing}
          variant="destructive"
          size="sm"
          onClick={() => deleteTodo(todo.id)}
        >
          Delete
      </Button>
      <Button
          variant="default"
          disabled={isEnhancing}
        size="sm"
        onClick={() => handleEnhance(todo)}
      >
        <LightningBoltIcon />
        Enhance
        </Button>
        </div>
    </li>
  )
}
