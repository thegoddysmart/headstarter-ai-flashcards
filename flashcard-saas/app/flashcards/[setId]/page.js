'use client'

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { Container, Button, Typography, Box, Grid, Snackbar, Alert, Card, CardContent, CardActions } from '@mui/material';
import { db } from '../../../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { lightTheme, darkTheme } from '../../generate/theme'; // Import themes
import { ThemeProvider, CssBaseline } from '@mui/material';
import '../../generate/FlashCardStyle.css'; 

export default function FlashcardSetPage({ params }) {
  const { setId } = params;
  const [flashcards, setFlashcards] = useState([]);
  const [darkMode, setDarkMode] = useState(false); // State for theme mode
  const [loading, setLoading] = useState(true); // Loading state
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const { user, isSignedIn } = useUser();
  const router = useRouter();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  useEffect(() => {
    const fetchFlashcardSet = async () => {
      try {
        const userId = user.id;
        const decodedSetId = decodeURIComponent(setId); // Decode setId to handle spaces/special characters
        const flashcardSetRef = doc(db, 'users', userId, 'flashcardSets', decodedSetId);
        
        console.log(`Fetching flashcards from path: users/${userId}/flashcardSets/${decodedSetId}`);
        
        const flashcardSetDoc = await getDoc(flashcardSetRef);

        if (flashcardSetDoc.exists()) {
          setFlashcards(flashcardSetDoc.data().flashcards);
          console.log('Flashcards:', flashcardSetDoc.data().flashcards);
        } else {
          throw new Error('Flashcard set not found');
        }
      } catch (error) {
        console.error(error);
        showSnackbar('Error loading flashcards.', 'error');
      } finally {
        setLoading(false); // Set loading to false after data is fetched
      }
    };

    if (user && setId) {
      fetchFlashcardSet();
    }
  }, [user, setId]);

  const showSnackbar = (message, severity = 'success') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const toggleFlip = (index) => {
    setFlashcards(flashcards.map((card, i) => i === index ? { ...card, flipped: !card.flipped } : card));
  };

  // Loading state
  if (loading) {
    return (
      <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
        <CssBaseline />
        <Container maxWidth="md">
          <Typography variant="h5" component="h2" gutterBottom>
            Loading flashcards...
          </Typography>
        </Container>
      </ThemeProvider>
    );
  }

  // No flashcards found state
  if (!flashcards.length) {
    return (
      <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
        <CssBaseline />
        <Container maxWidth="md">
          <Typography variant="h5" component="h2" gutterBottom>
            No flashcards available.
          </Typography>
        </Container>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      <Container maxWidth="md">
        <Box sx={{ my: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Flashcard Set: {setId}
          </Typography>
          <Button
            variant="contained"
            onClick={() => setDarkMode(!darkMode)}
            sx={{ mb: 2 }}
          >
            Toggle {darkMode ? 'Light' : 'Dark'} Mode
          </Button>
        </Box>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }} component="h2" gutterBottom>
            Flashcards
          </Typography>
          <Grid container spacing={4}>
            {flashcards.map((flashcard, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card variant="outlined" onClick={() => toggleFlip(index)} sx={{ cursor: 'pointer', height: '100%' }}>
                  <CardContent>
                    <Typography variant="h6" component="div">
                      {flashcard.flipped ? 'Answer:' : 'Question:'}
                    </Typography>
                    <Typography variant="body2">
                      {flashcard.flipped ? flashcard.back : flashcard.front}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    {/* Add any additional actions if needed */}
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={() => setSnackbarOpen(false)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity} sx={{ width: '100%' }}>
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Container>
    </ThemeProvider>
  );
}
