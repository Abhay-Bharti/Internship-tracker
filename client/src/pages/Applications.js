import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Paper,
  Typography,
  IconButton,
  MenuItem,
  CircularProgress,
  Alert,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import axios from 'axios';

function Applications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [formData, setFormData] = useState({
    company: '',
    position: '',
    jobDescription: '',
    status: 'applied',
    deadline: '',
    contact: {
      name: '',
      email: '',
      phone: '',
    },
    notes: '',
    requiredSkills: []
  });

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/applications', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setApplications(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load applications');
      setLoading(false);
    }
  };

  const handleOpen = (application = null) => {
    if (application) {
      setSelectedApplication(application);
      setFormData({
        ...application,
        deadline: application.deadline ? new Date(application.deadline).toISOString().split('T')[0] : '',
      });
    } else {
      setSelectedApplication(null);
      setFormData({
        company: '',
        position: '',
        jobDescription: '',
        status: 'applied',
        deadline: '',
        contact: {
          name: '',
          email: '',
          phone: '',
        },
        notes: '',
        requiredSkills: []
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedApplication(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('contact.')) {
      const contactField = name.split('.')[1];
      setFormData({
        ...formData,
        contact: {
          ...formData.contact,
          [contactField]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please login to continue');
        return;
      }

      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      };

      const applicationData = {
        company: formData.company,
        position: formData.position,
        jobDescription: formData.jobDescription,
        status: formData.status,
        deadline: formData.deadline ? new Date(formData.deadline) : null,
        contact: {
          name: formData.contact.name,
          email: formData.contact.email,
          phone: formData.contact.phone
        },
        notes: formData.notes,
        requiredSkills: formData.requiredSkills
      };

      if (selectedApplication) {
        await axios.put(
          `http://localhost:5000/api/applications/${selectedApplication._id}`,
          applicationData,
          config
        );
      } else {
        await axios.post(
          'http://localhost:5000/api/applications',
          applicationData,
          config
        );
      }

      handleClose();
      fetchApplications();
    } catch (error) {
      console.error('Error saving application:', error);
      setError(error.response?.data?.message || 'Failed to save application. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this application?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5000/api/applications/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchApplications();
      } catch (err) {
        setError('Failed to delete application');
      }
    }
  };

  const columns = [
    { field: 'company', headerName: 'Company', width: 150 },
    { field: 'position', headerName: 'Position', width: 200 },
    { field: 'status', headerName: 'Status', width: 130 },
    { field: 'applicationDate', headerName: 'Applied Date', width: 150 },
    { field: 'deadline', headerName: 'Deadline', width: 150 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => (
        <Box>
          <IconButton onClick={() => handleOpen(params.row)}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleDelete(params.row._id)}>
            <DeleteIcon />
          </IconButton>
        </Box>
      ),
    },
  ];

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Applications</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
        >
          Add Application
        </Button>
      </Box>

      {error && (
        <Alert severity="error" mb={2}>
          {error}
        </Alert>
      )}

      <Paper sx={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={applications}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          getRowId={(row) => row._id}
        />
      </Paper>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedApplication ? 'Edit Application' : 'Add New Application'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Company"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  required
                  error={!formData.company}
                  helperText={!formData.company ? 'Company name is required' : ''}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Position"
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  required
                  error={!formData.position}
                  helperText={!formData.position ? 'Position is required' : ''}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Job Description"
                  name="jobDescription"
                  value={formData.jobDescription}
                  onChange={handleChange}
                  multiline
                  rows={4}
                  required
                  error={!formData.jobDescription}
                  helperText={!formData.jobDescription ? 'Job description is required' : ''}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  select
                  required
                >
                  <MenuItem value="applied">Applied</MenuItem>
                  <MenuItem value="interviewing">Interviewing</MenuItem>
                  <MenuItem value="offered">Offered</MenuItem>
                  <MenuItem value="rejected">Rejected</MenuItem>
                  <MenuItem value="accepted">Accepted</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Deadline"
                  name="deadline"
                  type="date"
                  value={formData.deadline}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Contact Name"
                  name="contact.name"
                  value={formData.contact.name}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Contact Email"
                  name="contact.email"
                  value={formData.contact.email}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Contact Phone"
                  name="contact.phone"
                  value={formData.contact.phone}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  multiline
                  rows={3}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button 
              type="submit" 
              variant="contained" 
              color="primary"
              disabled={!formData.company || !formData.position || !formData.jobDescription}
            >
              {selectedApplication ? 'Update' : 'Add'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}

export default Applications; 