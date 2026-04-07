import './globals.css'
import Providers from '../components/Providers'

export const metadata = {
  title: 'Synthesis Glass',
  description: 'High quality American made glass art since 1997',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
