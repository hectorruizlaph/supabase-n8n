'use client'

import { useRef, useState } from 'react'
import {
  upsertPhone
} from '@/app/protected/phone/actions'
import { Button } from './ui/button'
import { User } from '@supabase/supabase-js'
import { PhoneInput } from './ui/phone-input'
import type { Value } from 'react-phone-number-input'

export default function PhoneForm({ phone, user }: { phone: string, user?: User }) {
  const [isLoading, setIsLoading] = useState(false)
  const [phoneValue, setPhoneValue] = useState<Value>(phone as Value)

  const formRef = useRef<HTMLFormElement>(null)

  return (
    <form
      ref={formRef}
      action={async (formData) => {
        setIsLoading(true)
        formData.set('phone', phoneValue || '');
        await upsertPhone(formData)
        setIsLoading(false)
      }} className="flex flex-col gap-4 items-start">
          <PhoneInput
            name="phone"
            international={true}
            value={phoneValue}
            onChange={setPhoneValue}
          />
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save"}
          </Button>
        </form>
  )
}
