import Header from '@/components/layout/Header';

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-lvh min-h-lvh flex-col overflow-x-clip">
      <Header />
      <main className="mx-auto mt-20 mb-4 max-h-[calc(100vh-80px)] w-full grow overflow-hidden px-4">
        {children}
      </main>
    </div>
  );
}
