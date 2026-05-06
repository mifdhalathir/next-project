import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Navbar Cart Icon
nav_links = """<a href="kasir.html"
                    class="bg-white/10 hover:bg-white/20 text-cream-100 px-4 py-1.5 rounded text-sm transition border border-white/10">🖥️ Kasir</a>
                <a href="login.html"
                    class="bg-amber-700 hover:bg-amber-800 text-white px-4 py-1.5 rounded text-sm transition">Login</a>"""
nav_replacement = """<button id="navCartBtn" class="relative text-2xl text-cream-100 hover:scale-110 transition mr-2">
                    🛒
                    <span id="navCartBadge" class="absolute -top-1 -right-2 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full hidden">0</span>
                </button>
                <a href="kasir.html"
                    class="bg-white/10 hover:bg-white/20 text-cream-100 px-4 py-1.5 rounded text-sm transition border border-white/10">🖥️ Kasir</a>
                <a href="login.html"
                    class="bg-amber-700 hover:bg-amber-800 text-white px-4 py-1.5 rounded text-sm transition">Login</a>"""
content = content.replace(nav_links, nav_replacement)

# 2. Menu Header (Auto-Fill)
menu_header = """<div class="w-16 h-0.5 bg-amber-700 mx-auto mt-4"></div>
            </div>"""
menu_header_replacement = """<div class="w-16 h-0.5 bg-amber-700 mx-auto mt-4"></div>
            </div>
            
            <div id="orderMemoryHeader" class="text-center mb-8 fade-in hidden">
                <div class="inline-block bg-amber-100 border border-amber-200 px-6 py-3 rounded-xl">
                    <p class="text-amber-800 font-medium">Halo, <span id="omName" class="font-bold"></span>!</p>
                    <p class="text-stone-600 text-sm mt-1">Memesan untuk Meja: <span id="omTable" class="font-bold text-wood-800"></span></p>
                </div>
            </div>"""
content = content.replace(menu_header, menu_header_replacement)

# 3. Filter Buttons
filter_btns = """<div class="flex flex-wrap justify-center gap-3 mb-10 fade-in">
                <button
                    class="filter-btn active px-5 py-2 rounded-full border border-amber-700 text-amber-700 text-sm font-medium"
                    data-category="all">Semua</button>
                <button
                    class="filter-btn px-5 py-2 rounded-full border border-amber-700 text-amber-700 text-sm font-medium"
                    data-category="coffee">Coffee</button>
                <button
                    class="filter-btn px-5 py-2 rounded-full border border-amber-700 text-amber-700 text-sm font-medium"
                    data-category="non-coffee">Non-Coffee</button>
                <button
                    class="filter-btn px-5 py-2 rounded-full border border-amber-700 text-amber-700 text-sm font-medium"
                    data-category="meals">Meals</button>
            </div>"""
filter_btns_replacement = """<div class="flex flex-wrap justify-center gap-3 mb-10 fade-in">
                <button
                    class="filter-btn active px-5 py-2 rounded-full border border-amber-700 text-amber-700 text-sm font-medium"
                    data-category="all">Semua</button>
                <button
                    class="filter-btn px-5 py-2 rounded-full border border-amber-700 text-amber-700 text-sm font-medium"
                    data-category="coffee">Kopi</button>
                <button
                    class="filter-btn px-5 py-2 rounded-full border border-amber-700 text-amber-700 text-sm font-medium"
                    data-category="non-coffee">Non-Kopi</button>
                <button
                    class="filter-btn px-5 py-2 rounded-full border border-amber-700 text-amber-700 text-sm font-medium"
                    data-category="meals">Makanan</button>
            </div>"""
content = content.replace(filter_btns, filter_btns_replacement)

# 4. Menu Cards
def replace_card_button(match):
    image = match.group(1)
    title = match.group(2)
    desc = match.group(3)
    price = match.group(4)
    price_val = match.group(5)
    name = match.group(6)
    
    return f'''<div class="h-36 overflow-hidden"><img src="{image}" alt="{title}"
                            class="w-full h-full object-cover hover:scale-110 transition duration-500"></div>
                    <div class="p-4">
                        <h3 class="font-display text-md font-semibold text-wood-800">{title}</h3>
                        <p class="text-stone-500 text-xs mt-1">{desc}</p>
                        <div class="mt-3 flex justify-between items-center">
                            <p class="text-amber-700 font-bold text-sm">Rp {price}</p>
                            <button type="button" class="tambah-keranjang-btn bg-amber-700 hover:bg-amber-800 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition shadow" data-name="{name}" data-price="{price_val}" data-image="{image}">Tambah ke Keranjang</button>
                        </div>
                    </div>'''

pattern = re.compile(r'''<div class="h-36 overflow-hidden"><img src="([^"]+)" alt="[^"]*"
\s*class="w-full h-full object-cover hover:scale-110 transition duration-500(?: grayscale-\[0\.2\]| hue-rotate-180)?">\s*</div>\s*<div class="p-4">\s*<h3 class="font-display text-md font-semibold text-wood-800">([^<]+)</h3>\s*<p class="text-stone-500 text-xs mt-1">([^<]+)</p>\s*<div class="mt-3 flex justify-between items-center">\s*<p class="text-amber-700 font-bold text-sm">Rp ([0-9\.]+)</p>\s*<div\s*class="flex items-center gap-2 bg-amber-100 dark:bg-amber-900/40 rounded-full px-2 py-1">\s*<button type="button"\s*class="menu-min-btn[^"]*"\s*data-price="(\d+)" data-name="([^"]+)">-</button>\s*<span class="menu-qty[^"]*">0</span>\s*<button type="button"\s*class="menu-plus-btn[^"]*"\s*data-price="\d+" data-name="[^"]+">\+</button>\s*</div>\s*</div>\s*</div>''', re.MULTILINE)

content = pattern.sub(replace_card_button, content)

# 5. Add ETA Widget
eta_widget = """<!-- ETA Widget -->
    <div id="etaWidget" class="fixed bottom-6 left-6 z-[60] bg-white dark:bg-wood-800 border border-amber-200 dark:border-wood-700 p-4 rounded-2xl shadow-2xl transform transition-transform duration-500 translate-y-32 opacity-0 flex items-center gap-4 hidden">
        <div class="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-2xl animate-spin-slow" id="etaIcon">⏳</div>
        <div>
            <h4 class="font-bold text-wood-800 dark:text-cream-100 text-sm" id="etaTitle">Pesananmu sedang diracik</h4>
            <p id="etaCountdown" class="text-amber-700 dark:text-amber-500 font-black text-lg">10:00</p>
        </div>
    </div>
    
    <style>
    @keyframes pulse-fast {
        0%, 100% { transform: scale(1); opacity: 1; color: #f59e0b; }
        50% { transform: scale(1.05); opacity: 0.8; color: #d97706; }
    }
    .animate-pulse-fast { animation: pulse-fast 1s infinite; }
    .animate-spin-slow { animation: spin 4s linear infinite; }
    @keyframes spin { 100% { transform: rotate(360deg); } }
    </style>
"""

if "<!-- ETA Widget -->" not in content:
    if "<!-- TESTIMONI -->" in content:
        content = content.replace("<!-- TESTIMONI -->", eta_widget + "\n    <!-- TESTIMONI -->")

# 6. Update Cart Modal (Remove static items, we'll populate via JS, but we need +/- buttons logic)
# Actually, the static items are overridden by JS `cartItemsList.innerHTML`.
# The current JS creates the list but without +/-, only a remove button.
# Let's fix that via Python too by modifying the cart JS logic later.

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)
