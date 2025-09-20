import { config } from "@/lib/config";

function Iklan({ className }: { className?: string }) {
  return (
    <div
      className={`glass rounded-2xl p-4 h-full flex flex-col justify-center${
        className ? ` ${className}` : ""
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-display text-lg">Iklan</h3>
      </div>
      <div className="text-sm text-white/70">
        Mau pasang iklan di sini? Hubungi saya di{" "}
        <a
          target="_blank"
          href={config.BUSSINESS_CONTACT_TELE}
          className="text-blue-400 underline"
        >
          Telegram
        </a>
        !
      </div>
    </div>
  );
}

export default Iklan;
