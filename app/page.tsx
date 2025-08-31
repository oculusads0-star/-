import HeroCanvas from "./(site)/_components/HeroCanvas";

export default function Page(){
  return (
    <main>
      <section className="hero">
        <HeroCanvas />
        <div style={{position:'relative', zIndex:2}}>
          <h1>Build your smart brand with style</h1>
          <p>Elegant landing with a live liquid shader background. Clean, fast, and ready for Vercel deploy.</p>
          <div className="cta">
            <a href="#features" className="btn primary">Get Started</a>
            <a href="https://vercel.com" target="_blank" className="btn">Deploy</a>
          </div>
        </div>
      </section>

      <section id="features" className="section">
        <div className="cards">
          <div className="card">
            <h3>Next.js (App Router)</h3>
            <p>Production-ready structure with meta, layout, and fast routing.</p>
          </div>
          <div className="card">
            <h3>WebGL Hero</h3>
            <p>Custom GLSL shader with noise layers for liquid visuals.</p>
          </div>
          <div className="card">
            <h3>Simple Styling</h3>
            <p>Lightweight CSS with modern layout and responsive grid.</p>
          </div>
        </div>
      </section>
    </main>
  )
}
