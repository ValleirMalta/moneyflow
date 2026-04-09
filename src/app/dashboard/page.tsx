"use client";
import { useState, useEffect } from "react";
import LogoutButton from "../../components/Logoutbutton";
import { createClient } from "@/lib/supabase/client";
interface UserMetadata {
  nickname: string;
  email?: string;
}
export default function Dashboard() {
 
 const [user, setUser] = useState<Record<string, any> | null>(null);
  const supabase = createClient();
    useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
        setUser(data?.session?.user?.user_metadata as UserMetadata ?? null);
    });
    }, []);
    console.log("user", user)
return (
    <div>
      <header>
        <h1>Seja bem-vindo, {user?.nickname}!</h1>
        <LogoutButton />
      </header>
      
    </div>
  );
}