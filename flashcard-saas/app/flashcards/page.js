'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { db } from '../../firebase'; // Adjust the import based on your firebase config location
import { collection, getDocs } from 'firebase/firestore';
import { Container, Grid, Card, CardContent, Typography, Button } from '@mui/material';
import { lightTheme, darkTheme } from '../generate/theme'; // Import your themes
import { ThemeProvider, CssBaseline } from '@mui/material';

export default function FlashcardSets() {
  const [flashcardSets, setFlashcardSets] = useState([]);
  const [darkMode, setDarkMode] = useState(false); // State for theme mode
  const { user, isSignedIn } = useUser();
  const router = useRouter();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  useEffect(() => {
    const fetchFlashcardSets = async () => {
      if (user) {
        const userId = user.id;
        const flashcardSetsRef = collection(db, 'users', userId, 'flashcardSets');
        const snapshot = await getDocs(flashcardSetsRef);

        const sets = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        console.log("Fetched Flashcard Sets:", sets); // debug

        setFlashcardSets(sets);
      }
    };

    if (isSignedIn) {
      fetchFlashcardSets();
    }
  }, [isSignedIn, user]);

  // if (!isSignedIn) {
  //   router.push('/sign-in');
  //   return null;
  // }

  const handleSetClick = (setId) => {
    router.push(`/flashcards/${setId}`);
  };

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      <Container maxWidth="md" sx={{ my: 4 }}>
        <Typography variant="h4" gutterBottom>
          Flashcard Sets
        </Typography>
        <Button
          variant="contained"
          onClick={() => setDarkMode(!darkMode)}
          sx={{ mb: 2 }}
        >
          Toggle {darkMode ? 'Light' : 'Dark'} Mode
        </Button>

        {flashcardSets.length === 0 ? (
          <Typography variant="h6" color="textSecondary" gutterBottom>
            No flashcard sets found. Create some in the Generate Flashcards section.
          </Typography>
        ) : (
          <Grid container spacing={4}>
            {flashcardSets.map((set) => (
              <Grid item xs={12} sm={6} md={4} key={set.id}>
                <Card
                  sx={{ cursor: 'pointer', height: '100%' }}
                  onClick={() => handleSetClick(set.id)}
                >
                  <CardContent>
                    <Typography variant="h6" component="div">
                      {set.id}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </ThemeProvider>
  );
}
