import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ReduxProvider } from "@/components/ReduxProvider";
import "../globals.css";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <ReduxProvider>
        <AppSidebar />
        <main className="w-full bg-neutral-900">
          <SidebarTrigger className="text-2xl fixed top-7 left-5 z-40 bg-white/10 backdrop-blur-2xl rounded-full p-2" />
          {children}
        </main>
      </ReduxProvider>
    </SidebarProvider>
  );
}
