import { store, router } from '../app.js';

export default {
  template: `
    <div>
      <!-- Full page offline error -->
      <div v-if="!apiOnline" class="flex flex-col items-center justify-center min-h-[60vh] bg-white neo-border text-black p-10 shadow-[6px_6px_0px_0px_#000000] text-center space-y-4 max-w-2xl mx-auto">
        <span class="text-6xl">🔌</span>
        <h1 class="font-display font-black text-3xl md:text-4xl uppercase tracking-tighter text-black">Server API Tidak Terhubung</h1>
        <p class="font-mono text-sm text-zinc-600 max-w-md mx-auto">
          Backend API tidak dapat dihubungi. Pastikan server backend aktif dan URL API sudah benar.
        </p>
        <button 
          @click="fetchData"
          class="inline-flex items-center justify-center font-display font-bold neo-border text-black transition-all rounded-none cursor-pointer select-none text-sm px-5 py-2.5 bg-neo-yellow hover:bg-[#ffed4a] shadow-[3px_3px_0px_#000000] hover:shadow-[5px_5px_0px_#000000]"
        >
          🔄 Coba Lagi
        </button>
        <p class="font-mono text-[10px] text-zinc-400">Dashboard admin membutuhkan koneksi ke REST API.</p>
      </div>

      <!-- Normal content -->
      <template v-else>
      <div class="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
      
      <!-- 1. LEFT SIDEBAR NAVIGATION -->
      <div class="lg:col-span-1 space-y-4">
        <div class="bg-white neo-border text-black p-5 relative rounded-none shadow-[4px_4px_0px_#000]">
          <!-- Profile Badge -->
          <div class="flex items-center gap-2 border-b-2 border-black pb-3 mb-4">
            <div class="w-8 h-8 bg-neo-yellow rounded-full border-2 border-black flex items-center justify-center font-display font-black text-sm text-black">
              A
            </div>
            <div>
              <p class="font-mono text-[9px] text-zinc-500 uppercase leading-none">Petugas Aktif</p>
              <p class="font-display font-black text-sm text-black leading-tight">{{ adminUsername }}</p>
            </div>
          </div>

          <!-- Sidebar Tabs Menu -->
          <div class="flex flex-col gap-2 font-display">
            <button 
              v-for="tab in tabsList" 
              :key="tab.id"
              @click="changeTab(tab.id)"
              :class="activeTab === tab.id ? 'bg-neo-yellow shadow-[2px_2px_0px_#000] -translate-y-0.5' : 'hover:bg-neo-paper border border-transparent'"
              class="w-full text-left font-bold text-xs md:text-sm px-4 py-2.5 transition-all cursor-pointer rounded-none text-black flex items-center justify-between"
            >
              <span>{{ tab.label }}</span>
              <span class="text-xs">➔</span>
            </button>
            
            <button 
              @click="goToPublic"
              class="w-full text-left font-bold text-xs md:text-sm px-4 py-2.5 hover:bg-neo-paper border border-transparent text-neo-teal flex items-center justify-between"
            >
              <span>◀ Katalog Publik</span>
            </button>
          </div>

          <!-- Reset DB Button -->
          <div class="mt-6 pt-4 border-t-2 border-black">
            <button 
              @click="confirmResetDb"
              :disabled="resetting"
              class="w-full inline-flex items-center justify-center font-display font-bold neo-border text-black transition-all rounded-none cursor-pointer select-none text-xs px-3 py-2 bg-neo-orange hover:bg-[#ff692a] text-white shadow-[2px_2px_0px_#000]"
            >
              {{ resetting ? 'Resetting...' : '⚠️ Reset Database' }}
            </button>
          </div>
        </div>
      </div>

      <!-- 2. MAIN WORKSPACE AREA -->
      <div class="lg:col-span-4 space-y-6">
        
        <!-- Header Ribbon -->
        <div class="flex flex-wrap items-center justify-between border-b-4 border-black pb-2 bg-white p-4 neo-border shadow-[4px_4px_0px_#000] gap-3">
          <div>
            <span class="inline-block font-mono font-bold px-2 py-0.5 text-[10px] neo-border-thin shadow-[1.5px_1.5px_0px_#000] rotate-[-1deg] select-none bg-black text-white">
              🔐 {{ activeTabTitle.prefix }}
            </span>
            <h2 class="font-display font-black text-xl md:text-2xl uppercase tracking-tighter text-black mt-1">
              {{ activeTabTitle.title }}
            </h2>
          </div>
          
          <!-- Actions & Search -->
          <div class="flex items-center gap-3">
            <div v-if="activeTab !== 'overview'" class="relative">
              <input 
                v-model="searchTerm"
                :placeholder="'Cari data ' + activeTabTitle.singular + '...'"
                class="bg-white neo-border px-3 py-1.5 font-mono text-xs rounded-none outline-none focus:ring-1 focus:ring-black text-black w-48 md:w-60"
              />
              <svg class="absolute right-2 top-2.5 w-3.5 h-3.5 text-zinc-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>

            <button 
              v-if="activeTab !== 'overview'"
              @click="openCreateModal"
              class="inline-flex items-center justify-center font-display font-bold neo-border text-black transition-all rounded-none cursor-pointer select-none text-xs px-3 py-2 bg-neo-yellow hover:bg-[#ffed4a] shadow-[2.5px_2.5px_0px_#000] hover:shadow-[4px_4px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5"
            >
              + Catat Data Baru
            </button>
          </div>
        </div>

        <!-- TAB CONTENT: OVERVIEW/STATISTIK -->
        <div v-if="activeTab === 'overview'" class="space-y-8 animate-fade">
          <!-- Stats Bento Matrix -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div class="bg-white neo-border text-black p-4 relative rounded-none border-t-[6px] border-t-yellow-400 shadow-[4px_4px_0px_#000]">
              <p class="font-mono text-[9px] text-zinc-500 uppercase font-bold">Total Unit Buku</p>
              <h3 class="font-display font-black text-3xl mt-1">{{ stats.totalBooks }}</h3>
            </div>
            <div class="bg-white neo-border text-black p-4 relative rounded-none border-t-[6px] border-t-neo-green shadow-[4px_4px_0px_#000]">
              <p class="font-mono text-[9px] text-zinc-500 uppercase font-bold">Anggota Terdaftar</p>
              <h3 class="font-display font-black text-3xl mt-1">{{ stats.totalMembers }}</h3>
            </div>
            <div class="bg-white neo-border text-black p-4 relative rounded-none border-t-[6px] border-t-neo-magenta shadow-[4px_4px_0px_#000]">
              <p class="font-mono text-[9px] text-zinc-500 uppercase font-bold">Peminjaman Aktif</p>
              <h3 class="font-display font-black text-3xl mt-1">{{ stats.totalActiveLoans }}</h3>
            </div>
            <div class="bg-white neo-border text-black p-4 relative rounded-none border-t-[6px] border-t-neo-teal shadow-[4px_4px_0px_#000]">
              <p class="font-mono text-[9px] text-zinc-500 uppercase font-bold">Total Pendapatan</p>
              <h3 class="font-display font-black text-xl md:text-2xl mt-1.5 text-black">Rp {{ formatMoney(stats.totalEarnings) }}</h3>
            </div>
          </div>

          <!-- Distribution Chart & Recent Activity -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <!-- Distribution Card -->
            <div class="bg-white neo-border text-black p-5 relative rounded-none shadow-[6px_6px_0px_#000]">
              <h3 class="font-display font-black text-lg border-b-2 border-black pb-2 mb-4 uppercase">DISTRIBUSI KATEGORI BUKU</h3>
              
              <div v-if="stats.categoryDistribution && stats.categoryDistribution.length > 0" class="space-y-3 font-mono text-xs">
                <div v-for="cat in stats.categoryDistribution" :key="cat.name">
                  <div class="flex justify-between font-bold mb-1">
                    <span>{{ cat.name }}</span>
                    <span>{{ cat.count }} buku</span>
                  </div>
                  <!-- Custom Neo-Brutalist styled progress bar -->
                  <div class="w-full bg-zinc-100 border-2 border-black h-5 relative overflow-hidden">
                    <div 
                      :style="{ width: calculatePercent(cat.count) + '%' }" 
                      class="bg-neo-yellow h-full border-r-2 border-black transition-all"
                    ></div>
                  </div>
                </div>
              </div>
              <div v-else class="text-center py-10 font-mono text-xs text-zinc-400">
                Data kategori tidak ditemukan.
              </div>
            </div>

            <!-- Recent Loans Card -->
            <div class="bg-white neo-border text-black p-5 relative rounded-none shadow-[6px_6px_0px_#000]">
              <h3 class="font-display font-black text-lg border-b-2 border-black pb-2 mb-4 uppercase">SIRKULASI TERBARU (5 Terakhir)</h3>
              
              <div v-if="stats.recentLoans && stats.recentLoans.length > 0" class="space-y-3">
                <div 
                  v-for="loan in stats.recentLoans" 
                  :key="loan.id" 
                  class="border-2 border-black p-2 bg-neo-beige/40 flex items-center justify-between text-xs font-mono"
                >
                  <div class="space-y-0.5">
                    <p class="font-bold text-black line-clamp-1">{{ loan.bookTitle }}</p>
                    <p class="text-[10px] text-zinc-500">Peminjam: <b class="text-black">{{ loan.memberName }}</b></p>
                    <p class="text-[9px] text-zinc-400">Tgl: {{ formatDate(loan.loanDate) }}</p>
                  </div>

                  <span 
                    :class="loan.status === 'Active' ? 'bg-neo-magenta text-white' : 'bg-neo-green text-white'" 
                    class="font-bold text-[9px] px-2 py-0.5 border neo-border-thin shadow-[1px_1px_0px_#000]"
                  >
                    {{ loan.status === 'Active' ? 'AKTIF' : 'KEMBALI' }}
                  </span>
                </div>
              </div>
              <div v-else class="text-center py-10 font-mono text-xs text-zinc-400">
                Belum ada data sirkulasi peminjaman.
              </div>
            </div>
          </div>
        </div>

        <!-- TAB CONTENT: DATA CRUD TABLE -->
        <div v-else class="bg-white neo-border text-black relative rounded-none shadow-[6px_6px_0px_#000] overflow-hidden animate-fade">
          
          <div class="overflow-x-auto">
            <table class="w-full border-collapse text-left font-mono text-xs md:text-sm">
              <thead class="bg-neo-paper border-b-2 border-black font-display text-xs font-black uppercase text-black">
                <tr>
                  <th v-for="header in currentTableHeaders" :key="header" class="p-3 border-r-2 border-black last:border-r-0">
                    {{ header }}
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y-2 divide-black">
                <tr v-if="loading" class="text-center">
                  <td :colspan="currentTableHeaders.length" class="p-10 font-bold text-zinc-500 uppercase">
                    Memuat data...
                  </td>
                </tr>
                <tr v-else-if="filteredList.length === 0" class="text-center">
                  <td :colspan="currentTableHeaders.length" class="p-10 text-zinc-500">
                    Tidak ada data matching "{{ searchTerm }}"
                  </td>
                </tr>
                <tr 
                  v-else 
                  v-for="item in filteredList" 
                  :key="item.id"
                  class="hover:bg-amber-50/10 text-black transition-colors"
                >
                  
                  <!-- CUSTOM TD COLUMNS RENDERS BASED ON ACTIVE TAB -->
                  <!-- Books Columns -->
                  <template v-if="activeTab === 'books'">
                    <td class="p-3 border-r-2 border-black font-bold">{{ item.title }}</td>
                    <td class="p-3 border-r-2 border-black">{{ item.categoryName }}</td>
                    <td class="p-3 border-r-2 border-black">{{ item.authorName }}</td>
                    <td class="p-3 border-r-2 border-black">{{ item.stock }} unit</td>
                    <td class="p-3 border-r-2 border-black">Rp {{ formatMoney(item.rentalPrice) }}</td>
                    <td class="p-3 border-r-2 border-black">{{ item.rentalDuration }} hari</td>
                  </template>

                  <!-- Categories Columns -->
                  <template v-if="activeTab === 'categories'">
                    <td class="p-3 border-r-2 border-black font-bold">{{ item.name }}</td>
                    <td class="p-3 border-r-2 border-black font-mono text-xs text-zinc-500">{{ item.slug }}</td>
                  </template>

                  <!-- Authors Columns -->
                  <template v-if="activeTab === 'authors'">
                    <td class="p-3 border-r-2 border-black font-bold w-1/4">{{ item.name }}</td>
                    <td class="p-3 border-r-2 border-black line-clamp-2 mt-1 border-none text-zinc-600">{{ item.bio }}</td>
                  </template>

                  <!-- Members Columns -->
                  <template v-if="activeTab === 'members'">
                    <td class="p-3 border-r-2 border-black font-bold">{{ item.name }}</td>
                    <td class="p-3 border-r-2 border-black font-mono">{{ item.email }}</td>
                    <td class="p-3 border-r-2 border-black font-mono">{{ item.phone }}</td>
                    <td class="p-3 border-r-2 border-black">
                      <span :class="item.membershipType === 'Premium' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-zinc-600'" class="px-2 py-0.5 text-[10px] font-bold">
                        {{ item.membershipType }}
                      </span>
                    </td>
                  </template>

                  <!-- Loans Columns -->
                  <template v-if="activeTab === 'loans'">
                    <td class="p-3 border-r-2 border-black font-bold">{{ item.bookTitle }}</td>
                    <td class="p-3 border-r-2 border-black">{{ item.memberName }}</td>
                    <td class="p-3 border-r-2 border-black font-mono text-[11px]">{{ formatDate(item.loanDate) }}</td>
                    <td class="p-3 border-r-2 border-black font-mono text-[11px]">{{ item.returnDate ? formatDate(item.returnDate) : '-' }}</td>
                    <td class="p-3 border-r-2 border-black">
                      <span :class="item.status === 'Active' ? 'bg-neo-magenta text-white' : 'bg-neo-green text-white'" class="font-bold text-[9px] px-2 py-0.5 border neo-border-thin shadow-[1.5px_1.5px_0px_#000]">
                        {{ item.status === 'Active' ? 'AKTIF' : 'KEMBALI' }}
                      </span>
                    </td>
                    <td class="p-3 border-r-2 border-black font-bold">Rp {{ formatMoney(item.totalFee) }}</td>
                  </template>

                  <!-- Actions Cell -->
                  <td class="p-3">
                    <div class="flex items-center gap-2">
                      <!-- Return Book Button (Loans only) -->
                      <button 
                        v-if="activeTab === 'loans' && item.status === 'Active'"
                        @click="returnLoan(item.id)"
                        class="bg-neo-magenta text-white hover:bg-[#ff33ff] border border-black px-2 py-1 font-display text-[10px] font-bold tracking-tight uppercase cursor-pointer"
                      >
                        Kembalikan
                      </button>
                      
                      <!-- Edit Button (All except Loans) -->
                      <button 
                        v-if="activeTab !== 'loans'"
                        @click="openEditModal(item)"
                        class="bg-neo-yellow text-black hover:bg-[#ffed4a] border border-black px-2 py-1 font-display text-[10px] font-bold tracking-tight uppercase cursor-pointer"
                      >
                        Edit
                      </button>

                      <!-- Delete Button -->
                      <button 
                        @click="deleteItem(item.id)"
                        class="bg-neo-orange text-white hover:bg-[#ff692a] border border-black px-2 py-1 font-display text-[10px] font-bold tracking-tight uppercase cursor-pointer"
                      >
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

        </div>

      </div>

      <!-- 3. CREATE & EDIT DATA FORM MODAL DIALOG -->
      <div v-if="modalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <!-- Backdrop -->
        <div class="fixed inset-0 bg-black/60 backdrop-blur-xs" @click="closeModal"></div>
        
        <!-- Modal Container -->
        <div class="z-10 w-full max-w-xl bg-white neo-border text-black p-5 relative rounded-none shadow-[8px_8px_0px_0px_#000] max-h-[85vh] overflow-y-auto">
          
          <!-- Modal Header -->
          <div class="flex items-center justify-between border-b-2 border-black pb-3 -mt-1 -mx-1 mb-4">
            <h3 class="font-display font-black text-xl tracking-tight text-black">
              {{ editingId ? 'EDIT DATA ' + activeTab.toUpperCase() : 'TAMBAH DATA ' + activeTab.toUpperCase() }}
            </h3>
            <button @click="closeModal" class="neo-border-thin bg-neo-yellow p-1 hover:bg-[#ffed4a] transition-colors cursor-pointer text-black">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          <!-- FORM FIELDS DYNAMICALLY BINDED TO ACTIVE TAB -->
          <form @submit.prevent="submitForm" class="space-y-4">
            
            <!-- --- TAB: BOOKS FORM --- -->
            <template v-if="activeTab === 'books'">
              <div class="flex flex-col w-full mb-3">
                <label class="font-display font-bold text-black text-sm mb-1">Judul Buku / Komik</label>
                <input v-model="form.title" class="w-full bg-white neo-border p-2 font-mono text-xs outline-none focus:ring-2 focus:ring-black" required />
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div class="flex flex-col w-full mb-3">
                  <label class="font-display font-bold text-black text-sm mb-1">Penulis / Kreator</label>
                  <select v-model="form.authorId" class="w-full bg-white neo-border p-2 font-mono text-xs outline-none focus:ring-2 focus:ring-black" required>
                    <option value="">-- Pilih Penulis --</option>
                    <option v-for="a in authors" :key="a.id" :value="a.id">{{ a.name }}</option>
                  </select>
                </div>
                <div class="flex flex-col w-full mb-3">
                  <label class="font-display font-bold text-black text-sm mb-1">Genre Kategori</label>
                  <select v-model="form.categoryId" class="w-full bg-white neo-border p-2 font-mono text-xs outline-none focus:ring-2 focus:ring-black" required>
                    <option value="">-- Pilih Kategori --</option>
                    <option v-for="c in categories" :key="c.id" :value="c.id">{{ c.name }}</option>
                  </select>
                </div>
              </div>

              <div class="flex flex-col w-full mb-3">
                <label class="font-display font-bold text-black text-sm mb-1">Tautan Gambar Cover (URL)</label>
                <input v-model="form.coverUrl" placeholder="https://unsplash.com/..." class="w-full bg-white neo-border p-2 font-mono text-xs outline-none focus:ring-2 focus:ring-black" />
              </div>

              <div class="flex flex-col w-full mb-3">
                <label class="font-display font-bold text-black text-sm mb-1">Sinopsis Ringkasan</label>
                <textarea v-model="form.description" rows="3" class="w-full bg-white neo-border p-2 font-mono text-xs outline-none focus:ring-2 focus:ring-black"></textarea>
              </div>

              <div class="grid grid-cols-3 gap-3">
                <div class="flex flex-col w-full">
                  <label class="font-display font-bold text-black text-xs mb-1">Jumlah Unit Stok</label>
                  <input type="number" v-model.number="form.stock" min="1" class="w-full bg-white neo-border p-2 font-mono text-xs outline-none focus:ring-2 focus:ring-black" required />
                </div>
                <div class="flex flex-col w-full">
                  <label class="font-display font-bold text-black text-xs mb-1">Biaya Rental / hari (Rp)</label>
                  <input type="number" v-model.number="form.rentalPrice" min="1000" class="w-full bg-white neo-border p-2 font-mono text-xs outline-none focus:ring-2 focus:ring-black" required />
                </div>
                <div class="flex flex-col w-full">
                  <label class="font-display font-bold text-black text-xs mb-1">Batas Hari Rental</label>
                  <input type="number" v-model.number="form.rentalDuration" min="1" class="w-full bg-white neo-border p-2 font-mono text-xs outline-none focus:ring-2 focus:ring-black" required />
                </div>
              </div>
            </template>

            <!-- --- TAB: CATEGORIES FORM --- -->
            <template v-if="activeTab === 'categories'">
              <div class="flex flex-col w-full mb-3">
                <label class="font-display font-bold text-black text-sm mb-1">Nama Kategori</label>
                <input v-model="form.name" placeholder="Misal: Novel Fantasi, Sejarah, Sains..." class="w-full bg-white neo-border p-2 font-mono text-xs outline-none focus:ring-2 focus:ring-black" required />
              </div>
            </template>

            <!-- --- TAB: AUTHORS FORM --- -->
            <template v-if="activeTab === 'authors'">
              <div class="flex flex-col w-full mb-3">
                <label class="font-display font-bold text-black text-sm mb-1">Nama Penulis / Sastrawan</label>
                <input v-model="form.name" class="w-full bg-white neo-border p-2 font-mono text-xs outline-none focus:ring-2 focus:ring-black" required />
              </div>
              <div class="flex flex-col w-full mb-3">
                <label class="font-display font-bold text-black text-sm mb-1">Profil Biografi</label>
                <textarea v-model="form.bio" rows="4" placeholder="Tulis biografi singkat penulis..." class="w-full bg-white neo-border p-2 font-mono text-xs outline-none focus:ring-2 focus:ring-black"></textarea>
              </div>
            </template>

            <!-- --- TAB: MEMBERS FORM --- -->
            <template v-if="activeTab === 'members'">
              <div class="flex flex-col w-full mb-3">
                <label class="font-display font-bold text-black text-sm mb-1">Nama Lengkap</label>
                <input v-model="form.name" class="w-full bg-white neo-border p-2 font-mono text-xs outline-none focus:ring-2 focus:ring-black" required />
              </div>
              <div class="flex flex-col w-full mb-3">
                <label class="font-display font-bold text-black text-sm mb-1">Alamat Email</label>
                <input type="email" v-model="form.email" class="w-full bg-white neo-border p-2 font-mono text-xs outline-none focus:ring-2 focus:ring-black" required />
              </div>
              <div class="flex flex-col w-full mb-3">
                <label class="font-display font-bold text-black text-sm mb-1">Nomor Telepon</label>
                <input v-model="form.phone" placeholder="08..." class="w-full bg-white neo-border p-2 font-mono text-xs outline-none focus:ring-2 focus:ring-black" />
              </div>
              <div class="flex flex-col w-full mb-3">
                <label class="font-display font-bold text-black text-sm mb-1">Level Keanggotaan</label>
                <select v-model="form.membershipType" class="w-full bg-white neo-border p-2 font-mono text-xs outline-none focus:ring-2 focus:ring-black">
                  <option value="Regular">Regular (Sirkulasi Biasa)</option>
                  <option value="Premium">Premium (Diskon & Prioritas)</option>
                </select>
              </div>
            </template>

            <!-- --- TAB: LOANS FORM --- -->
            <template v-if="activeTab === 'loans'">
              <div class="flex flex-col w-full mb-3">
                <label class="font-display font-bold text-black text-sm mb-1">Pilih Anggota Perpustakaan</label>
                <select v-model="form.memberId" class="w-full bg-white neo-border p-2 font-mono text-xs outline-none focus:ring-2 focus:ring-black" required>
                  <option value="">-- Pilih Anggota --</option>
                  <option v-for="m in members" :key="m.id" :value="m.id">{{ m.name }} ({{ m.membershipType }})</option>
                </select>
              </div>
              <div class="flex flex-col w-full mb-3">
                <label class="font-display font-bold text-black text-sm mb-1">Buku yang Akan Disewa</label>
                <select v-model="form.bookId" class="w-full bg-white neo-border p-2 font-mono text-xs outline-none focus:ring-2 focus:ring-black" required>
                  <option value="">-- Pilih Buku (Stok Tersedia) --</option>
                  <option v-for="b in availableBooks" :key="b.id" :value="b.id">
                    {{ b.title }} - Stok: {{ b.stock }} unit (Rp {{ formatMoney(b.rentalPrice) }}/hari)
                  </option>
                </select>
                <p v-if="availableBooks.length === 0" class="text-[10px] text-red-500 font-bold mt-1 font-mono">
                  *⚠️ Stok semua buku saat ini kosong atau belum terisi. Silahkan isi stok buku terlebih dahulu.
                </p>
              </div>
            </template>

            <!-- Actions buttons -->
            <div class="pt-3 border-t-2 border-black flex justify-end gap-3">
              <button 
                type="button" 
                @click="closeModal"
                class="inline-flex items-center justify-center font-display font-bold neo-border text-black transition-all rounded-none cursor-pointer select-none text-xs px-4 py-2 bg-white hover:bg-gray-100 shadow-[2px_2px_0px_#000]"
              >
                Batalkan
              </button>
              <button 
                type="submit" 
                :disabled="saving"
                class="inline-flex items-center justify-center font-display font-bold neo-border text-black transition-all rounded-none cursor-pointer select-none text-xs px-4 py-2 bg-neo-yellow hover:bg-[#ffed4a] shadow-[2px_2px_0px_#000]"
              >
                {{ saving ? 'Menyimpan...' : 'Simpan Perubahan' }}
              </button>
            </div>
          </form>

        </div>
      </div>

      </div>
      </template>
    </div>
  `,
  data() {
    return {
      activeTab: 'overview',
      searchTerm: '',
      loading: false,
      saving: false,
      resetting: false,
      modalOpen: false,
      editingId: null,

      apiOnline: true,

      // API lists
      books: [],
      categories: [],
      authors: [],
      members: [],
      loans: [],
      stats: {
        totalBooks: 0,
        totalMembers: 0,
        totalActiveLoans: 0,
        totalEarnings: 0,
        categoryDistribution: [],
        recentLoans: []
      },

      // Form buffer
      form: {},
      sharedStore: store,

      tabsList: [
        { id: 'overview', label: 'Ringkasan Dashboard' },
        { id: 'books', label: 'Katalog Buku' },
        { id: 'categories', label: 'Manajemen Kategori' },
        { id: 'authors', label: 'Daftar Penulis' },
        { id: 'members', label: 'Registrasi Anggota' },
        { id: 'loans', label: 'Sirkulasi Rental' }
      ]
    };
  },
  computed: {
    adminUsername() {
      return this.sharedStore.adminUsername;
    },
    activeTabTitle() {
      switch (this.activeTab) {
        case 'overview': return { prefix: 'SYSTEM OVERVIEW', title: 'Ringkasan Dashboard', singular: '' };
        case 'books': return { prefix: 'BOOK CATALOGUE', title: 'Katalog Buku & Komik', singular: 'buku' };
        case 'categories': return { prefix: 'CATEGORY MANAGEMENT', title: 'Manajemen Kategori', singular: 'kategori' };
        case 'authors': return { prefix: 'AUTHOR DATABASE', title: 'Daftar Penulis & Bio', singular: 'penulis' };
        case 'members': return { prefix: 'MEMBER REGISTRATION', title: 'Daftar Anggota Perpustakaan', singular: 'anggota' };
        case 'loans': return { prefix: 'CIRCULATION MANAGEMENT', title: 'Sirkulasi Transaksi Rental', singular: 'transaksi' };
      }
    },
    currentTableHeaders() {
      switch (this.activeTab) {
        case 'books': return ['Judul Buku', 'Kategori', 'Penulis', 'Sisa Stok', 'Tarif Sewa', 'Batas Hari', 'Tindakan'];
        case 'categories': return ['Nama Kategori', 'Slug Kunci', 'Tindakan'];
        case 'authors': return ['Nama Penulis', 'Biografi Singkat', 'Tindakan'];
        case 'members': return ['Nama Lengkap', 'Alamat Email', 'Nomor HP', 'Keanggotaan', 'Tindakan'];
        case 'loans': return ['Judul Buku', 'Nama Anggota', 'Tgl Sewa', 'Tgl Kembali', 'Status', 'Biaya', 'Tindakan'];
        default: return [];
      }
    },
    currentList() {
      switch (this.activeTab) {
        case 'books': return this.books;
        case 'categories': return this.categories;
        case 'authors': return this.authors;
        case 'members': return this.members;
        case 'loans': return this.loans;
        default: return [];
      }
    },
    filteredList() {
      if (!this.searchTerm) return this.currentList;
      const q = this.searchTerm.toLowerCase();

      return this.currentList.filter(item => {
        if (this.activeTab === 'books') {
          return item.title.toLowerCase().includes(q) || 
                 (item.categoryName && item.categoryName.toLowerCase().includes(q)) || 
                 (item.authorName && item.authorName.toLowerCase().includes(q));
        }
        if (this.activeTab === 'categories') {
          return item.name.toLowerCase().includes(q) || item.slug.toLowerCase().includes(q);
        }
        if (this.activeTab === 'authors') {
          return item.name.toLowerCase().includes(q) || (item.bio && item.bio.toLowerCase().includes(q));
        }
        if (this.activeTab === 'members') {
          return item.name.toLowerCase().includes(q) || item.email.toLowerCase().includes(q);
        }
        if (this.activeTab === 'loans') {
          return item.bookTitle.toLowerCase().includes(q) || item.memberName.toLowerCase().includes(q);
        }
        return false;
      });
    },
    availableBooks() {
      return this.books.filter(b => b.stock > 0);
    }
  },
  methods: {
    changeTab(tabId) {
      this.activeTab = tabId;
      this.searchTerm = '';
      this.fetchData();
    },
    goToPublic() {
      router.push('/');
    },
    async fetchData() {
      this.loading = true;
      try {
        if (this.activeTab === 'overview') {
          const res = await axios.get('/api/dashboard/stats');
          this.stats = res.data;
        } else if (this.activeTab === 'books') {
          // Pre-fetch related lists for dropdown selects
          const [booksRes, catsRes, authsRes] = await Promise.all([
            axios.get('/api/books'),
            axios.get('/api/categories'),
            axios.get('/api/authors')
          ]);
          this.books = booksRes.data;
          this.categories = catsRes.data;
          this.authors = authsRes.data;
        } else if (this.activeTab === 'categories') {
          const res = await axios.get('/api/categories');
          this.categories = res.data;
        } else if (this.activeTab === 'authors') {
          const res = await axios.get('/api/authors');
          this.authors = res.data;
        } else if (this.activeTab === 'members') {
          const res = await axios.get('/api/members');
          this.members = res.data;
        } else if (this.activeTab === 'loans') {
          const [loansRes, membersRes, booksRes] = await Promise.all([
            axios.get('/api/loans'),
            axios.get('/api/members'),
            axios.get('/api/books')
          ]);
          this.loans = loansRes.data;
          this.members = membersRes.data;
          this.books = booksRes.data;
        }
        this.apiOnline = true;
      } catch (err) {
        console.error(err);
        this.apiOnline = false;
        window.appInstance.addToast("Gagal mengambil data dari REST API.", "error");
      } finally {
        this.loading = false;
      }
    },
    openCreateModal() {
      this.editingId = null;
      this.form = {};
      
      // Seed default form fields based on tab
      if (this.activeTab === 'books') {
        this.form = { title: '', authorId: '', categoryId: '', coverUrl: '', description: '', stock: 5, rentalPrice: 5000, rentalDuration: 7 };
      } else if (this.activeTab === 'categories') {
        this.form = { name: '' };
      } else if (this.activeTab === 'authors') {
        this.form = { name: '', bio: '' };
      } else if (this.activeTab === 'members') {
        this.form = { name: '', email: '', phone: '', membershipType: 'Regular' };
      } else if (this.activeTab === 'loans') {
        this.form = { memberId: '', bookId: '' };
      }
      this.modalOpen = true;
    },
    openEditModal(item) {
      this.editingId = item.id;
      this.form = {};
      
      // Map only relevant fields based on active tab
      if (this.activeTab === 'books') {
        this.form = {
          title: item.title,
          authorId: item.authorId,
          categoryId: item.categoryId,
          coverUrl: item.coverUrl,
          description: item.description,
          stock: item.stock,
          rentalPrice: item.rentalPrice,
          rentalDuration: item.rentalDuration
        };
      } else if (this.activeTab === 'categories') {
        this.form = { name: item.name };
      } else if (this.activeTab === 'authors') {
        this.form = { name: item.name, bio: item.bio };
      } else if (this.activeTab === 'members') {
        this.form = {
          name: item.name,
          email: item.email,
          phone: item.phone,
          membershipType: item.membershipType
        };
      } else {
        this.form = { ...item };
      }
      
      this.modalOpen = true;
    },
    closeModal() {
      this.modalOpen = false;
      this.editingId = null;
      this.form = {};
    },
    async submitForm() {
      this.saving = true;
      try {
        let response;
        if (this.editingId) {
          // UPDATE
          response = await axios.put(`/api/${this.activeTab}/${this.editingId}`, this.form);
          window.appInstance.addToast(`Perubahan data ${this.activeTabTitle.singular} berhasil disimpan!`, "success");
        } else {
          // CREATE
          response = await axios.post(`/api/${this.activeTab}`, this.form);
          window.appInstance.addToast(`Data ${this.activeTabTitle.singular} baru berhasil dicatat!`, "success");
        }
        this.closeModal();
        this.fetchData();
      } catch (err) {
        console.error(err);
        const errMsg = err.response?.data?.error || err.message || "Gagal menyimpan data.";
        window.appInstance.addToast(errMsg, "error");
      } finally {
        this.saving = false;
      }
    },
    async deleteItem(id) {
      if (!confirm(`Apakah Anda yakin ingin menghapus data ${this.activeTabTitle.singular} ini?`)) return;
      try {
        await axios.delete(`/api/${this.activeTab}/${id}`);
        window.appInstance.addToast(`Data ${this.activeTabTitle.singular} berhasil dihapus.`, "info");
        this.fetchData();
      } catch (err) {
        console.error(err);
        const errMsg = err.response?.data?.error || err.message || "Gagal menghapus data.";
        window.appInstance.addToast(errMsg, "error");
      }
    },
    async returnLoan(loanId) {
      try {
        await axios.post(`/api/loans/${loanId}/return`);
        window.appInstance.addToast("Buku berhasil dikembalikan! Stok telah dipulihkan.", "success");
        this.fetchData();
      } catch (err) {
        console.error(err);
        window.appInstance.addToast(err.response?.data?.error || "Gagal memproses pengembalian.", "error");
      }
    },
    async confirmResetDb() {
      if (!confirm("⚠️ CAUTION: Tindakan ini akan mengosongkan seluruh perubahan dan mereset isi database ke data seed awal. Lanjutkan?")) return;
      this.resetting = true;
      try {
        await axios.post('/api/admin/reset-db');
        window.appInstance.addToast("Database berhasil di-reset ke data bawaan UAS!", "success");
        this.fetchData();
      } catch (err) {
        console.error(err);
        window.appInstance.addToast("Gagal melakukan reset database.", "error");
      } finally {
        this.resetting = false;
      }
    },
    formatMoney(val) {
      return Number(val).toLocaleString('id-ID');
    },
    formatDate(str) {
      if (!str) return '-';
      const date = new Date(str);
      return date.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    },
    calculatePercent(count) {
      if (this.books.length === 0) return 0;
      return Math.round((count / this.books.length) * 100);
    }
  },
  mounted() {
    this.fetchData();
  }
};
