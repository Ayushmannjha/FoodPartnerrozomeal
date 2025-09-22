import { ImageWithFallback } from "../figma/ImageWithFallback";

export function ContactImage() {
  return (
    <div className="relative rounded-2xl overflow-hidden shadow-lg">
      <ImageWithFallback
        src="https://images.unsplash.com/photo-1551888797-ec22463d8461?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
        alt="Happy restaurant owner"
        className="w-full h-64 object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end">
        <div className="p-6 text-white">
          <p className="text-lg font-semibold mb-2">Join 25,000+ Partners</p>
          <p className="text-sm opacity-90">Start your success story with RozoMeal today</p>
        </div>
      </div>
    </div>
  );
}
