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
    <section className="relative py-24 px-4 overflow-hidden group/insta">
      {/* Dynamic Background for Instagram Section */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/images/empty_cafe_interior.png" 
          alt="Cafe Background" 
          className="w-full h-full object-cover transition-transform duration-[10s] group-hover/insta:scale-110"
        />
        <div className="absolute inset-0 bg-stone-950/80 backdrop-blur-sm"></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16" data-aos="fade-up">
          <div className="inline-block px-4 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 mb-4">
            <p className="text-amber-500 tracking-[.4em] text-[10px] font-black uppercase">Social Connection</p>
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-black text-white tracking-tighter italic uppercase">
            @karsacafe <span className="text-amber-500">on Instagram</span>
          </h2>
          <div className="w-12 h-1 bg-amber-500 mx-auto mt-6"></div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6" data-aos="fade-up" data-aos-delay="200">
          {INSTA_POSTS.map((post, i) => (
            <div 
              key={i} 
              className="group relative aspect-square overflow-hidden rounded-[2.5rem] cursor-pointer border border-white/5 shadow-2xl"
            >
              <img 
                src={post.img} 
                alt="Instagram post" 
                className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500"></div>
              
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center gap-8 backdrop-blur-[4px]">
                <div className="flex flex-col items-center gap-1 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="currentColor" className="text-amber-500 drop-shadow-glow"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                  <span className="font-black text-sm tracking-tighter">124</span>
                </div>
                <div className="flex flex-col items-center gap-1 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75">
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500 drop-shadow-glow"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                  <span className="font-black text-sm tracking-tighter">12</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
