import { PublicFooter } from "@/components/layout/public-footer";
import { PublicHeader } from "@/components/layout/public-header";

export default function PublicLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <PublicHeader />
      <main className="mx-auto max-w-6xl px-5 py-10">{children}</main>
      <PublicFooter />
    </>
  );
}
