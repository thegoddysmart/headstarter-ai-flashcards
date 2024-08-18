'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Container, Typography, Box, Grid, Card, CardContent,Button } from '@mui/material';
import { useUser } from '@clerk/nextjs';
import { db } from '../../../firebase';
import { doc, getDoc } from 'firebase/firestore';
import styles from '../../generate/FlashCardStyle.css';


export default function FlashcardSetPage({ params }) {
  const [flashcards, setFlashcards] = useState([]);
  const [flipped, setFlipped] = useState({});
  const { setId } = params;
  const { user } = useUser();
  const router = useRouter();
  const userId = user?.id;

  useEffect(() => {
    const fetchFlashcards = async () => {
      if (!userId) {
        console.error('User is not logged in');
        return;
      }

      try {
        const userDocRef = doc(db, 'users', userId);
        const flashcardSetDocRef = doc(userDocRef, 'flashcardSets', setId);
        const flashcardSetDoc = await getDoc(flashcardSetDocRef);
        
        if (flashcardSetDoc.exists()) {
          const flashcardSetData = flashcardSetDoc.data();
          console.log('Flashcard Set Data:', flashcardSetData);
          setFlashcards(flashcardSetData.flashcards.slice(0, 10)); 
        } else {
          console.error('Flashcard set not found');
        }
      } catch (error) {
        console.error('Error fetching flashcards:', error);
      }
    };

    fetchFlashcards();
  }, [userId, setId]);

  
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
          Flashcards for Set: {setId}
        </Typography>
        {flashcards.length > 0 ? (
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
        ) : (
          <Typography variant="body1" sx={{ mt: 2 }}>
            No flashcards found for this set.
          </Typography>
        )} 
      </Box>
    </Container>
  );
}