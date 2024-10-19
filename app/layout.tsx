import React from "react";
import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
  title?: string;
}

const Layout = ({ children, title = "My memo" }: LayoutProps) => {
  return (
    <html>
      <head>
        <title>{title}</title>
      </head>
      <body>
        <header>
          <h1>My memo</h1>
        </header>
        <hr />
        <main>{children}</main>
        <hr />
        <footer>
          <p>
            &copy; 2024 <a href="https://github.com/choge">@choge</a>
          </p>
        </footer>
      </body>
    </html>
  );
};

export default Layout;
