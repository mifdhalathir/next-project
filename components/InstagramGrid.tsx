"use client";

const INSTA_POSTS = [
  { img: "/images/hero-bg.png" },
  { img: "/images/kopi-susu-karsa.png" },
  { img: "/images/matcha-latte.png" },
  { img: "/images/nasi-goreng-katsu.png" },
  { img: "/images/indomie-goreng.png" },
  { img: "/images/mix-platter.png" },
];

export default function InstagramGrid() {
  return (
    <section className="py-20 px-4 bg-wood-950 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12" data-aos="fade-up">
          <p className="text-amber-500 tracking-[.3em] text-xs uppercase mb-2">Social Feed</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white">@karsacafe <span className="text-amber-500">on Instagram</span></h2>
          <div className="w-16 h-0.5 bg-amber-500 mx-auto mt-4"></div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4" data-aos="fade-up" data-aos-delay="200">
          {INSTA_POSTS.map((post, i) => (
            <div 
              key={i} 
              className="group relative aspect-square overflow-hidden rounded-2xl cursor-pointer"
            >
              <img 
                src={post.img} 
                alt="Instagram post" 
                className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:blur-[2px]" 
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center gap-6 backdrop-blur-[1px]">
                <div className="flex items-center gap-1 text-white scale-90 group-hover:scale-100 transition-transform duration-500">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                  <span className="font-bold">124</span>
                </div>
                <div className="flex items-center gap-1 text-white scale-90 group-hover:scale-100 transition-transform duration-500">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                  <span className="font-bold">12</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
