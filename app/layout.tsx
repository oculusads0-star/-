import "./../styles/globals.css";

export const metadata = {
  title: "Liquid Landing",
  description: "A sleek landing page with a liquid WebGL hero."
};

export default function RootLayout({children}:{children: React.ReactNode}){
  return (
    <html lang="en">
      <body>
        <div className="container">
          <nav className="nav">
            <div className="logo">Liquid<span style={{opacity:.6}}>Landing</span></div>
            <div className="badge">Demo</div>
          </nav>
          {children}
          <footer className="footer">
            Built for Zaid — Next.js + WebGL ✦
          </footer>
        </div>
      </body>
    </html>
  );
}
