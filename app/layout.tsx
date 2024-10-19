import React from "react";
import { ReactNode } from "react";
import "./global.css";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <html>
      <head>
        <title>my memo</title>
      </head>
      <body>
        <header>
          <h1>My memo</h1>
        </header>
        <hr />
        <main className="container">{children}</main>
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
