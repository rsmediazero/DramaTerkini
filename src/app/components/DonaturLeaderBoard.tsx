"use client";

import { useState } from "react";
import { Crown } from "lucide-react";
import Image from "next/image";

function DonaturLeaderboard() {
  const [open, setOpen] = useState(false);
  const [showQris, setShowQris] = useState(false);

  const donaturList: {
    name: string;
    amount: number;
  }[] = [];

  const sortedList = [...donaturList].sort((a, b) => b.amount - a.amount);

  return (
    <>
      {/* Tombol buka popup */}
      <button
        onClick={() => setOpen(true)}
        className="px-4 py-2 rounded-lg bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium transition"
      >
        🎉 Lihat Leaderboard Donatur
      </button>

      {/* Popup modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="bg-night-900 rounded-2xl overflow-hidden shadow-xl max-w-3xl w-full">
            {/* Header */}
            <div className="flex justify-between items-center px-4 py-3 border-b">
              <div>
                <h3 className="text-lg font-semibold text-gray-100">
                  Leaderboard Donatur
                </h3>
                <p className="text-sm text-gray-400">
                  Donasi agar website ini tetap hidup dan berkembang! Terima
                  kasih
                </p>
              </div>
              <button
                onClick={() => {
                  setOpen(false);
                  setShowQris(false);
                }}
                className="text-gray-500 hover:text-gray-300 transition"
              >
                ✖
              </button>
            </div>

            {/* List Donatur */}
            <div className="px-6 py-4 max-h-[400px] overflow-y-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-gray-400 text-sm">
                    <th className="py-2">Rank</th>
                    <th className="py-2">Nama</th>
                    <th className="py-2">Jumlah Donasi</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedList.map((item, index) => (
                    <tr
                      key={index}
                      className="border-b border-gray-700 last:border-none"
                    >
                      <td className="py-3 flex items-center gap-1">
                        {index === 0 ? (
                          <>
                            <Crown className="w-4 h-4 text-yellow-400" />
                            <span className="font-bold text-yellow-400">
                              #{index + 1}
                            </span>
                          </>
                        ) : (
                          <span className="text-gray-300">#{index + 1}</span>
                        )}
                      </td>
                      <td className="py-3 text-gray-100">{item.name}</td>
                      <td className="py-3 text-gray-100">
                        Rp {item.amount.toLocaleString("id-ID")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Tombol QRIS */}
            <div className="px-6 py-4 border-t">
              {!showQris ? (
                <button
                  onClick={() => setShowQris(true)}
                  className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm font-medium transition"
                >
                  💳 Munculkan QRIS
                </button>
              ) : (
                <div className="text-center">
                  <Image
                    width={660}
                    height={800}
                    src="https://i.ibb.co.com/RTb6Y8CH/Screenshot-2025-09-20-201612.png"
                    alt="QRIS Donasi"
                    className="mx-auto w-48 h-48 object-contain"
                  />
                  <p className="mt-2 text-sm text-gray-400">
                    Scan QRIS untuk donasi ❤️
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default DonaturLeaderboard;
