import { Roboto } from 'next/font/google'
 
const roboto = Roboto({
  weight: '400',
  subsets: ['latin'],
})
 

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className={roboto.className}>
      {children}
    </div>
  )
}