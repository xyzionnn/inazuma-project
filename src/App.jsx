import { motion } from "framer-motion";
import Navbar from "./components/Navbar";

function App() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      <Navbar />

      {/* Background Decorative "Glows" */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-electro-purple/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-sakura/10 rounded-full blur-[100px]" />

      <main className="flex flex-col items-center justify-center min-h-screen pt-20 px-4 text-center">
        {/* The Main Title */}
        <motion.h1 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-8xl font-black mb-4 tracking-tighter"
        >
          <span className="text-white">SHINE </span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-electro-purple to-sakura">
            ETERNAL
          </span>
        </motion.h1>

        {/* The Subtitle */}
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-white/60 text-lg max-w-xl leading-relaxed italic"
        >
          "The lightning's flash lasts but a moment, but the vision of eternity 
          is etched into the soul of Inazuma."
        </motion.p>

        {/* Interactive Vision Button */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-12"
        >
          <div className="w-24 h-24 rounded-full bg-inazuma-dark border-4 border-electro-purple flex items-center justify-center shadow-[0_0_40px_rgba(187,134,252,0.4)] cursor-pointer hover:scale-110 transition-transform">
             <span className="text-4xl">⚡</span>
          </div>
          <p className="mt-4 text-xs tracking-widest text-electro-purple uppercase font-bold">Unleash Burst</p>
        </motion.div>
      </main>
    </div>
  );
}

export default App;