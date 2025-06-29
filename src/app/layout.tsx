import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import ClientLayout from "./ClientLayout"

export const metadata: Metadata = {
  title: "BIMCAT SRL - Consultoría BIM y Construcción",
  description:
    "Consultoría especializada en construcción y tecnología BIM. Implementación de metodologías BIM, capacitación y desarrollo de proyectos.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <ClientLayout>{children}</ClientLayout>
}
