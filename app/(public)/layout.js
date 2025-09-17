import Header from '@/app/components/Header'
import Footer from '@/app/components/Footer'

import "@/app/globals.css"

export default function RootLayout({ children }) {
  return (
    <html lang="th">
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  )
}