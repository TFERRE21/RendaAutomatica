import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = { title: "Renda Automática AI", description: "Gestão de produtos digitais, vendas e automações." };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR"><body>{children}</body></html>;
}
