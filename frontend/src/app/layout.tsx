import "./globals.css";
import SessionProvider from "./SessionProvider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full bg-white">
      <body className="h-full">
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
