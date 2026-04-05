
import styles from '../auth.module.css';
async function delay() {
  return new Promise((resolve) => setTimeout(resolve, 1000));
}export default async function Login() {
  await delay();
  return (
    <main>

      <form  className={styles.formAuth}>
        <div className={styles.inputGroup}>
          <input type="email" placeholder="Digite seu email" />
        </div>

        <div className={styles.inputGroup}>
          <input type="password" placeholder="Digite sua senha" />
        </div>

        <button type="submit" className="button">
          Entrar
        </button>
      </form>
    </main>
  );
}