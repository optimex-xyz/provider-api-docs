import { Outlet } from "react-router-dom";
import { cn } from "../../lib/utils";
import { Footer } from "./Footer";
import { Header } from "./Header";

interface LayoutProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Layout = ({ children, className }: LayoutProps) => {
  return (
    <div className={cn(className)}>
      <Header />
      {children}
      <Outlet />
      <Footer />
    </div>
  );
};
