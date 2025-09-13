function Footer() {
  return (
    <footer className="border-t border-white/10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 text-sm text-white/60 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p>© 2025 Cinewave. Semua hak dilindungi.</p>
        <div className="flex items-center gap-4">
          <a href="#" className="hover:text-white transition">
            Kebijakan
          </a>
          <a href="#" className="hover:text-white transition">
            Bantuan
          </a>
          <a href="#" className="hover:text-white transition">
            Tentang
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
