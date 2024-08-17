import { Inter,  Montserrat } from 'next/font/google';
// import { Inter } from "next/font/google";
import { ClerkProvider, SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import './globals.css';

const inter = Inter({ subsets: ["latin"] });
const montserrat = Montserrat({ subsets: ['latin'], weights: [100, 900] });

export const metadata = {
  title: "Recall IQ Flashcards",
  description: "AI Flashcards",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
        </head>
        <body className={`${inter.className} ${montserrat.className}`}>
          <SignedOut>
            <SignInButton />
          </SignedOut>

          <SignedIn>
            <UserButton />
          </SignedIn>
          {children}


        </body>
      </html>
    </ClerkProvider>
  );
}
