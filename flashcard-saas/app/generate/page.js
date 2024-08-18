'use client'

import { useUser } from '@clerk/nextjs';
import { useState } from 'react';
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  Snackbar, 
  Alert,
  DialogActions
} from '@mui/material';
import { db } from '../../firebase';
import {
  collection,
  doc,
  writeBatch,
  getDocs,
  query,
  setDoc,
  deleteDoc,
  getDoc,
} from 'firebase/firestore';
import './FlashCardStyle.css'; 
export default function Generate() {
  const [text, setText] = useState('')
  const [flashcards, setFlashcards] = useState([])
  const [setName, setSetName] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const { user } = useUser();
const [snackbarOpen, setSnackbarOpen] = useState(false);
const [snackbarMessage, setSnackbarMessage] = useState('');
const [snackbarSeverity, setSnackbarSeverity] = useState('success');


  const handleSubmit = async () => {
    if (!text.trim()) {
      alert('Please enter some text to generate flashcards.')
      return
    }
  
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ input: text }),
      })

      console.log(response)
  
      if (!response.ok) {
        throw new Error('Failed to generate flashcards')
      }
  
      const data = await response.json()
      console.log(data)

      setFlashcards(data.map(card => ({ ...card, flipped: false })));
    } catch (error) {
      console.error('Error generating flashcards:', error)
      alert('An error occurred while generating flashcards. Please try again.')
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
      console.error('Error saving flashcards:', error);
      showSnackbar('An error occurred while saving flashcards. Please try again.', 'error');
    }
  };
  


  const toggleFlip = (index) => {
    setFlashcards(flashcards.map((card, i) => i === index ? { ...card, flipped: !card.flipped } : card));
  };
  const handleNavigate = () =>{
    router.push('/saved')
  };
  

  return (
    <Container maxWidth="md">
      <Button
          variant="contained"
          color="primary"
          sx={{ mt: 4 }}
          onClick={handleNavigate}
        >
          Go to Saved Sets
        </Button>
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Generate Flashcards
        </Typography>
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
            <Typography variant="h5" component="h2" gutterBottom>
              Generated Flashcards
            </Typography>
            <Grid container spacing={30}>
              {flashcards.map((flashcard, index) => (
                <Grid item xs={10} sm={12} md={6} key={index}>
                  <div className={`flashcard ${flashcard.flipped ? 'flipped' : ''}`} onClick={() => toggleFlip(index)}>
                    <div className="flashcard-inner">
                      <div className="flashcard-front">
                        <Typography variant="h6">Question:</Typography>
                        <Typography variant="p">{flashcard.front}</Typography>
                      </div>
                      <div className="flashcard-back">
                        <Typography variant="h6">Answer:</Typography>
                        <Typography>{flashcard.back}</Typography>
                      </div>
                    </div>
                  </div>
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
  )
}
