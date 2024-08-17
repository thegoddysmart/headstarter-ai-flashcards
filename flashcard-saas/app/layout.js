import { Inter } from "next/font/google";
import { ClerkProvider, SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import './globals.css';

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Recall IQ Flashcards",
  description: "AI Flashcards",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
         
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
