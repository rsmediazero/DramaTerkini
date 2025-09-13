import { config } from "@/lib/config";

export const metadata = {
  title: "Kebijakan — " + config.PROJECT_NAME,
  description: "Kebijakan penggunaan " + config.PROJECT_NAME,
};

export default function KebijakanPage() {
  return (
    <main className="py-8 sm:py-12 min-h-[91vh]">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 space-y-8">
        <h1 className="font-display text-3xl grad-text">Kebijakan</h1>

        <div className="glass rounded-2xl p-6 space-y-4 text-white/80">
          <p>
            {config.PROJECT_NAME} adalah proyek pribadi yang bertujuan untuk
            menampilkan ulang data drama secara gratis, dengan tampilan yang
            lebih ringan dan sederhana.
          </p>
          <p>
            Kami <strong>tidak memiliki hak cipta</strong> atas konten drama
            maupun sumber video yang ditampilkan. Semua hak cipta sepenuhnya
            dimiliki oleh pihak penyedia resmi.
          </p>
          <p>
            Apabila pihak resmi (misalnya DramaBox atau pemegang hak cipta lain)
            meminta agar proyek ini dihentikan, saya menerima dan akan{" "}
            <strong>men-shutdown proyek ini</strong>.
          </p>
          <p>
            {config.PROJECT_NAME} tidak bertujuan komersial dan tidak memungut
            biaya apa pun dari pengguna. Jika kamu menikmati layanan ini, anggap
            saja sebagai percobaan teknologi.
          </p>
        </div>
      </div>
    </main>
  );
}
