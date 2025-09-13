import { config } from "@/lib/config";
import Link from "next/link";

function Footer() {
  return (
    <footer className="border-t border-white/10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 text-sm text-white/60 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p>© {new Date().getFullYear()} Cinewave. Semua hak dilindungi.</p>
        <div className="flex items-center gap-4">
          <Link href="/kebijakan" className="hover:text-white transition">
            Kebijakan
          </Link>
          <Link href="/tentang" className="hover:text-white transition">
            Tentang
          </Link>
          <a
            href={config.BUSSINESS_CONTACT_TELE}
            target="_blank"
            className="hover:text-white transition"
          >
            Telegram
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
