'use client';

import { useUser } from '@clerk/nextjs';
import styles from './page.module.css';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { Container, Typography, Grid, Card, CardActionArea, CardContent } from '@mui/material';
import { motion } from 'framer-motion';
import { fadeIn, slideUp } from './animations'; // Define these animations or import from your animation file

export default function Home() {
  const { isSignedIn } = useUser();
  const router = useRouter();

  const handleGetStartedClick = () => {
    if (isSignedIn) {
      router.push('/generate');
    } else {
      router.push('/sign-up');
    }
  };

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
          <p><button className={styles.button} onClick={handleGetStartedClick}>Get Started</button></p>
        </section>

        <section>
          <Image src='/college-students.svg' width={500} height={500} alt="FlashCards" />
        </section>

      </main>

      <Container maxWidth="md" sx={{ mt: 8, mb: 10 }}>
        <motion.div initial="hidden" animate="visible" variants={fadeIn}>
          <Typography variant="h4" align="center" sx={{ mb: 4 }}>
            Your Current Plan
          </Typography>
        </motion.div>
        <motion.div initial="hidden" animate="visible" variants={slideUp}>
    
        </motion.div>
        <Grid container spacing={4} justifyContent="center">
          {["Basic", "Pro"].map((plan) => (
            <Grid item key={plan}>
              <motion.div initial="hidden" animate="visible" variants={slideUp}>
                <Card
                  sx={{
                    width: 280,
                    borderRadius: 2,
                    bgcolor: "rgba(40, 40, 40, 0.95)",
                    border: "1px solid #333",
                    "&:hover": { transform: "scale(1.05)" },
                    transition: "transform 0.3s ease-in-out",
                  }}
                >
                  <CardActionArea onClick={() => handlePlanChange(plan)}>
                    <CardContent>
                      <Typography variant="h5" color="#E0E0E0" gutterBottom>
                        {plan} Plan
                      </Typography>
                      <Typography variant="h6" color="#1DB954" gutterBottom>
                        {plan === "Basic" ? "FREE" : "$5 / month"}
                      </Typography>
                      <Typography variant="body2" color="#b0bec5">
                        {plan === "Basic"
                          ? "Access to basic features"
                          : "Unlimited features with priority support"}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>

      <footer className={styles.footer}>
        <section>
          <h3>Follow Us On:</h3>
          <div>
            <Link href="https://twitter.com">
              <Image src='/dark-mode/twitterx.svg' width={25} height={25} alt="Twitter" />
            </Link>
            <Link href="https://facebook.com">
              <Image src='/dark-mode/facebook.svg' width={25} height={25} alt="Facebook" />
            </Link>
            <Link href="https://instagram.com">
              <Image src='/dark-mode/instagram.svg' width={25} height={25} alt="Instagram" />
            </Link>
            <Link href="https://gmail.com">
              <Image src='/dark-mode/gmail.svg' width={25} height={25} alt="Gmail" />
            </Link>
          </div>
        </section>
        <p>&copy; 2021 Recall IQ FlashCards</p>
        <p>Proudly Ghanaian ❤️</p>
      </footer>
    </div>
  );
}
