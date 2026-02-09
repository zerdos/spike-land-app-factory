// zoli.tsx
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";

export default () => {
  return (
    <Card className="min-h-[10vh] flex flex-col justify-center items-center text-center text-[calc(10px+2vmin)] text-gray-800 bg-gradient-to-br from-blue-300 to-cyan-200">
      <div className="animate-pulse hover:scale-110 transition-transform duration-300">
        <div className="text-[calc(20px+20vmin)] mb-10">🌈</div>
      </div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="max-w-3xl mb-10 leading-relaxed p-8 bg-white/80 rounded-lg">
        <h2 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-5 text-gray-800">The Magic of Rainbows</h2>
        <p className="leading-7 [&:not(:first-child)]:mt-6">Rainbows are one of nature's most spectacular displays, captivating humans for millennia with their vibrant arcs of color. These ethereal phenomena occur when sunlight interacts with water droplets in the atmosphere, creating a prism effect that separates white light into its component colors. The result is a breathtaking display of red, orange, yellow, green, blue, indigo, and violet – the familiar ROYGBIV sequence.</p>
        <p className="leading-7 [&:not(:first-child)]:mt-6">Beyond their scientific explanation, rainbows hold deep cultural and symbolic significance across the world. They often represent hope, promise, and new beginnings. In many mythologies, rainbows are seen as bridges between the earthly and divine realms. Today, the rainbow flag stands as a powerful symbol of diversity, inclusivity, and pride for the LGBTQ+ community.</p>
        <p className="leading-7 [&:not(:first-child)]:mt-6">Whether viewed as a meteorological marvel or a symbol of unity, rainbows continue to inspire wonder and joy, reminding us of the beauty and diversity that surrounds us in nature and in our global community.</p>
      </motion.div>

      <p className="text-sm text-gray-600 mt-5">Created with 💖 by [Your Name]</p>
    </Card>
  );
};
