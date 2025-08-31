import { DeployButton } from "@/components/deploy-button";
import { EnvVarWarning } from "@/components/env-var-warning";
import { AuthButton } from "@/components/auth-button";
import { Hero } from "@/components/hero";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { ConnectSupabaseSteps } from "@/components/tutorial/connect-supabase-steps";
import { SignUpUserSteps } from "@/components/tutorial/sign-up-user-steps";
import { hasEnvVars } from "@/lib/utils";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center">
      <div className="flex-1 w-full flex flex-col gap-20 items-center">
        <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
          <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
            <div className="flex gap-5 items-center font-semibold">
              <Link href={"/"}>Next.js Supabase Starter</Link>
              <Link href={"/protected/todos"}>Todos</Link>
              <div className="flex items-center gap-2">
                <DeployButton />
              </div>
            </div>
            {!hasEnvVars ? <EnvVarWarning /> : <AuthButton />}
          </div>
        </nav>
        <div className="flex-1 flex flex-col gap-20 max-w-5xl p-5">
          <Hero />
          <main className="flex-1 flex flex-col gap-6 px-4">
            <h2 className="font-medium text-xl mb-4">Next steps</h2>
            {hasEnvVars ? <SignUpUserSteps /> : <ConnectSupabaseSteps />}
          </main>
        </div>

        <footer className="w-full flex flex-col items-center justify-center border-t mx-auto text-center text-xs gap-4 py-8">
          <p className="flex flex-wrap justify-center gap-2">
            Powered by{" "}
            <span className="font-bold hover:underline" rel="noreferrer">
              Next.js
            </span>
            ,{" "}
            <span className="font-bold hover:underline" rel="noreferrer">
              Supabase
            </span>
            ,{" "}
            <span className="font-bold hover:underline" rel="noreferrer">
              Vercel
            </span>
            ,{" "}
            <span className="font-bold hover:underline" rel="noreferrer">
              n8n
            </span>
            , and{" "}
            <span className="font-bold hover:underline" rel="noreferrer">
              Evolution
            </span>
            .
          </p>
          <ThemeSwitcher />
        </footer>
      </div>
    </main>
  );
}
