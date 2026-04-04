import { redirect } from 'next/navigation'

export default function Inicio() {
  redirect('/login')
}

// export default function Home() {
//   return (
//     <main>
//       <h1>MoneyFlow</h1>
//     </main>
//   );
// }