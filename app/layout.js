import "./globals.css";

export const metadata = {
  title: "Arcane Loader",
  description: "A fancy, unique loading screen experience",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
