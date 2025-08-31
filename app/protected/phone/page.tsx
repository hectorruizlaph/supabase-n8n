import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import PhoneForm from "@/components/phone-form";

export type PhoneData = {
  phone: string;
};

export default async function PhonePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: phoneData } = await supabase
    .from("phone")
    .select("phone")
    .eq("user_id", user.id)
    .single();

  return (
    <div className="flex-1 w-full flex flex-col gap-12">
      <div className="w-full">
        <h2 className="font-bold text-2xl mb-4">
          What&apos;s your WhatsApp number?
        </h2>
        {/* <form action={upsertPhone} className="flex flex-col gap-4 items-start">
          <PhoneInput
            name="phone"
            defaultValue={phoneData?.phone || ""}
            defaultCountry="US"
          />
          <Button type="submit" className="w-full">Save</Button>
        </form> */}
        <PhoneForm phone={phoneData?.phone || ""} user={user} />
      </div>
    </div>
  );
}
