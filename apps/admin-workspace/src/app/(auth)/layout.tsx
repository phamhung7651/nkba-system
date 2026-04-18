export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Tạo một phông nền gradient sang trọng, full màn hình
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-[#002D62] p-4">
      {children}
    </div>
  );
}