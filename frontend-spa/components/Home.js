import { store, router } from '../app.js';

export default {
  template: `
    <div class="space-y-10">
      <!-- Full page offline error -->
      <div v-if="!apiOnline" class="flex flex-col items-center justify-center min-h-[60vh] bg-white neo-border text-black p-10 shadow-[6px_6px_0px_0px_#000000] text-center space-y-4">
        <span class="text-6xl">🔌</span>
        <h1 class="font-display font-black text-3xl md:text-4xl uppercase tracking-tighter text-black">Server API Tidak Terhubung</h1>
        <p class="font-mono text-sm text-zinc-600 max-w-md mx-auto">
          Backend API tidak dapat dihubungi. Pastikan server backend aktif dan URL API sudah benar.
        </p>
        <button 
          @click="fetchCatalogData"
          class="inline-flex items-center justify-center font-display font-bold neo-border text-black transition-all rounded-none cursor-pointer select-none text-sm px-5 py-2.5 bg-neo-yellow hover:bg-[#ffed4a] shadow-[3px_3px_0px_#000000] hover:shadow-[5px_5px_0px_#000000]"
        >
          🔄 Coba Lagi
        </button>
        <p class="font-mono text-[10px] text-zinc-400">Halaman ini membutuhkan koneksi ke REST API untuk menampilkan data.</p>
      </div>

      <!-- Normal content -->
      <template v-else>
      <!-- 1. HERO HEADER AREA -->
      <div class="relative neo-border-thick bg-neo-yellow p-6 md:p-10 shadow-[6px_6px_0px_0px_#000000] rotate-[-0.5deg]">
        <div class="absolute top-2 right-2 md:top-4 md:right-4 font-mono text-[10px] md:text-xs bg-black text-white px-2 py-0.5 uppercase tracking-wider neo-border-thin">
          RESTful decoupled system
        </div>
        
        <div class="max-w-3xl space-y-4">
          <span class="inline-block font-mono font-bold px-3 py-1 text-xs neo-border-thin shadow-[1.5px_1.5px_0px_#000000] rotate-[-1deg] select-none bg-neo-magenta text-white">
            WEB PROGRAMMING 2 UAS
          </span>
          <h1 class="font-display font-black text-3xl md:text-5xl lg:text-6xl uppercase tracking-tighter leading-none text-black mt-2">
            KOMIK & BUKU DIGITAL <br />
            <span class="bg-white px-2 italic neo-border-thin shadow-[2px_2px_0px_#000]">RENTAL PORTAL</span>
          </h1>
          <p class="font-mono text-xs md:text-sm text-black font-medium leading-relaxed max-w-2xl bg-white/70 p-3 neo-border-thin">
            Aplikasi sirkulasi buku digital dengan performa tinggi. Rasakan antarmuka <b>Neo-Brutalist</b> yang responsif, terintegrasi penuh dengan <b>REST API Server</b> menggunakan interseptor token siber dan basis data persisten.
          </p>
          
          <div class="flex flex-wrap gap-3 pt-2">
            <button 
              v-if="isAdmin" 
              @click="goToAdmin"
              class="inline-flex items-center justify-center font-display font-bold neo-border text-black transition-all rounded-none cursor-pointer select-none text-sm px-5 py-2.5 bg-neo-magenta hover:bg-[#ff33ff] text-white shadow-[3px_3px_0px_#000000] hover:shadow-[5px_5px_0px_#000000] hover:-translate-x-0.5 hover:-translate-y-0.5 active:shadow-[1px_1px_0px_#000000] active:translate-x-0.5 active:translate-y-0.5"
            >
              Masuk Dashboard Admin 
              <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
              </svg>
            </button>
            <button 
              v-else 
              @click="openLogin"
              class="inline-flex items-center justify-center font-display font-bold neo-border text-black transition-all rounded-none cursor-pointer select-none text-sm px-5 py-2.5 bg-black text-white hover:bg-zinc-800 border-white shadow-[3px_3px_0px_#000000] hover:shadow-[5px_5px_0px_#000000] hover:-translate-x-0.5 hover:-translate-y-0.5 active:shadow-[1px_1px_0px_#000000] active:translate-x-0.5 active:translate-y-0.5"
            >
              Login Administrator 
              <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
              </svg>
            </button>
            <button 
              @click="fetchCatalogData"
              class="inline-flex items-center justify-center font-display font-bold neo-border text-black transition-all rounded-none cursor-pointer select-none text-sm p-0 w-10 h-10 bg-white hover:bg-gray-100 shadow-[3px_3px_0px_#000000]"
              title="Sinkronkan data API"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 7.89M9 11l3-3 3 3"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- 2. STATS RIBBON BANNER -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <!-- Stats Card 1 -->
        <div class="bg-white neo-border text-black p-5 relative rounded-none border-t-[8px] border-t-neo-teal shadow-[6px_6px_0px_0px_#000000]">
          <div class="flex items-center gap-3">
            <div class="bg-neo-teal p-2.5 neo-border-thin">
              <svg class="w-5 h-5 text-black" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
              </svg>
            </div>
            <div>
              <p class="font-mono text-[10px] text-zinc-600 uppercase font-black">Total Publikasi</p>
              <h3 class="font-display font-black text-2xl text-black">{{ totalBookCount }}</h3>
            </div>
          </div>
        </div>

        <!-- Stats Card 2 -->
        <div class="bg-white neo-border text-black p-5 relative rounded-none border-t-[8px] border-t-neo-magenta shadow-[6px_6px_0px_0px_#000000]">
          <div class="flex items-center gap-3">
            <div class="bg-neo-magenta p-2.5 neo-border-thin text-white">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path>
              </svg>
            </div>
            <div>
              <p class="font-mono text-[10px] text-zinc-600 uppercase font-black">Kategori</p>
              <h3 class="font-display font-black text-2xl text-black">{{ categories.length }}</h3>
            </div>
          </div>
        </div>

        <!-- Stats Card 3 -->
        <div class="bg-white neo-border text-black p-5 relative rounded-none border-t-[8px] border-t-neo-green shadow-[6px_6px_0px_0px_#000000]">
          <div class="flex items-center gap-3">
            <div class="bg-neo-green p-2.5 neo-border-thin text-white">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
            </div>
            <div>
              <p class="font-mono text-[10px] text-zinc-600 uppercase font-black">Penulis Terdaftar</p>
              <h3 class="font-display font-black text-2xl text-black">{{ authors.length }}</h3>
            </div>
          </div>
        </div>

        <!-- Stats Card 4 -->
        <div class="bg-white neo-border text-black p-5 relative rounded-none border-t-[8px] border-t-neo-orange shadow-[6px_6px_0px_0px_#000000]">
          <div class="flex items-center gap-3">
            <div class="bg-neo-orange p-2.5 neo-border-thin text-white">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path>
              </svg>
            </div>
            <div>
              <p class="font-mono text-[10px] text-zinc-600 uppercase font-black">Unit Tersedia</p>
              <h3 class="font-display font-black text-2xl text-black">{{ availableStockSum }} <span class="text-[10px] text-zinc-700 font-mono">buku</span></h3>
            </div>
          </div>
        </div>
      </div>

      <!-- 3. CATALOGUE FILTERS & BENTO LISTS -->
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        <!-- LEFT: FILTER CONTROLS CARD -->
        <div class="lg:sticky lg:top-20 z-10">
          <div class="bg-white neo-border text-black p-5 relative rounded-none shadow-[6px_6px_0px_0px_#000000] space-y-4">
            <!-- Header -->
            <div class="-mt-5 -mx-5 px-5 py-3 border-b-2 border-black font-display font-black text-lg bg-neo-teal text-black flex items-center justify-between">
              <span>PANEL FILTER KATALOG</span>
            </div>

            <!-- Text Search Input -->
            <div class="flex flex-col w-full relative">
              <label class="font-display font-bold text-black text-sm mb-1.5 tracking-tight flex items-center">
                Cari Buku / Komik
              </label>
              <input
                v-model="searchQuery"
                class="w-full bg-white neo-border p-2.5 font-mono text-sm rounded-none outline-none focus:ring-2 focus:ring-black focus:bg-amber-50/20 text-black placeholder-zinc-500 transition-all"
                placeholder="Judul, penulis, deskripsi..."
              />
              <svg class="absolute right-3 top-[37px] w-4 h-4 text-zinc-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>

            <!-- Categories Select -->
            <div class="flex flex-col w-full">
              <label class="font-display font-medium text-black text-sm mb-1.5 tracking-tight">
                Filter Kategori
              </label>
              <div class="relative">
                <select
                  v-model="selectedCategory"
                  class="w-full bg-white neo-border p-2.5 font-mono text-sm rounded-none outline-none appearance-none focus:ring-2 focus:ring-black text-black cursor-pointer transition-all"
                >
                  <option value="all">Semua Kategori</option>
                  <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
                </select>
                <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 border-l-2 border-black bg-neo-yellow text-black font-sans text-xs">
                  ▼
                </div>
              </div>
            </div>

            <!-- Authors Select -->
            <div class="flex flex-col w-full">
              <label class="font-display font-medium text-black text-sm mb-1.5 tracking-tight">
                Filter Penulis
              </label>
              <div class="relative">
                <select
                  v-model="selectedAuthor"
                  class="w-full bg-white neo-border p-2.5 font-mono text-sm rounded-none outline-none appearance-none focus:ring-2 focus:ring-black text-black cursor-pointer transition-all"
                >
                  <option value="all">Semua Penulis</option>
                  <option v-for="auth in authors" :key="auth.id" :value="auth.id">{{ auth.name }}</option>
                </select>
                <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 border-l-2 border-black bg-neo-yellow text-black font-sans text-xs">
                  ▼
                </div>
              </div>
            </div>

            <!-- Availability Checkbox -->
            <div class="pt-2 border-t-2 border-black">
              <label class="flex items-start gap-2.5 cursor-pointer group mt-2">
                <input
                  type="checkbox"
                  v-model="onlyAvailable"
                  class="w-5 h-5 neo-border cursor-pointer appearance-none checked:bg-neo-magenta checked:after:content-['✓'] checked:after:text-white checked:after:flex checked:after:justify-center checked:after:text-sm select-none"
                />
                <span class="font-display font-bold text-xs md:text-sm text-black select-none group-hover:text-neo-magenta transition-colors">
                  Hanya Stok Tersedia ({{ availableBooksCount }})
                </span>
              </label>
            </div>

            <!-- Helper Box -->
            <div class="bg-neo-beige p-3 neo-border border-dashed text-black mt-4">
              <p class="font-mono text-[9px] uppercase font-black mb-1">Butuh data awal?</p>
              <p class="font-mono text-[10px] text-zinc-700 leading-tight">
                Gunakan menu reset database di admin dashboard untuk memulihkan isi default perpustakaan secara instan.
              </p>
            </div>
          </div>
        </div>

        <!-- RIGHT: BENTO BOOKS LISTING -->
        <div class="lg:col-span-3 space-y-6">
          <div class="flex items-center justify-between border-b-4 border-black pb-2 bg-white p-3 neo-border shadow-[3px_3px_0px_#000]">
            <div>
              <h2 class="font-display font-black text-xl md:text-2xl uppercase tracking-tighter text-black">
                MENCARI DAN MEMBACA ({{ filteredBooks.length }} buku cocok)
              </h2>
              <p class="font-mono text-xs text-zinc-500">Menerapkan pencarian instan klien terdekopel.</p>
            </div>
            
            <div class="flex gap-2">
              <span class="w-3 h-3 rounded-full bg-neo-yellow neo-border-thin"></span>
              <span class="w-3 h-3 rounded-full bg-neo-magenta neo-border-thin"></span>
              <span class="w-3 h-3 rounded-full bg-neo-teal neo-border-thin"></span>
            </div>
          </div>

          <!-- Loading state -->
          <div v-if="loading" class="flex flex-col items-center justify-center p-20 bg-white neo-border shadow-[4px_4px_0px_0px_#000000]">
            <div class="animate-spin rounded-none w-10 h-10 border-4 border-black border-t-neo-magenta mb-4"></div>
            <p class="font-display font-bold text-base text-black uppercase tracking-wider">MENGAMBIL DATA DARI REST SERVER...</p>
            <p class="font-mono text-xs text-zinc-500 mt-1">Harap tunggu, server CodeIgniter 4 sedang dihubungi.</p>
          </div>

          <!-- Empty state -->
          <div v-else-if="filteredBooks.length === 0" class="p-16 text-center bg-white neo-border-thick shadow-[6px_6px_0px_0px_#000000] space-y-4">
            <span class="inline-block text-5xl">🔍</span>
            <h3 class="font-display font-black text-xl md:text-2xl uppercase text-black">Buku Tidak Ditemukan!</h3>
            <p class="font-mono text-xs text-zinc-500 max-w-md mx-auto">
              Silahkan ganti kata kunci pencarian Anda atau reset filter kategori / penulis di kolom samping kiri.
            </p>
            <button 
              @click="clearFilters"
              class="inline-flex items-center justify-center font-display font-bold neo-border text-black transition-all rounded-none cursor-pointer select-none text-xs px-3 py-1.5 bg-neo-teal hover:bg-[#33d0d8] shadow-[3px_3px_0px_#000000]"
            >
              Hapus Semua Filter
            </button>
          </div>

          <!-- Bento Grid Lists -->
          <div v-else class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            <div 
              v-for="book in filteredBooks" 
              :key="book.id"
              class="flex flex-col bg-white neo-border-thick text-black relative shadow-[4px_4px_0px_0px_#000000] hover:shadow-[7px_7px_0px_0px_#000000] hover:-translate-x-1 hover:-translate-y-1 transition-all h-full"
            >
              <!-- Cover image wrapper -->
              <div class="relative aspect-video w-full bg-zinc-200 border-b-2 border-black overflow-hidden group">
                <img
                  :src="book.coverUrl"
                  :alt="book.title"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  referrerpolicy="no-referrer"
                />
                <div class="absolute top-2 left-2 flex flex-col gap-1.5 items-start">
                  <span class="inline-block font-mono font-bold px-2 py-0.5 text-xs neo-border-thin shadow-[1.5px_1.5px_0px_#000000] rotate-[-1deg] select-none bg-neo-magenta text-white">
                    {{ book.categoryName || 'Lainnya' }}
                  </span>
                  <span class="inline-block font-mono font-bold px-2 py-0.5 text-xs neo-border-thin shadow-[1.5px_1.5px_0px_#000000] rotate-[-1deg] select-none bg-neo-teal text-black">
                    {{ book.authorName || 'Anonim' }}
                  </span>
                </div>

                <div class="absolute bottom-2 right-2">
                  <span class="bg-black text-white text-xs font-mono font-bold px-2.5 py-1 neo-border shadow-[1.5px_1.5px_0px_#FFE500]">
                    Rp {{ formatMoney(book.rentalPrice) }} / hari
                  </span>
                </div>
              </div>

              <!-- Card descriptions -->
              <div class="p-4 flex-1 flex flex-col justify-between space-y-4">
                <div class="space-y-2">
                  <h3 
                    @click="showDetails(book)"
                    class="font-display font-black text-lg text-black hover:text-neo-magenta cursor-pointer line-clamp-1"
                    :title="book.title"
                  >
                    {{ book.title }}
                  </h3>
                  <p class="font-sans text-xs text-zinc-600 line-clamp-3">
                    {{ book.description }}
                  </p>
                </div>

                <!-- Footer Card details -->
                <div class="flex items-center justify-between pt-3 border-t-2 border-black">
                  <div class="font-mono text-xs flex flex-col">
                    <span class="font-black text-[10px] text-zinc-500 uppercase">Stok Tersedia</span>
                    <span :class="book.stock > 0 ? 'text-neo-green font-black' : 'text-neo-orange font-black'" class="font-bold mt-0.5">
                      {{ book.stock }} unit {{ book.stock === 0 ? '(Habis!)' : '' }}
                    </span>
                  </div>

                  <button 
                    @click="showDetails(book)"
                    class="inline-flex items-center justify-center font-display font-bold neo-border text-black transition-all rounded-none cursor-pointer select-none text-xs px-3 py-1.5 bg-neo-yellow hover:bg-[#ffed4a] shadow-[3px_3px_0px_#000000]"
                  >
                    Lihat Detail
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 4. SELECTION DETAILS POPUP OVERLAY -->
      <div v-if="selectedBook" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <!-- Backdrop -->
        <div class="fixed inset-0 bg-black/60 backdrop-blur-xs" @click="closeDetails"></div>
        
        <!-- Modal Card Content -->
        <div class="z-10 bg-white neo-border-thick shadow-[8px_8px_0px_#000] w-full max-w-2xl p-6 relative max-h-[85vh] overflow-y-auto">
          <!-- Header decoration -->
          <div class="flex items-center justify-between border-b-2 border-black pb-3 mb-4">
            <span class="inline-block font-mono font-bold px-2 py-0.5 text-xs neo-border-thin shadow-[1.5px_1.5px_0px_#000000] rotate-[-1deg] select-none bg-neo-magenta text-white">
              DETAIL BUKU DIGITAL
            </span>
            <button
              @click="closeDetails"
              class="neo-border bg-neo-yellow px-2.5 py-1 font-display font-bold text-xs hover:bg-[#ffed4a] transition-all cursor-pointer shadow-[1.5px_1.5px_0px_#000]"
            >
              TUTUP (X)
            </button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Cover image viewer -->
            <div class="space-y-3">
              <div class="neo-border w-full aspect-[3/4] overflow-hidden shadow-[4px_4px_0px_#000]">
                <img
                  :src="selectedBook.coverUrl"
                  :alt="selectedBook.title"
                  class="w-full h-full object-cover"
                />
              </div>
              <div class="bg-neo-beige p-3 neo-border text-center">
                <p class="font-mono text-[10px] text-zinc-500 uppercase font-black">Biaya Sewa / Rental</p>
                <p class="font-display font-black text-lg text-black">
                  Rp {{ formatMoney(selectedBook.rentalPrice) }} <span class="text-xs font-mono font-medium">/ 24 Jam</span>
                </p>
              </div>
            </div>

            <!-- Meta attributes -->
            <div class="space-y-4 flex flex-col justify-between">
              <div class="space-y-3">
                <h2 class="font-display font-black text-2xl leading-tight text-black border-b-2 border-black pb-2">
                  {{ selectedBook.title }}
                </h2>
                
                <div class="grid grid-cols-2 gap-2">
                  <div class="neo-border bg-amber-50/20 p-2 text-xs font-mono">
                    <span class="block text-zinc-500 text-[10px] uppercase font-bold">Kategori</span>
                    <span class="font-bold text-black">{{ selectedBook.categoryName }}</span>
                  </div>
                  <div class="neo-border bg-amber-50/20 p-2 text-xs font-mono">
                    <span class="block text-zinc-500 text-[10px] uppercase font-bold">Penulis</span>
                    <span class="font-bold text-black">{{ selectedBook.authorName }}</span>
                  </div>
                  <div class="neo-border bg-amber-50/20 p-2 text-xs font-mono">
                    <span class="block text-zinc-500 text-[10px] uppercase font-bold">Batas Rental</span>
                    <span class="font-bold text-black">{{ selectedBook.rentalDuration }} Hari Maks.</span>
                  </div>
                  <div class="neo-border bg-amber-50/20 p-2 text-xs font-mono">
                    <span class="block text-zinc-500 text-[10px] uppercase font-bold">Status Stok</span>
                    <span :class="selectedBook.stock > 0 ? 'text-green-600' : 'text-red-600'" class="font-bold">
                      {{ selectedBook.stock > 0 ? selectedBook.stock + ' Unit' : 'Habis' }}
                    </span>
                  </div>
                </div>

                <div class="space-y-1">
                  <span class="font-display font-bold text-xs text-zinc-800 uppercase block">Sinopsis / Ringkasan</span>
                  <p class="font-sans text-xs text-zinc-700 leading-relaxed max-h-40 overflow-y-auto bg-neo-beige p-2 neo-border-thin">
                    {{ selectedBook.description }}
                  </p>
                </div>
              </div>

              <div class="pt-4 border-t-2 border-black space-y-2">
                <div class="flex gap-2">
                  <span v-if="selectedBook.stock > 0" class="inline-block font-mono font-bold px-2 py-0.5 text-xs neo-border-thin shadow-[1.5px_1.5px_0px_#000000] rotate-[-1deg] select-none bg-neo-green text-white w-full text-center py-1">
                    READY FOR DIGITAL DISTRIBUTION
                  </span>
                  <span v-else class="inline-block font-mono font-bold px-2 py-0.5 text-xs neo-border-thin shadow-[1.5px_1.5px_0px_#000000] rotate-[-1deg] select-none bg-neo-orange text-white w-full text-center py-1">
                    OUT OF STOCK IN LIBRARY
                  </span>
                </div>
                <p class="font-mono text-[9px] text-zinc-500 text-center leading-tight">
                  *Proses sewa/rental mandiri hanya tersedia untuk Anggota yang terdaftar oleh Administrator. Hubungi pustakawan admin untuk melakukan rental buku ini.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      </template>
    </div>
  `,
  data() {
    return {
      books: [],
      categories: [],
      authors: [],
      loading: true,
      apiOnline: true,
      searchQuery: '',
      selectedCategory: 'all',
      selectedAuthor: 'all',
      onlyAvailable: false,
      selectedBook: null,
      sharedStore: store
    };
  },
  computed: {
    isAdmin() {
      return this.sharedStore.isAdmin;
    },
    totalBookCount() {
      return this.books.length;
    },
    availableStockSum() {
      return this.books.reduce((sum, b) => sum + (b.stock > 0 ? b.stock : 0), 0);
    },
    availableBooksCount() {
      return this.books.filter(b => b.stock > 0).length;
    },
    filteredBooks() {
      return this.books.filter(book => {
        // 1. Text Search query
        const matchesSearch = 
          book.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          (book.description && book.description.toLowerCase().includes(this.searchQuery.toLowerCase())) ||
          (book.authorName && book.authorName.toLowerCase().includes(this.searchQuery.toLowerCase()));

        // 2. Category query
        const matchesCategory = this.selectedCategory === 'all' || book.categoryId === this.selectedCategory;

        // 3. Author query
        const matchesAuthor = this.selectedAuthor === 'all' || book.authorId === this.selectedAuthor;

        // 4. Stock toggle
        const matchesStock = !this.onlyAvailable || book.stock > 0;

        return matchesSearch && matchesCategory && matchesAuthor && matchesStock;
      });
    }
  },
  methods: {
    async fetchCatalogData() {
      this.loading = true;
      try {
        const [booksRes, catsRes, authsRes] = await Promise.all([
          axios.get('/api/books'),
          axios.get('/api/categories'),
          axios.get('/api/authors')
        ]);
        this.books = booksRes.data;
        this.categories = catsRes.data;
        this.authors = authsRes.data;
        this.apiOnline = true;
      } catch (err) {
        console.error(err);
        this.apiOnline = false;
        window.appInstance.addToast("Gagal mengambil data katalog dari API server.", "error");
      } finally {
        this.loading = false;
      }
    },
    clearFilters() {
      this.searchQuery = '';
      this.selectedCategory = 'all';
      this.selectedAuthor = 'all';
      this.onlyAvailable = false;
    },
    showDetails(book) {
      this.selectedBook = book;
    },
    closeDetails() {
      this.selectedBook = null;
    },
    goToAdmin() {
      router.push('/admin');
    },
    openLogin() {
      router.push('/login');
    },
    formatMoney(val) {
      return Number(val).toLocaleString('id-ID');
    }
  },
  mounted() {
    this.fetchCatalogData();
  }
};
