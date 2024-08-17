'use client'

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import { db } from '../../firebase';
import { collection, doc, getDocs } from 'firebase/firestore';
import '../generate/FlashCardStyle.css'; // Ensure styles are included

export default function SavedFlashcards() {
  const [flashcardSets, setFlashcardSets] = useState([]);
  const { user } = useUser();
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
    router.push(`/saved/${setId}`);
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
          Saved Flashcard Sets
        </Typography>
        {flashcardSets.length > 0 ? (
          <Grid container spacing={3}>
            {flashcardSets.map((set) => (
              <Grid item xs={12} sm={6} md={4} key={set.id}>
                <Card onClick={() => handleSetClick(set.id)} sx={{ cursor: 'pointer' }}>
                  <CardContent>
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
  );
}
