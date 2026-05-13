import { motion } from "framer-motion";

export default function ProjectCard({ title, description, tags }) {
  return (
    <motion.div 
      whileHover={{ scale: 1.05 }}
      className="relative group bg-white/5 border border-white/10 p-6 rounded-xl backdrop-blur-sm overflow-hidden"
    >
      {/* The "Glow" behind the card on hover */}
      <div className="absolute inset-0 bg-electro-purple/10 opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <h3 className="text-2xl font-bold text-sakura mb-2">{title}</h3>
      <p className="text-white/60 text-sm mb-4">{description}</p>
      
      <div className="flex gap-2">
        {tags.map(tag => (
          <span key={tag} className="text-[10px] px-2 py-1 rounded-full border border-electro-purple/50 text-electro-purple uppercase font-bold">
            {tag}
          </span>
        ))}
      </div>
    </motion.div>
  );
}