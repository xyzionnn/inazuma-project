export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 flex justify-between items-center px-12 py-6 bg-white/5 backdrop-blur-md border-b border-white/10">
      <div className="text-xl font-bold tracking-widest text-sakura">
        INAZUMA <span className="text-electro-purple">PROJECT</span>
      </div>
      <div className="flex gap-8 text-sm uppercase tracking-widest font-medium">
        <a href="#" className="hover:text-electro-purple transition">Islands</a>
        <a href="#" className="hover:text-electro-purple transition">Characters</a>
        <a href="#" className="hover:text-electro-purple transition">Lore</a>
      </div>
      <button className="px-6 py-2 border border-electro-purple text-electro-purple hover:bg-electro-purple hover:text-white transition-all rounded-sm">
        Enter Plane
      </button>
    </nav>
  )
}