import Image from "next/image";
import { config } from "@/lib/config";
import DonaturLeaderboard from "./DonaturLeaderBoard";

export type AdProps = {
  imageUrl?: string;
  linkUrl?: string;
  alt?: string;
  className?: string;
  page?: "home" | "detail" | "search" | "tonton";
};

function Iklan({ imageUrl, linkUrl, alt, className, page }: AdProps) {
  const hasAd = !!imageUrl && !!linkUrl;

  return (
    <div
      className={`glass rounded-2xl p-4 h-full flex flex-col justify-center ${
        className ?? ""
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-display text-lg">Iklan</h3>
      </div>

      {hasAd ? (
        <a
          href={linkUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block relative w-full overflow-hidden rounded-xl group"
        >
          <Image
            src={imageUrl!}
            alt={alt ?? "Iklan"}
            width={400}
            height={200}
            className="rounded-xl object-cover w-full h-auto transition group-hover:scale-[1.02]"
          />
        </a>
      ) : (
        <div className="text-sm text-white/70 space-y-2">
          <p>Mau pasang iklan di sini?</p>
          <p>
            Hubungi saya di{" "}
            <a
              target="_blank"
              href={config.BUSSINESS_CONTACT_TELE}
              className="text-blue-400 underline"
            >
              Telegram
            </a>{" "}
            .
          </p>
          {page !== "home" ? (
            <div className="flex flex-col gap-y-2">
              Atau dukung agar web tetap hidup lewat <DonaturLeaderboard />
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}

export default Iklan;
