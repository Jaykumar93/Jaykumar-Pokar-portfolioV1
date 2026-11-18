import { Familjen_Grotesk, Geist, Geist_Mono } from "next/font/google";

export const display = Familjen_Grotesk({ subsets: ["latin"], variable: "--font-display", weight: ["500", "600", "700"], display: "swap" });
export const body = Geist({ subsets: ["latin"], variable: "--font-body", display: "swap" });
export const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono-face", display: "swap" });
