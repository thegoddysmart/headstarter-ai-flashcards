'use client'

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { Container, TextField, Button, Typography, Box, Grid, Dialog, DialogTitle, DialogContent, DialogContentText, Snackbar, Alert, DialogActions, Card, CardContent, CardActions } from '@mui/material';
import { db } from '../../firebase';
import { collection, doc, writeBatch, getDoc } from 'firebase/firestore';
import { lightTheme, darkTheme } from './theme'; // Import themes
import { ThemeProvider, CssBaseline } from '@mui/material';
import './FlashCardStyle.css'; 

export default function Generate() {
  const [text, setText] = useState('');
  const [flashcards, setFlashcards] = useState([]);
  const [setName, setSetName] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [darkMode, setDarkMode] = useState(false); // State for theme mode

  const { user, isSignedIn } = useUser();
  const router = useRouter();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  if (!isSignedIn) {
    router.push('/sign-in');
    return null;
  }

  const handleSubmit = async () => {
    if (!text.trim()) {
      alert('Please enter some text to generate flashcards.');
      return;
    }

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ input: text }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate flashcards');
      }

      const data = await response.json();
      setFlashcards(data.map(card => ({ ...card, flipped: false })));
    } catch (error) {
      alert('An error occurred while generating flashcards. Please try again.');
    }
  };

  const handleOpenDialog = () => setDialogOpen(true);
  const handleCloseDialog = () => setDialogOpen(false);

  const showSnackbar = (message, severity = 'success') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const saveFlashcards = async () => {
    if (!user) {
      showSnackbar('You must be signed in to save flashcards.', 'error');
      return;
    }

    if (!setName.trim()) {
      showSnackbar('Please enter a name for your flashcard set.', 'warning');
      return;
    }

    try {
      const userId = user.id;
      const userDocRef = doc(collection(db, 'users'), userId);
      const userDocSnap = await getDoc(userDocRef);

      const batch = writeBatch(db);

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        const updatedSets = [...(userData.flashcardSets || []), { name: setName }];
        batch.update(userDocRef, { flashcardSets: updatedSets });
      } else {
        batch.set(userDocRef, { flashcardSets: [{ name: setName }] });
      }

      const setDocRef = doc(collection(userDocRef, 'flashcardSets'), setName);
      batch.set(setDocRef, { flashcards });

      await batch.commit();

      showSnackbar('Flashcards saved successfully!', 'success');
      handleCloseDialog();
      setSetName('');
      setFlashcards([]);
    } catch (error) {
      showSnackbar('An error occurred while saving flashcards. Please try again.', 'error');
    }
  };

  const toggleFlip = (index) => {
    setFlashcards(flashcards.map((card, i) => i === index ? { ...card, flipped: !card.flipped } : card));
  };

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      <Container maxWidth="md">
        <Box sx={{ my: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Generate Flashcards
          </Typography>
          <Button
            variant="contained"
            onClick={() => setDarkMode(!darkMode)}
            sx={{ mb: 2 }}
          >
            Toggle {darkMode ? 'Light' : 'Dark'} Mode
          </Button>
          <TextField
            value={text}
            onChange={(e) => setText(e.target.value)}
            label="Enter text"
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            sx={{ mb: 2 }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            fullWidth
          >
            Generate Flashcards
          </Button>
        </Box>
        
        {flashcards.length > 0 && (
          <>
            <Box sx={{ mt: 4 }}>
              <Typography variant="h5" sx={{ mb: 3, fontWeight: 600}} component="h2" gutterBottom>
                Generated Flashcards
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

            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
              <Button variant="contained" color="primary" onClick={handleOpenDialog}>
                Save Flashcards
              </Button>
            </Box>

            <Dialog open={dialogOpen} onClose={handleCloseDialog}>
              <DialogTitle>Save Flashcard Set</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  Please enter a name for your flashcard set.
                </DialogContentText>
                <TextField
                  autoFocus
                  margin="dense"
                  label="Set Name"
                  type="text"
                  fullWidth
                  value={setName}
                  onChange={(e) => setSetName(e.target.value)}
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseDialog}>Cancel</Button>
                <Button onClick={saveFlashcards} color="primary">
                  Save
                </Button>
              </DialogActions>
            </Dialog>
          </>
        )}

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
  )
}
