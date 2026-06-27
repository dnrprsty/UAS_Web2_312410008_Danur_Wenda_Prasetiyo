import { store, router } from '../app.js';

export default {
  template: `
    <div class="flex items-center justify-center min-h-[70vh] px-4">
      <div class="w-full max-w-sm">
        <div class="bg-white neo-border text-black p-5 relative rounded-none border-t-[8px] border-t-neo-magenta shadow-[8px_8px_0px_0px_#000000]">
          
          <!-- Card Header Decor -->
          <div class="-mt-5 -mx-5 px-5 py-3 border-b-2 border-black font-display font-black text-lg flex items-center justify-between bg-neo-magenta text-white">
            <span>PINTU MASUK PETUGAS ADMIN</span>
          </div>
          
          <div class="pt-4">
            <div class="bg-neo-yellow/10 border-2 border-neo-yellow p-3 mb-4 rounded-none flex items-start gap-2 text-black">
              <!-- Lock Icon -->
              <svg class="w-5 h-5 shrink-0 text-black border neo-border-thin bg-neo-yellow p-0.5 mt-0.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
              </svg>
              <div class="font-mono text-[10px] leading-relaxed">
                <span class="font-extrabold uppercase text-black block mb-0.5">Akses Terkunci!</span>
                Gunakan kredensial default untuk verifikasi akses: <br />
                Username: <b class="bg-white px-1 select-all">admin</b> <br />
                Password: <b class="bg-white px-1 select-all">admin123</b>
              </div>
            </div>

            <form @submit.prevent="handleLogin" class="space-y-4">
              <div class="flex flex-col w-full mb-4">
                <label class="font-display font-bold text-black text-sm mb-1.5 tracking-tight flex items-center">
                  Nama Pengguna (Username)
                </label>
                <input
                  v-model="username"
                  class="w-full bg-white neo-border p-2.5 font-mono text-sm rounded-none outline-none focus:ring-2 focus:ring-black focus:bg-amber-50/20 text-black placeholder-zinc-500 transition-all"
                  placeholder="Masukkan username admin"
                  required
                />
              </div>

              <div class="flex flex-col w-full mb-4">
                <label class="font-display font-bold text-black text-sm mb-1.5 tracking-tight flex items-center">
                  Kata Sandi (Password)
                </label>
                <input
                  v-model="password"
                  type="password"
                  class="w-full bg-white neo-border p-2.5 font-mono text-sm rounded-none outline-none focus:ring-2 focus:ring-black focus:bg-amber-50/20 text-black placeholder-zinc-500 transition-all"
                  placeholder="Masukkan sandi petugas"
                  required
                />
              </div>

              <div v-if="error" class="neo-border bg-neo-orange/15 p-2 font-mono text-[10px] font-bold text-red-600">
                ⚠️ {{ error }}
              </div>

              <div class="pt-2 flex justify-between gap-3">
                <button 
                  type="button" 
                  @click="goBack"
                  class="w-1/2 inline-flex items-center justify-center font-display font-bold neo-border text-black transition-all rounded-none cursor-pointer select-none text-sm px-5 py-2.5 bg-white hover:bg-gray-100 shadow-[3px_3px_0px_#000000] hover:shadow-[5px_5px_0px_#000000] hover:-translate-x-0.5 hover:-translate-y-0.5 active:shadow-[1px_1px_0px_#000000] active:translate-x-0.5 active:translate-y-0.5"
                >
                  Kembali
                </button>
                <button 
                  type="submit" 
                  :disabled="loading"
                  class="w-1/2 inline-flex items-center justify-center font-display font-bold neo-border text-black transition-all rounded-none cursor-pointer select-none text-sm px-5 py-2.5 bg-neo-yellow hover:bg-[#ffed4a] shadow-[3px_3px_0px_#000000] hover:shadow-[5px_5px_0px_#000000] hover:-translate-x-0.5 hover:-translate-y-0.5 active:shadow-[1px_1px_0px_#000000] active:translate-x-0.5 active:translate-y-0.5"
                >
                  {{ loading ? 'Loading...' : 'Verifikasi' }}
                </button>
              </div>
            </form>
          </div>
          
        </div>
      </div>
    </div>
  `,
  data() {
    return {
      username: '',
      password: '',
      error: '',
      loading: false
    };
  },
  methods: {
    async handleLogin() {
      this.error = '';
      this.loading = true;
      try {
        const response = await axios.post('/api/auth/login', {
          username: this.username,
          password: this.password
        }, {
          headers: { 'Content-Type': 'application/json' }
        });
        
        if (response.data && response.data.success) {
          store.setLogin(response.data.user.username, response.data.token);
          window.appInstance.addToast("Selamat Datang, Anda masuk sebagai Administrator!", "success");
          router.push('/admin');
        } else {
          this.error = (response.data && response.data.error) || "Login gagal! Periksa kembali kredensial Anda.";
          window.appInstance.addToast("Autentikasi gagal. Silahkan cek kredensial.", "error");
        }
      } catch (err) {
        // No response = network/CORS error or backend down
        if (!err.response) {
          this.error = "Tidak dapat terhubung ke server! Pastikan backend API aktif dan URL-nya benar.";
          window.appInstance.addToast("Koneksi ke server gagal. Jalankan backend API terlebih dahulu.", "error");
        } else {
          this.error = err.response?.data?.error || `Error ${err.response.status}: Username atau Password salah!`;
          window.appInstance.addToast("Autentikasi gagal. Silahkan cek kredensial.", "error");
        }
      } finally {
        this.loading = false;
      }
    },
    goBack() {
      router.push('/');
    }
  }
};
