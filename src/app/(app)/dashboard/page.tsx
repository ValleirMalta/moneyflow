// "use client";
import { createClient } from '@/lib/supabase/server'
import styles from "./dashboard.module.css";
// }
export default async function Dashboard() {
 const supabase = await createClient();
 const { data, error } = await supabase.from('profiles').select('*');
return (
    <main  className={styles.dashboard}>

      {error ? (
        <p style={{ color: 'red' }}>❌ Erro ao conectar: {error.message}</p>
      ) : (
        <div>
          <p style={{ color: 'green' }}>✅ Conexão com o Supabase local estabelecida com sucesso!</p>
          <p>Dados encontrados na tabela profiles: {data?.length || 0} registos</p>
        </div>
      )}
      <header className={styles.title}>
        <h1>Dashbord</h1>
      </header>
      <div  className={styles.currentMonth}>
        <h2 className={styles.titleCurrentMonth}>Mês Atual</h2>
        <p className={styles.Month}>Abril 2025</p>
        <ul>
          <li>
            <span>Renda</span>
            <p>R$ 5.800</p>
          </li>
          <li>
            <span>Dívidas</span>
            <p>R$ 3.340</p>
          </li>
          <li>
            <span>Saldo</span>
            <p>R$ 6.700</p>
          </li>
          <li>
            <span>Progresso</span>
            <p>R44% Pago</p>
          </li>
        </ul>
      </div>
      <div>
        <h2>Historio de meses</h2>
      </div>
    </main>
  );
}