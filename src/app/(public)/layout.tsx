import { Header } from "@/components/navigation/Header";
import { Footer } from "@/components/navigation/Footer";
import { CinematicIntro } from "@/components/public/CinematicIntro";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <CinematicIntro />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
