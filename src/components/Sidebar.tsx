"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";
import styles from "./Sidebar.module.css";

interface SidebarProps {
  nickname: string;
  email: string;
}

export default function Sidebar({ nickname, email }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  const initials = nickname?.slice(0, 2).toUpperCase() ?? "??";

  const navItems = [
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <rect x="3" y="3" width="7" height="7" rx="1"/>
          <rect x="14" y="3" width="7" height="7" rx="1"/>
          <rect x="3" y="14" width="7" height="7" rx="1"/>
          <rect x="14" y="14" width="7" height="7" rx="1"/>
        </svg>
      ),
    },
    {
      href: "/incomes",
      label: "Rendas",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
        </svg>
      ),
    },
    {
      href: "/expenses",
      label: "Dívidas",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <rect x="2" y="5" width="20" height="14" rx="2"/>
          <path d="M2 10h20"/>
        </svg>
      ),
    },
    {
      href: "/reports",
      label: "Relatórios",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <line x1="18" y1="20" x2="18" y2="10"/>
          <line x1="12" y1="20" x2="12" y2="4"/>
          <line x1="6" y1="20" x2="6" y2="14"/>
        </svg>
      ),
    },
  ];

  return (
    <aside className={styles.sidebar}>
      <div>
        <div className={styles.logo}>
            <Image
                src="/logo.svg"
                width={500}
                height={500}
                alt="Picture of the author"
                className={styles.logoSvg}
            />
        </div>
        <nav className={styles.nav}>
          {navItems.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.navItem} ${pathname === item.href ? styles.active : ""}`}
            >
              <span className={styles.navIcon}>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className={styles.footer}>
        <div className={styles.userBox}>
          <div className={styles.avatar}>{initials}</div>
          <div className={styles.userInfo}>
            <div className={styles.userName}>{nickname}</div>
            <div className={styles.userEmail}>{email}</div>
          </div>
          <button
            className={styles.logoutBtn}
            onClick={handleLogout}
            title="Sair"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="15" height="15">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
          </button>
        </div>
      </div>
    </aside>
  );
}