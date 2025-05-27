'use client';
import { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Paper,
  AppBar,
  Toolbar,
  Button,
} from '@mui/material';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import ParticipantList from '@/components/ParticipantList';
import SecretSantaResults from '@/components/SecretSantaResults';

export default function Home() {
  const [view, setView] = useState('participants'); // 'participants' or 'results'

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="static" color="primary">
        <Toolbar>
          <CardGiftcardIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Secret Santa App
          </Typography>
          <Button
            color="inherit"
            onClick={() => setView('participants')}
            sx={{ mr: 1 }}
          >
            Participants
          </Button>
          <Button
            color="inherit"
            onClick={() => setView('results')}
          >
            Results
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          {view === 'participants' ? (
            <ParticipantList />
          ) : (
            <SecretSantaResults />
          )}
        </Paper>
      </Container>
    </Box>
  );
} 