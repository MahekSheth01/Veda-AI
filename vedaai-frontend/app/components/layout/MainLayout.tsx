interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({
  children,
}: MainLayoutProps) {
  return (
    <div className="flex min-h-screen bg-[#F5F5F5] p-3 gap-3">
      {children}
    </div>
  );
}