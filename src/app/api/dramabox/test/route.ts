// app/api/dramabox/route.ts
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// handle preflight
export function OPTIONS(req: NextRequest) {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}

// POST handler
export async function POST(req: NextRequest) {
  interface DramaboxLoginBody {
    loginType: string;
    agent: string;
    avatar: string;
    email: string;
    name: string;
    isLoginFrame: number;
    bindId: string;
    loginTime: string;
  }

  const {
    loginType,
    agent,
    avatar,
    email,
    name,
    isLoginFrame,
    bindId,
    loginTime,
  } = (await req.json()) as DramaboxLoginBody;

  const url =
    "https://sapi.dramaboxdb.com/drama-box/ur001/login?timestamp=1758272188638";

  const headers: Record<string, string> = {
    Tn: "Bearer ZXlKMGVYQWlPaUpLVjFRaUxDSmhiR2NpT2lKSVV6STFOaUo5LmV5SnlaV2RwYzNSbGNsUjVjR1VpT2lKVVJVMVFJaXdpZFhObGNrbGtJam95T1RFeU1Ea3hOamQ5LmtZY3dRbHd4ZjJvTngxNnlBS3NPck10alZLMFNZNENhbVFoT1hDUXlXX0k=",
    Pline: "ANDROID",
    Version: "430",
    Vn: "4.3.0",
    Userid: "291209167",
    Cid: "DBDASEO1000000",
    "Package-Name": "com.storymatrix.drama",
    Apn: "2",
    "Device-Id": "487e0e04-db3f-459c-a873-6825bf0ce669",
    "Android-Id": "ffffffffea9e9458ea9e945800000000",
    Language: "in",
    "Current-Language": "in",
    P: "43",
    "Local-Time": "2025-09-19 15:44:34.400 +0700",
    "Time-Zone": "+0700",
    "Store-Source": "store_google",
    Md: "SM-G532G",
    Ov: "6.0.1",
    Mf: "SAMSUNG",
    Tz: "-420",
    Mcc: "510",
    Brand: "samsung",
    Srn: "540x960",
    Ins: "",
    Mbid: "0",
    Mchid: "DBDASEO1000000",
    Nchid: "DRA1000042",
    Lat: "0",
    Build: "Build/MMB29T",
    Locale: "in_ID",
    "Over-Flow": "new-fly",
    Instanceid: "84d6cc8e7d644b9c6293e66b7bede8b6",
    "Country-Code": "IN",
    Afid: "1758271474892-7665166268982071579",
    Is_vpn: "0",
    Is_root: "0",
    Is_emulator: "0",
    Sn: "s6g5mz4rwo9pfdu6m0SH1HMEbG27PW1hP2OSI3C5IQcoCdg6bgJQTJZmeGKuY56yW1aSBZ2vaPvuq6FCLduKcMQ30S6wcJU4Y/TS6xv7X5kBSca1ZA48YEphVzpK0j7mys9zqJqiBRWS+cK2Ex7e8v48wse5It9OVimYbDoeOqyY0KNAXvd0VhMU9jjiJ0XmVNpeFh6MwP4EL/L1lnmlUo5z7aj79IP+HAiR5dm0uDsUjBeq/MFU6Jaywn/LFxn2y1KZm9yQk+yOcKoe3/f7Bg7A1ZtQ8evCZHMpxuFFCoilz8mePLwljXccZv6wzvBv+JkqbXLPNwv/Nn+UZtL5bA==",
    "Active-Time": "714103",
    "Content-Type": "application/json; charset=UTF-8",
    "Accept-Encoding": "gzip, deflate, br",
    "User-Agent": "okhttp/4.10.0",
  };

  const body = {
    loginType,
    agent,
    avatar,
    email,
    name,
    isLoginFrame,
    bindId,
    loginTime,
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    // bisa .json() kalau API balas JSON
    const data = await response.json();
    return NextResponse.json({ data }, { status: response.status });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch dramabox" },
      { status: 500 }
    );
  }
}
