// import { redirect } from "next/navigation";

import Sidebar from "@/components/Sidebar";
import styles from "./app.module.css";
 
export default async function AppLayout({ children }: { children: React.ReactNode }) {

 
  return (
    <div className={styles.appLayout}>
      <Sidebar />
      <main className={styles.main}>
        {children}
      </main>
    </div>
  );
}
 