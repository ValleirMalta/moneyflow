import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Sidebar from "@/components/Sidebar";
import styles from "./app.module.css";
 
export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
 
  if (!user) redirect("/login");
 
  const nickname = user.user_metadata?.nickname ?? "usuário";
  const email = user.email ?? "";
 
  return (
    <div className={styles.appLayout}>
      <Sidebar nickname={nickname} email={email} />
      <main className={styles.main}>
        {children}
      </main>
    </div>
  );
}
 