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
  Chip,
  Alert,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Skills() {
  const navigate = useNavigate();
  const [skills, setSkills] = useState([]);
  const [skillGaps, setSkillGaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    level: 'beginner',
  });

  useEffect(() => {
    fetchSkills();
    fetchSkillGaps();
  }, []);

  const fetchSkills = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await axios.get('http://localhost:5000/api/skills', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSkills(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching skills:', err);
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      } else {
        setError('Failed to load skills. Please try again.');
      }
      setLoading(false);
    }
  };

  const fetchSkillGaps = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await axios.get('http://localhost:5000/api/skills/gap-analysis', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSkillGaps(response.data);
    } catch (err) {
      console.error('Failed to load skill gaps:', err);
    }
  };

  const handleOpenDialog = (skill = null) => {
    if (skill) {
      setSelectedSkill(skill);
      setFormData({
        name: skill.name,
        level: skill.level,
      });
    } else {
      setSelectedSkill(null);
      setFormData({
        name: '',
        level: 'beginner',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedSkill(null);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await axios.post(
        'http://localhost:5000/api/skills',
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      handleCloseDialog();
      fetchSkills();
      fetchSkillGaps();
    } catch (err) {
      console.error('Error saving skill:', err);
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      } else {
        setError(err.response?.data?.message || 'Failed to save skill. Please try again.');
      }
    }
  };

  const handleDelete = async (name) => {
    if (window.confirm('Are you sure you want to delete this skill?')) {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        await axios.delete(`http://localhost:5000/api/skills/${name}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchSkills();
        fetchSkillGaps();
      } catch (err) {
        console.error('Error deleting skill:', err);
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
        } else {
          setError('Failed to delete skill');
        }
      }
    }
  };

  const getLevelColor = (level) => {
    switch (level) {
      case 'beginner':
        return 'warning';
      case 'intermediate':
        return 'info';
      case 'advanced':
        return 'success';
      default:
        return 'default';
    }
  };

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
        <Typography variant="h4">Skills</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add Skill
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              My Skills
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {skills.map((skill) => (
                <Chip
                  key={skill.name}
                  label={`${skill.name} (${skill.level})`}
                  color={getLevelColor(skill.level)}
                  onDelete={() => handleDelete(skill.name)}
                  onClick={() => handleOpenDialog(skill)}
                />
              ))}
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Skill Gaps
            </Typography>
            {skillGaps.length > 0 ? (
              <Box>
                {skillGaps.map((gap, index) => (
                  <Box key={index} sx={{ mb: 2 }}>
                    <Typography variant="body1">
                      {gap.name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {gap.status === 'missing' ? 'Missing' : 'Needs Improvement'}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      Required in {gap.count} applications
                    </Typography>
                  </Box>
                ))}
              </Box>
            ) : (
              <Typography>No skill gaps identified</Typography>
            )}
          </Paper>
        </Grid>
      </Grid>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedSkill ? 'Edit Skill' : 'Add Skill'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Skill Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  select
                  label="Skill Level"
                  name="level"
                  value={formData.level}
                  onChange={handleChange}
                  required
                  disabled={loading}
                >
                  <MenuItem value="beginner">Beginner</MenuItem>
                  <MenuItem value="intermediate">Intermediate</MenuItem>
                  <MenuItem value="advanced">Advanced</MenuItem>
                </TextField>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} disabled={loading}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={loading}>
              {loading ? 'Saving...' : (selectedSkill ? 'Update' : 'Add')}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}

export default Skills; 