// import { Inter } from "next/font/google";
// import "./globals.css";
// import { ClerkProvider } from "@clerk/nextjs"; // Import ClerkProvider

// const inter = Inter({ subsets: ["latin"] });

// export const metadata = {
//   title: "AI Flashcards",
//   description: "AI Flashcards",
// };

// export default function RootLayout({ children }) {
//   return (
//     <html lang="en">
//       <body className={inter.className}>
//         <ClerkProvider>
//           {children}
//         </ClerkProvider>
//         </body>
//     </html>
//   );
// }



import { Inter } from "next/font/google";
import { ClerkProvider, SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import './globals.css';

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "AI Flashcards",
  description: "AI Flashcards",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
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
