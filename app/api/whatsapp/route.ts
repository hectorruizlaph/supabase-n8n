import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// The expected payload structure from the webhook
type WebhookPayload = {
  chat_id: string;
  instance_name: string;
  apikey: string;
  server_url: string;
  phone: string;
  conversation: string;
};

export async function POST(req: NextRequest) {
  try {
    // IMPORTANT: Create a new Supabase client with the SERVICE_ROLE_KEY
    // for elevated privileges required for this backend operation.
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { persistSession: false } } // We don't need to persist sessions for a service role client
    );

    const payload: WebhookPayload[] = await req.json();

    if (!payload || !Array.isArray(payload) || payload.length === 0) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }
    const { phone, conversation: task } = payload[0];

    if (!phone || !task) {
      return NextResponse.json({ error: "Missing phone or task in payload" }, { status: 400 });
    }

    // Find the user by phone number
    const { data: userData, error: userError } = await supabase
      .from("phone")
      .select("user_id")
      .eq("phone", phone)
      .single();

    if (userError || !userData) {
      console.error(`User not found for phone ${phone}:`, userError?.message);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { user_id } = userData;

    // Create the todo for that user
    const { data: todoData, error: todoError } = await supabase
      .from("todos")
      .insert({ task, user_id })
      .select();

    if (todoError) {
      console.error(`Failed to create todo for user ${user_id}:`, todoError.message);
      return NextResponse.json({ error: "Failed to create todo" }, { status: 500 });
    }

    console.log(`Todo created for user ${user_id}:`, todoData);
    return NextResponse.json({
      initRequest: payload[0],
      message: "Task created successfully"
    }, { status: 200 });

  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : "Unknown error";
    console.error("Webhook processing error:", errorMessage);
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}