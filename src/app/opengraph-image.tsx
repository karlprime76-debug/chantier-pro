/* eslint-disable @next/next/no-img-element */
import { ImageResponse } from "next/og";

export const runtime = "edge";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

function arrayBufferToBase64(buffer: ArrayBuffer) {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
  }
  return btoa(binary);
}

export default async function OpenGraphImage() {
  const logoBuffer = await fetch(new URL("../../public/logo.png", import.meta.url)).then((res) => res.arrayBuffer());
  const logoBase64 = arrayBufferToBase64(logoBuffer);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0b0f14",
          position: "relative",
          padding: 64,
          fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at 50% -10%, rgba(255,106,0,0.28), transparent 60%), radial-gradient(circle at 110% 110%, rgba(7,43,95,0.55), transparent 55%)",
          }}
        />

        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            gap: 28,
            borderRadius: 36,
            border: "1px solid rgba(255,255,255,0.10)",
            backgroundColor: "rgba(255,255,255,0.06)",
            padding: 40,
            boxShadow: "0 20px 80px rgba(0,0,0,0.55)",
          }}
        >
          <div
            style={{
              width: 152,
              height: 152,
              borderRadius: 32,
              border: "1px solid rgba(255,255,255,0.10)",
              backgroundColor: "rgba(255,255,255,0.05)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "radial-gradient(circle, rgba(255,106,0,0.22), transparent 60%)",
              }}
            />
            <img
              alt="Chantier Pro"
              src={`data:image/png;base64,${logoBase64}`}
              width={104}
              height={104}
              style={{
                width: 104,
                height: 104,
                objectFit: "contain",
                position: "relative",
              }}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                fontSize: 72,
                fontWeight: 900,
                color: "#ffffff",
                lineHeight: 1,
                letterSpacing: "-0.02em",
              }}
            >
              Chantier Pro
            </div>
            <div
              style={{
                marginTop: 14,
                fontSize: 30,
                fontWeight: 700,
                color: "rgba(255,255,255,0.72)",
              }}
            >
              Gestion de chantiers · Calculs BTP · Documents
            </div>
            <div
              style={{
                marginTop: 18,
                display: "flex",
                gap: 10,
              }}
            >
              {[
                "Mobile-first",
                "Premium",
                "Rapide",
              ].map((t) => (
                <div
                  key={t}
                  style={{
                    fontSize: 20,
                    fontWeight: 800,
                    color: "rgba(255,255,255,0.78)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    backgroundColor: "rgba(0,0,0,0.22)",
                    borderRadius: 999,
                    padding: "10px 14px",
                  }}
                >
                  {t}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
