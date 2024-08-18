'use client';

import { useEffect, useState } from 'react';
import { useUser, UserButton } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import {
  Container,
  Typography,
  Box,
  Grid,
  Button,
  Card,
  CardContent,
  Checkbox,
  FormControlLabel
} from '@mui/material';
import { db } from '../../firebase';
import { collection, doc, getDocs, deleteDoc } from 'firebase/firestore';
import '../generate/FlashCardStyle.css'; // Ensure styles are included
import Footer from '../components/Footer';

export default function SavedFlashcards() {
  const [flashcardSets, setFlashcardSets] = useState([]);
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [selectedSets, setSelectedSets] = useState([]);
  const { user } = useUser();
  const firstName = user?.firstName || user?.primaryEmailAddress?.emailAddress || 'Guest';
  const router = useRouter();

  useEffect(() => {
    const fetchFlashcards = async () => {
      if (!user) return;

      try {
        const userDocRef = doc(collection(db, 'users'), user.id);
        const flashcardSetsRef = collection(userDocRef, 'flashcardSets');
        const flashcardSetsSnapshot = await getDocs(flashcardSetsRef);

        const fetchedSets = await Promise.all(
          flashcardSetsSnapshot.docs.map(async (doc) => {
            const flashcardsData = doc.data();
            return { id: doc.id, ...flashcardsData };
          })
        );

        setFlashcardSets(fetchedSets);
      } catch (error) {
        console.error('Error fetching saved flashcards:', error);
      }
    };

    fetchFlashcards();
  }, [user]);

  const handleSetClick = (setId) => {
    if (isDeleteMode) {
      toggleSelectSet(setId);
    } else {
      router.push(`/saved/${setId}`);
    }
  };

  const handleNavigate = () => {
    router.push('/generate');
  };

  const toggleDeleteMode = () => {
    setIsDeleteMode(!isDeleteMode);
    setSelectedSets([]);
  };

  const toggleSelectSet = (setId) => {
    setSelectedSets((prevSelectedSets) =>
      prevSelectedSets.includes(setId)
        ? prevSelectedSets.filter((id) => id !== setId)
        : [...prevSelectedSets, setId]
    );
  };

  const handleDeleteSelected = async () => {
    if (!user) return;

    try {
      const userDocRef = doc(collection(db, 'users'), user.id);

      await Promise.all(
        selectedSets.map(async (setId) => {
          const setDocRef = doc(collection(userDocRef, 'flashcardSets'), setId);
          await deleteDoc(setDocRef);
        })
      );

      // Filter out the deleted sets from the state
      setFlashcardSets((prevSets) => prevSets.filter((set) => !selectedSets.includes(set.id)));
      setSelectedSets([]);
      setIsDeleteMode(false);
    } catch (error) {
      console.error('Error deleting flashcard sets:', error);
    }
  };

  return (
    <>
      <Container maxWidth="md" sx={{ mb: 25}}>
        {/* Top right corner UserButton */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
          <Typography variant="body1">Hello, {firstName}</Typography>
          <UserButton />
        </Box>

        <Button variant="contained" color="primary" sx={{ mt: 4 }} onClick={handleNavigate}>
          Generate New Cards
        </Button>

        <Box sx={{ my: 2 }}>
          <Button
            variant="outlined"
            color={isDeleteMode ? 'error' : 'primary'} // Use 'error' or 'primary' based on mode
            onClick={toggleDeleteMode}
          >
            {isDeleteMode ? 'Cancel' : 'Delete Flashcard Sets'}
          </Button>
          {isDeleteMode && (
            <Button
              variant="contained"
              color="error" // Correctly set to 'error'
              sx={{ ml: 2 }}
              onClick={handleDeleteSelected}
              disabled={selectedSets.length === 0}
            >
              Delete Selected
            </Button>
          )}
        </Box>

        <Box sx={{ my: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Saved Flashcard Sets
          </Typography>

          {flashcardSets.length > 0 ? (
            <Grid container spacing={3}>
              {flashcardSets.map((set) => (
                <Grid item xs={12} sm={6} md={4} key={set.id}>
                  <Card
                    onClick={() => handleSetClick(set.id)}
                    sx={{ cursor: 'pointer', position: 'relative' }}
                  >
                    {isDeleteMode && (
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 8,
                          right: 8,
                          zIndex: 1,
                        }}
                      >
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={selectedSets.includes(set.id)}
                              onChange={() => toggleSelectSet(set.id)}
                              onClick={(e) => e.stopPropagation()} // Prevent card click from firing
                            />
                          }
                          label=""
                        />
                      </Box>
                    )}
                    <CardContent sx={{ display: 'flex', alignItems: 'center', paddingRight: isDeleteMode ? '48px' : '16px' }}>
                      <Typography variant="h5" component="h2">
                        {set.id}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Typography variant="body1" sx={{ mt: 2 }}>
              No saved flashcards found.
            </Typography>
          )}
        </Box>
      </Container>

      <Footer />
    </>
  );
}
