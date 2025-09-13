"use client";

import disableDevtool from "disable-devtool";
import { useEffect } from "react";
import { config } from "./config";

export function DisableDevTools() {
  useEffect(() => {
    disableDevtool({
      clearLog: true,
      ondevtoolopen(type, next) {
        alert(
          `Om ngapain om, jangan buka devtools ya om :). Kalo mau APInya chat aja di Telegram ${config.BUSSINESS_CONTACT_TELE}. Makasih om :)`
        );
        next();
      },
    });
  }, []);

  return null;
}
