import './globals.css'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/james-dean-logo.png" type="image/png" />
        <title>Minam - API Generator</title>
        <meta name="description" content="Transform any data into profitable APIs with AI-powered validation" />
      </head>
      <body className="min-h-screen bg-gradient-dark text-white">
        <div className="min-h-screen">
          {children}
        </div>
      </body>
    </html>
  );
}
