// filepath: /c:/Users/ASUS/Desktop/NOVA BANK/Nova-Bank/src/pages/_app.js
import React from 'react';
import '../app/globals.css';
import { ThemeProvider } from "@/components/ThemeProvider";


function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <Component {...pageProps} />
    </ThemeProvider>
  );
}

export default MyApp;