'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { Container, Card, CardContent, Typography, Box, Button } from '@mui/material'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../firebase'
import { useUser } from '@clerk/nextjs'

export default function FlashcardSet() {
  const { isLoaded, isSignedIn, user } = useUser()
  const router = useRouter()
  const { id } = router.query

  const [flashcards, setFlashcards] = useState([])
  const [currentCard, setCurrentCard] = useState(0)
  const [showBack, setShowBack] = useState(false)

  useEffect(() => {
    async function fetchFlashcards() {
      if (!user || !id) return
      const docRef = doc(collection(db, 'users'), user.id, 'flashcardSets', id)
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        setFlashcards(docSnap.data().flashcards)
      }
    }
    fetchFlashcards()
  }, [user, id])

  const handleNextCard = () => {
    setShowBack(false)
    setCurrentCard((prevCard) => (prevCard + 1) % flashcards.length)
  }

  const handleFlipCard = () => {
    setShowBack((prevShowBack) => !prevShowBack)
  }

  if (!isLoaded || !isSignedIn) return null

  return (
    <Container maxWidth="sm">
      {flashcards.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Card>
            <CardContent>
              <Typography variant="h6">
                {showBack ? 'Back:' : 'Front:'}
              </Typography>
              <Typography>
                {showBack ? flashcards[currentCard].back : flashcards[currentCard].front}
              </Typography>
            </CardContent>
          </Card>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
            <Button variant="outlined" onClick={handleFlipCard}>
              Flip Card
            </Button>
            <Button variant="contained" color="primary" onClick={handleNextCard}>
              Next Card
            </Button>
          </Box>
        </Box>
      )}
    </Container>
  )
}
