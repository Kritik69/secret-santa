'use client';
import { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  Button,
  List,
  ListItem,
  ListItemText,
  Paper,
  Alert,
  Snackbar,
  Pagination,
  Fade,
  Zoom,
} from '@mui/material';
import ShuffleIcon from '@mui/icons-material/Shuffle';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import * as XLSX from 'xlsx';
import { useParticipants } from '@/context/ParticipantContext';
import LoadingSpinner from './LoadingSpinner';

const ITEMS_PER_PAGE = 5;

export default function SecretSantaResults() {
  const { participants } = useParticipants();
  const [assignments, setAssignments] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hoveredItem, setHoveredItem] = useState(null);

  // Load existing assignments when participants change
  useEffect(() => {
    const existingAssignments = participants.map(participant => ({
      giver: participant,
      receiver: participants.find(p => p.name === participant.secretChildName) || null
    })).filter(assignment => assignment.receiver);

    if (existingAssignments.length > 0) {
      setAssignments(existingAssignments);
      console.log('Loaded existing assignments:', existingAssignments);
    }
  }, [participants]);

  const generateAssignments = async () => {
    if (participants.length < 2) {
      setSnackbar({
        open: true,
        message: 'Need at least 2 participants to generate assignments',
        severity: 'error',
      });
      return;
    }

    setLoading(true);

    try {
      let available = [...participants];
      let assigned = new Array(participants.length);
      let success = false;

      // Try multiple times to find a valid assignment
      for (let attempt = 0; attempt < 100 && !success; attempt++) {
        success = true;
        available = [...participants];
        
        for (let i = 0; i < participants.length; i++) {
          const giver = participants[i];
          const possibleReceivers = available.filter(p => p !== giver);
          
          if (possibleReceivers.length === 0) {
            success = false;
            break;
          }

          const receiverIndex = Math.floor(Math.random() * possibleReceivers.length);
          const receiver = possibleReceivers[receiverIndex];
          assigned[i] = { giver, receiver };
          available = available.filter(p => p !== receiver);
        }

        if (success) {
          setAssignments(assigned);
          setPage(1);
          setSnackbar({
            open: true,
            message: 'Secret Santa assignments generated successfully!',
            severity: 'success',
          });
        }
      }

      if (!success) {
        setSnackbar({
          open: true,
          message: 'Failed to generate valid assignments. Please try again.',
          severity: 'error',
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'An error occurred while generating assignments',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const exportToExcel = async () => {
    if (assignments.length === 0) {
      setSnackbar({
        open: true,
        message: 'No assignments to export',
        severity: 'error',
      });
      return;
    }

    setLoading(true);

    try {
      const worksheet = XLSX.utils.json_to_sheet(
        assignments.map(({ giver, receiver }) => ({
          'Employee_Name': giver.name,
          'Employee_EmailID': giver.email,
          'Secret_Child_Name': receiver.name,
          'Secret_Child_EmailID': receiver.email,
        }))
      );

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Assignments');
      
      XLSX.writeFile(workbook, 'Secret-Santa-Assignments.xlsx');

      setSnackbar({
        open: true,
        message: 'Assignments exported successfully!',
        severity: 'success',
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Error exporting assignments',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const pageCount = Math.ceil(assignments.length / ITEMS_PER_PAGE);
  const displayedAssignments = assignments.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Secret Santa Assignments
        </Typography>
        <Box>
          <Button
            variant="contained"
            startIcon={<ShuffleIcon />}
            onClick={generateAssignments}
            disabled={loading}
            sx={{
              mr: 2,
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'scale(1.05)',
              },
            }}
          >
            Generate New Assignments
          </Button>
          <Button
            variant="contained"
            startIcon={<FileDownloadIcon />}
            onClick={exportToExcel}
            disabled={assignments.length === 0 || loading}
            sx={{
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'scale(1.05)',
              },
            }}
          >
            Export Results
          </Button>
        </Box>
      </Box>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          {assignments.length > 0 ? (
            <>
              <List>
                {displayedAssignments.map((assignment, index) => (
                  <Zoom in={true} key={index} style={{ transitionDelay: `${index * 100}ms` }}>
                    <ListItem
                      component={Paper}
                      elevation={hoveredItem === index ? 3 : 1}
                      sx={{
                        mb: 2,
                        p: 2,
                        transition: 'all 0.3s ease',
                        transform: hoveredItem === index ? 'scale(1.02)' : 'scale(1)',
                        '&:hover': {
                          bgcolor: 'rgba(0, 0, 0, 0.02)',
                        },
                      }}
                      onMouseEnter={() => setHoveredItem(index)}
                      onMouseLeave={() => setHoveredItem(null)}
                    >
                      <ListItemText
                        primary={
                          <Typography variant="h6">
                            {assignment.giver.name} → {assignment.receiver.name}
                          </Typography>
                        }
                        secondary={
                          <>
                            <Typography component="span" variant="body2">
                              Giver's Email: {assignment.giver.email}
                            </Typography>
                            <br />
                            <Typography component="span" variant="body2">
                              Receiver's Email: {assignment.receiver.email}
                            </Typography>
                          </>
                        }
                      />
                    </ListItem>
                  </Zoom>
                ))}
              </List>

              {assignments.length > ITEMS_PER_PAGE && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                  <Pagination
                    count={pageCount}
                    page={page}
                    onChange={(_, value) => setPage(value)}
                    color="primary"
                    size="large"
                    sx={{
                      '& .MuiPaginationItem-root': {
                        transition: 'transform 0.2s',
                        '&:hover': {
                          transform: 'scale(1.2)',
                        },
                      },
                    }}
                  />
                </Box>
              )}
            </>
          ) : (
            <Typography variant="body1" color="text.secondary" align="center">
              No assignments generated yet. Click the "Generate New Assignments" button to create Secret Santa pairs.
            </Typography>
          )}
        </>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        TransitionComponent={Fade}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
          elevation={6}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
} 