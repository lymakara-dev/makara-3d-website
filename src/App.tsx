import { useEffect, useState } from "react";
import ModeSelector from "./components/ModeSelector";
import ThreeScene from "./ThreeScene";
import { type ModeKey } from "./modes";
import Hero from "./components/Hero";
import Skills from "./components/Skills";
import ExperienceList from "./components/ExperienceList";
import Contact from "./components/Contact";

function App() {
  const [mode, setMode] = useState<ModeKey>(() => {
    const saved = localStorage.getItem("mode");
    return (saved as ModeKey) || "dark";
  });

  useEffect(() => {
    const html = document.documentElement;

    // Remove old mode classes
    html.classList.remove(
      "mode-light",
      "mode-dark",
      "mode-aurora",
      "mode-snow",
      "mode-fireflies",
      "mode-galaxy",
      "mode-fog"
    );

    // Add selected mode class to <html>
    html.classList.add(`mode-${mode}`);

    localStorage.setItem("mode", mode);
  }, [mode]);

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-500">
      {/* HEADER */}
      <header className="w-full py-6 px-6 md:px-12 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Ly Makara</h1>
          <p className="text-sm opacity-70">Full Stack Developer</p>
        </div>
      </header>

      {/* MAIN */}
      <main className="flex-1 md:flex">
        <section className="md:w-1/2 h-[70vh] md:h-screen">
          <ThreeScene mode={mode} />
        </section>

        <aside className="md:w-1/2 backdrop-blur-xl bg-white/10 dark:bg-black/20 p-6 md:p-10 space-y-8 rounded-xl">
          <Hero />
          <Skills />
          <ExperienceList />
          <Contact />
        </aside>
      </main>

      {/* FOOTER */}
      <footer className="py-6 text-center text-xs opacity-70">
        © {new Date().getFullYear()} Ly Makara — Built with React Three Fiber +
        Tailwind
      </footer>

      {/* MODE SELECTOR */}
      <ModeSelector value={mode} onChange={setMode} />
    </div>
  );
}

export default App;
