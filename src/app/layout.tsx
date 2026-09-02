import Header from "@/composants/header/header";
import Galerie from "@/composants/galerie/galerie";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        style={{
          margin: 0,
          background: "#000",
        }}
      >
        {children}
      </body>
    </html>
  );
}
