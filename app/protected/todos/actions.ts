'use server'

import { createClient } from '@/lib/supabase/server'
import { Todo } from '@/lib/types'
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

export async function enhanceTodo(todo: Todo) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  console.log('Request:', { todo })
  if (user) {
    const enhanceTodoEndpoint = process.env.N8N_ENHANCE_URL!;
    console.log('Enhance Todo Endpoint:', enhanceTodoEndpoint);
    const response = await fetch(enhanceTodoEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title: todo.task }),
    })

//     this is the response:
//     [
//   {
//     "id": "gen-1756419559-Q4A1V820RpnPViUtrxeB",
//     "provider": "Google AI Studio",
//     "model": "google/gemma-3n-e2b-it:free",
//     "object": "chat.completion",
//     "created": 1756419560,
//     "choices": [
//       {
//         "logprobs": null,
//         "finish_reason": "stop",
//         "native_finish_reason": "STOP",
//         "index": 0,
//         "message": {
//           "role": "assistant",
//           "content": "Tacos for dinner",
//           "refusal": null,
//           "reasoning": null
//         }
//       }
//     ],
//     "usage": {
//       "prompt_tokens": 37,
//       "completion_tokens": 4,
//       "total_tokens": 41,
//       "prompt_tokens_details": {
//         "cached_tokens": 0
//       },
//       "completion_tokens_details": {
//         "reasoning_tokens": 0,
//         "image_tokens": 0
//       }
//     }
//   }
    // ]
    
    console.log('Enhance response:', response);

// Enhance response: Response {
//   status: 200,
//   statusText: 'OK',
//   headers: Headers {
//     date: 'Sun, 31 Aug 2025 03:56:55 GMT',
//     'content-type': 'application/json; charset=utf-8',
//     'transfer-encoding': 'chunked',
//     connection: 'keep-alive',
//     'alt-svc': 'h3=":443"; ma=86400',
//     vary: 'Accept-Encoding',
//     'cf-cache-status': 'DYNAMIC',
//     nel: '{"report_to":"cf-nel","success_fraction":0.0,"max_age":604800}',
//     'report-to': '{"group":"cf-nel","max_age":604800,"endpoints":[{"url":"https://a.nel.cloudflare.com/report/v4?s=wwM%2BY7EfxArt1Ky0Dqy3svsfwuiF6SQ2nREt4qNYQGi7HT6T42vwQ2%2Ftgwt2EkYgA0g%2FfxwFMjIktE%2BcKblK%2BLIdNzipRcnQEObuvRyQ6nwm2V3oXlxYiUsKfwhAAtoq%2FgI%3D"}]}',
//     'content-encoding': 'br',
//     server: 'cloudflare',
//     'cf-ray': '977999c82a41f44f-LAX'
//   },
//      },
//   body: ReadableStream { locked: false, state: 'readable', supportsBYOB: true },
//   bodyUsed: false,
//   ok: true,
//   redirected: false,
//   type: 'default',
//   url: 'https://n8n.hectorruizlaph.com/webhook-test/enhance-todo'
// }
//  ⨯ SyntaxError: Unexpected end of JSON input
//     at JSON.parse (<anonymous>)
//     at async enhanceTodo (app\protected\todos\actions.ts:126:18)
//   124 |
//   125 |     console.log('Enhance response:', response);
// > 126 |     const data = await response.json()
//       |                  ^
//   127 |     console.log('Enhance response data:', data);
//   128 |     console.log('Enhanced task:', data[0]?.choices[0]?.message?.content);
//   129 | {
//   digest: '489637935'
// }
//  POST /protected/todos 500 in 1709ms

    const data = await response.json()
    console.log('Enhance response data:', data);
    console.log('Enhanced task:', data[0]?.output);
    const enhancedTask = data[0]?.output || todo.task;
    if (user) {
      await supabase
        .from('todos')
        .update({ task: enhancedTask })
        .match({ id: todo.id, user_id: user.id })
      revalidatePath('/protected/todos')
    }

    // if (user) {
    //   await supabase
    //     .from('todos')
    //     .update({ enhanced: true })
    //     .match({ id: todo.id, user_id: user.id })
    //   revalidatePath('/protected/todos')
    // }
  }
}