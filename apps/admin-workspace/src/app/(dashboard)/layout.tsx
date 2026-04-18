import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // BỎ THẺ HTML, HEAD, BODY Ở ĐÂY. CHỈ GIỮ LẠI THẺ DIV BAO NGOÀI
    <div className="flex h-screen w-full bg-slate-50 font-sans overflow-hidden">
      
      {/* SIDEBAR */}
      <div className="h-full shrink-0 z-50">
        <Sidebar />
      </div>
      
      {/* CỘT PHẢI */}
      <div className="flex-1 flex flex-col min-w-0 h-full relative">
        <div className="shrink-0 z-40 relative">
          <Header />
        </div>
        
        <main className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth relative">
          {children}
        </main>
      </div>
    </div>
  );
}