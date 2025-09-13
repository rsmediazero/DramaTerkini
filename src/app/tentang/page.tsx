import { config } from "@/config";

export const metadata = {
  title: "Tentang — " + config.PROJECT_NAME,
  description: "Tentang proyek " + config.PROJECT_NAME,
};

export default function TentangPage() {
  return (
    <main className="py-8 sm:py-12 min-h-[91vh]">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 space-y-8">
        <h1 className="font-display text-3xl grad-text">
          Tentang {config.PROJECT_NAME}
        </h1>

        <div className="glass rounded-2xl p-6 space-y-4 text-white/80">
          <p>
            <strong>{config.PROJECT_NAME}</strong> adalah proyek eksperimen
            pribadi untuk menghadirkan pengalaman menonton drama secara lebih
            ringan, modern, dan bebas iklan.
          </p>
          <p>
            Saat ini proyek <strong>belum open source</strong>, namun tidak
            menutup kemungkinan akan dibuka di masa depan agar lebih transparan
            dan bisa dikembangkan bersama komunitas.
          </p>
          <p>
            Tujuan utama proyek ini adalah untuk belajar, bereksperimen dengan
            teknologi modern (Next.js, SWR, Tailwind, dsb), sekaligus berbagi
            pengalaman menonton yang lebih nyaman.
          </p>
          <p>
            Proyek ini tidak memiliki afiliasi resmi dengan{" "}
            <strong>DramaBox</strong> maupun pemegang hak cipta konten.
          </p>
        </div>
      </div>
    </main>
  );
}
