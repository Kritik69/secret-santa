'use client';
import { useState } from 'react';
import {
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Button,
  Box,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Snackbar,
  Pagination,
  Paper,
  Fade,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import * as XLSX from 'xlsx';
import { useParticipants } from '@/context/ParticipantContext';
import LoadingSpinner from './LoadingSpinner';

const ITEMS_PER_PAGE = 5;

export default function ParticipantList() {
  const { participants, setParticipants } = useParticipants();
  const [openDialog, setOpenDialog] = useState(false);
  const [newParticipant, setNewParticipant] = useState({ name: '', email: '' });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hoveredItem, setHoveredItem] = useState(null);

  const handleFileUpload = async (event) => {
    try {
      setLoading(true);
      const file = event.target.files[0];
      if (!file) {
        setSnackbar({
          open: true,
          message: 'No file selected',
          severity: 'error'
        });
        return;
      }

      console.log('File selected:', file.name);

      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          console.log('File read successfully');
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          
          console.log('Available sheets:', workbook.SheetNames);
          
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
          const jsonData = XLSX.utils.sheet_to_json(firstSheet);
          
          console.log('Parsed data:', jsonData);

          const formattedData = jsonData.map(row => {
            const participant = {
              name: row.Employee_Name || '',
              email: row.Employee_EmailID || '',
              secretChildName: row.Secret_Child_Name || '',
              secretChildEmail: row.Secret_Child_EmailID || '',
            };
            console.log('Formatted participant:', participant);
            return participant;
          }).filter(p => p.name && p.email);

          console.log('Final formatted data:', formattedData);

          if (formattedData.length === 0) {
            setSnackbar({
              open: true,
              message: 'No valid participants found in the Excel file. Please ensure it has Employee_Name and Employee_EmailID columns.',
              severity: 'error'
            });
            return;
          }

          setParticipants(formattedData);
          setPage(1);
          setSnackbar({
            open: true,
            message: `Successfully imported ${formattedData.length} participants`,
            severity: 'success'
          });
        } catch (error) {
          console.error('Error processing Excel file:', error);
          setSnackbar({
            open: true,
            message: `Error processing Excel file: ${error.message}`,
            severity: 'error'
          });
        } finally {
          setLoading(false);
        }
      };

      reader.onerror = (error) => {
        console.error('Error reading file:', error);
        setSnackbar({
          open: true,
          message: 'Error reading file',
          severity: 'error'
        });
        setLoading(false);
      };

      reader.readAsArrayBuffer(file);
    } catch (error) {
      console.error('Error in file upload handler:', error);
      setSnackbar({
        open: true,
        message: `Error uploading file: ${error.message}`,
        severity: 'error'
      });
      setLoading(false);
    }
  };

  const handleAddParticipant = () => {
    if (newParticipant.name && newParticipant.email) {
      setParticipants([...participants, {
        ...newParticipant,
        secretChildName: '',
        secretChildEmail: ''
      }]);
      setNewParticipant({ name: '', email: '' });
      setOpenDialog(false);
    }
  };

  const handleRemoveParticipant = (index) => {
    const newParticipants = [...participants];
    newParticipants.splice(index, 1);
    setParticipants(newParticipants);
  };

  const pageCount = Math.ceil(participants.length / ITEMS_PER_PAGE);
  const displayedParticipants = participants.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Participants
        </Typography>
        <Box>
          <Button
            variant="contained"
            component="label"
            sx={{
              mr: 2,
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'scale(1.05)',
              },
            }}
            startIcon={<UploadFileIcon />}
          >
            Upload Excel
            <input
              type="file"
              hidden
              accept=".xlsx,.xls"
              onChange={handleFileUpload}
            />
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenDialog(true)}
            sx={{
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'scale(1.05)',
              },
            }}
          >
            Add Participant
          </Button>
        </Box>
      </Box>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <List>
            {displayedParticipants.map((participant, index) => (
              <Fade in={true} key={index} timeout={300}>
                <ListItem
                  component={Paper}
                  elevation={hoveredItem === index ? 3 : 1}
                  sx={{
                    mb: 1,
                    borderRadius: 1,
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
                    primary={participant.name}
                    secondary={
                      <Box component="span">
                        <Box component="span" sx={{ display: 'block' }}>
                          {participant.email}
                        </Box>
                        {participant.secretChildName && (
                          <Box 
                            component="span" 
                            sx={{ 
                              display: 'block', 
                              color: 'text.secondary',
                              fontSize: '0.875rem',
                              mt: 0.5
                            }}
                          >
                            Secret Child: {participant.secretChildName}
                          </Box>
                        )}
                      </Box>
                    } 
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => handleRemoveParticipant(index)}
                      sx={{
                        transition: 'all 0.2s',
                        '&:hover': {
                          color: 'error.main',
                          transform: 'scale(1.1)',
                        },
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              </Fade>
            ))}
          </List>

          {participants.length > ITEMS_PER_PAGE && (
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
      )}

      <Dialog 
        open={openDialog} 
        onClose={() => setOpenDialog(false)}
        TransitionComponent={Fade}
        transitionDuration={300}
      >
        <DialogTitle>Add New Participant</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Name"
            fullWidth
            value={newParticipant.name}
            onChange={(e) => setNewParticipant({ ...newParticipant, name: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Email"
            type="email"
            fullWidth
            value={newParticipant.email}
            onChange={(e) => setNewParticipant({ ...newParticipant, email: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setOpenDialog(false)}
            sx={{
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'scale(1.05)',
              },
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleAddParticipant} 
            variant="contained"
            sx={{
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'scale(1.05)',
              },
            }}
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>

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