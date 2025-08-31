import { PhoneInput } from "@/components/ui/phone-input";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { upsertPhone } from "./actions";
import { Button } from "@/components/ui/button";

export default async function ProtectedPage() {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/auth/login");
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
        <form action={upsertPhone} className="flex flex-col gap-4 items-start">
          <PhoneInput
            name="phone"
            defaultValue={phoneData?.phone || ""}
            defaultCountry="US"
          />
          <Button type="submit">Save</Button>
        </form>
      </div>
    </div>
  );
}
