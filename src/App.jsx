import Navbar from "./components/Navbar";
import SacredSakuraHero from "./components/SacredSakuraHero";

export default function App() {
  return (
    <div className="min-h-screen relative bg-inazuma-dark text-white overflow-x-hidden">
      <Navbar />
      
      {/* Your New Interactive Lightning Hero! */}
      <SacredSakuraHero />
    </div>
  );
}