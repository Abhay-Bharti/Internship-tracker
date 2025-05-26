import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  CircularProgress,
  Card,
  CardContent,
  CardMedia,
  Avatar,
  Chip,
  Divider,
} from '@mui/material';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Work as WorkIcon,
  TrendingUp as TrendingUpIcon,
  Assessment as AssessmentIcon,
  EmojiEvents as EmojiEventsIcon,
} from '@mui/icons-material';
import axios from 'axios';

// Sample images (you can replace these with your own images)
const dashboardImage = 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80';
const successImage = 'https://images.unsplash.com/photo-1521791136064-7986c2920216?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80';

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [skillGaps, setSkillGaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const [statsResponse, skillsResponse] = await Promise.all([
          axios.get('http://localhost:5000/api/applications/stats', {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get('http://localhost:5000/api/skills/gap-analysis', {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        setStats(statsResponse.data);
        setSkillGaps(skillsResponse.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load dashboard data');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  const barChartData = {
    labels: stats?.map(item => item._id) || [],
    datasets: [
      {
        label: 'Number of Applications',
        data: stats?.map(item => item.count) || [],
        backgroundColor: [
          'rgba(25, 118, 210, 0.7)',
          'rgba(76, 175, 80, 0.7)',
          'rgba(255, 152, 0, 0.7)',
          'rgba(244, 67, 54, 0.7)',
          'rgba(156, 39, 176, 0.7)',
        ],
        borderColor: [
          'rgba(25, 118, 210, 1)',
          'rgba(76, 175, 80, 1)',
          'rgba(255, 152, 0, 1)',
          'rgba(244, 67, 54, 1)',
          'rgba(156, 39, 176, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const doughnutChartData = {
    labels: stats?.map(item => item._id) || [],
    datasets: [
      {
        data: stats?.map(item => item.count) || [],
        backgroundColor: [
          'rgba(25, 118, 210, 0.7)',
          'rgba(76, 175, 80, 0.7)',
          'rgba(255, 152, 0, 0.7)',
          'rgba(244, 67, 54, 0.7)',
          'rgba(156, 39, 176, 0.7)',
        ],
        borderColor: '#fff',
        borderWidth: 2,
      },
    ],
  };

  const totalApplications = stats?.reduce((sum, item) => sum + item.count, 0) || 0;
  const successRate = stats?.find(item => item._id === 'accepted')?.count || 0;

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          position: 'relative',
          height: '300px',
          mb: 4,
          borderRadius: 2,
          overflow: 'hidden',
        }}
      >
        <CardMedia
          component="img"
          height="300"
          image={dashboardImage}
          alt="Dashboard Hero"
          sx={{
            objectFit: 'cover',
            filter: 'brightness(0.7)',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            color: 'white',
            textAlign: 'center',
            p: 3,
          }}
        >
          <Typography variant="h3" component="h1" gutterBottom>
            Welcome to Your Dashboard
          </Typography>
          <Typography variant="h6">
            Track your applications and skill development journey
          </Typography>
        </Box>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1 }}>
              <Box display="flex" alignItems="center" mb={2}>
                <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                  <WorkIcon />
                </Avatar>
                <Typography variant="h6">Total Applications</Typography>
              </Box>
              <Typography variant="h4" color="primary">
                {totalApplications}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1 }}>
              <Box display="flex" alignItems="center" mb={2}>
                <Avatar sx={{ bgcolor: 'success.main', mr: 2 }}>
                  <EmojiEventsIcon />
                </Avatar>
                <Typography variant="h6">Success Rate</Typography>
              </Box>
              <Typography variant="h4" color="success.main">
                {((successRate / totalApplications) * 100 || 0).toFixed(1)}%
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1 }}>
              <Box display="flex" alignItems="center" mb={2}>
                <Avatar sx={{ bgcolor: 'warning.main', mr: 2 }}>
                  <TrendingUpIcon />
                </Avatar>
                <Typography variant="h6">In Progress</Typography>
              </Box>
              <Typography variant="h4" color="warning.main">
                {stats?.find(item => item._id === 'interviewing')?.count || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1 }}>
              <Box display="flex" alignItems="center" mb={2}>
                <Avatar sx={{ bgcolor: 'info.main', mr: 2 }}>
                  <AssessmentIcon />
                </Avatar>
                <Typography variant="h6">Skill Gaps</Typography>
              </Box>
              <Typography variant="h4" color="info.main">
                {skillGaps.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts Section */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Application Status Overview
            </Typography>
            <Box sx={{ height: 300 }}>
              <Bar
                data={barChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        stepSize: 1,
                      },
                    },
                  },
                }}
              />
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Application Distribution
            </Typography>
            <Box sx={{ height: 300 }}>
              <Doughnut
                data={doughnutChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                }}
              />
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Skill Gaps Section */}
      <Grid container spacing={3} sx={{ mt: 3 }}>
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Skill Gap Analysis
            </Typography>
            <Divider sx={{ mb: 2 }} />
            {skillGaps.length > 0 ? (
              <Grid container spacing={2}>
                {skillGaps.slice(0, 6).map((gap, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Card sx={{ height: '100%' }}>
                      <CardMedia
                        component="img"
                        height="140"
                        image={successImage}
                        alt="Skill Development"
                        sx={{ filter: 'brightness(0.8)' }}
                      />
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          {gap.name}
                        </Typography>
                        <Box display="flex" alignItems="center" mb={1}>
                          <Chip
                            label={gap.status === 'missing' ? 'Missing' : 'Needs Improvement'}
                            color={gap.status === 'missing' ? 'error' : 'warning'}
                            size="small"
                          />
                        </Box>
                        <Typography variant="body2" color="textSecondary">
                          {gap.importance === 'required' ? 'Required Skill' : 'Preferred Skill'}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Typography>No skill gaps identified</Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Dashboard; 