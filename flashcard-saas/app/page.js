import styles from './page.module.css';
import Link from 'next/link';
import Image from 'next/image';
import { SignedIn, SignedOut } from '@clerk/nextjs';
import { auth } from '@clerk/nextjs/server';

export default function Home() {
  console.log(auth());
  return (
    <div className={styles.body}>
      <header className={styles.headerContainer}>
        <h1>RECALL IQ FLASHCARDS</h1>
        <nav className={styles.navigation}>
          <span><Link href="/generate">GENERATE</Link></span>
          <span><Link href="/sign-in">LOG IN</Link></span>
        </nav>
      </header>


      <main className={styles.main}>
      <section className={styles.textContainer}>
        <h2>Learn Faster, Remember More.</h2>
        <p>A proven method for improving your memory and understanding. <br />
          Easily design and review custom flashcards tailored to your learning needs.</p>
        <p><Link href="/sign-up"><button className={styles.button}>Get Started</button></Link></p>
      </section>

      <div className={styles.imageContainer}>
        <img
          src="/college-students.svg"
          alt="FlashCards"
          width="500"
          height="500"
          className={styles.sectionImage}
      />
      </div>
      </main>

      <footer className={styles.footer}>
        <section>
          <h3>Contact Us On:</h3>
          <div>
            <Link href="https://twitter.com">
              <Image src='/dark-mode/twitterx.svg' width={20} height={20} alt="Twitter" />
            </Link>
            <Link href="https://facebook.com">
              <Image src='/dark-mode/facebook.svg' width={20} height={20} alt="Facebook" />
            </Link>
            <Link href="https://instagram.com">
              <Image src='/dark-mode/instagram.svg' width={20} height={20} alt="Instagram" />
            </Link>
            <Link href="https://gmail.com">
              <Image src='/dark-mode/gmail.svg' width={20} height={20} alt="Gmail" />
            </Link>
          </div>
        </section>
        <p>&copy; 2024 Recall IQ FlashCards</p>
        <p>Proudly Ghanaian ❤️</p>
      </footer>
    </div>
  );
}
