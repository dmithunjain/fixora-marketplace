import { useContext, useState } from 'react';
import { Box, IconButton, Badge, Popover, Typography, List, ListItem, ListItemText, ListItemIcon, Button, Divider, Chip } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import BookingIcon from '@mui/icons-material/Event';
import PaymentIcon from '@mui/icons-material/Payment';
import ReviewIcon from '@mui/icons-material/Star';
import InfoIcon from '@mui/icons-material/Info';
import { NotificationContext } from '../context/NotificationContext';

const NotificationBell = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead, loading } = useContext(NotificationContext);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'booking': return <BookingIcon color="primary" />;
      case 'payment': return <PaymentIcon color="success" />;
      case 'review': return <ReviewIcon color="warning" />;
      default: return <InfoIcon color="info" />;
    }
  };

  const formatTime = (date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now - new Date(date)) / 1000);
    
    if (diffInSeconds < 60) return 'just now';
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const open = Boolean(anchorEl);

  return (
    <>
      <IconButton color="inherit" onClick={handleOpen}>
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          sx: { width: 360, maxHeight: 480 }
        }}
      >
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" fontWeight={600}>
            Notifications
          </Typography>
          {unreadCount > 0 && (
            <Button size="small" onClick={markAllAsRead}>
              Mark all read
            </Button>
          )}
        </Box>
        
        <Divider />
        
        {loading ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography color="text.secondary">Loading...</Typography>
          </Box>
        ) : notifications.length === 0 ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography color="text.secondary">No notifications</Typography>
          </Box>
        ) : (
          <List sx={{ p: 0, maxHeight: 350, overflow: 'auto' }}>
            {notifications.slice(0, 10).map((notification) => (
              <ListItem
                key={notification._id}
                onClick={() => !notification.isRead && markAsRead(notification._id)}
                sx={{
                  bgcolor: notification.isRead ? 'transparent' : 'action.hover',
                  cursor: 'pointer',
                  '&:hover': { bgcolor: 'action.selected' }
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  {getNotificationIcon(notification.type)}
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2" fontWeight={notification.isRead ? 400 : 600}>
                        {notification.title}
                      </Typography>
                      {!notification.isRead && <Chip label="New" size="small" color="primary" sx={{ ml: 1 }} />}
                    </Box>
                  }
                  secondary={
                    <>
                      <Typography variant="caption" color="text.secondary" component="span">
                        {notification.message}
                      </Typography>
                      <Typography variant="caption" display="block" color="text.secondary">
                        {formatTime(notification.createdAt)}
                      </Typography>
                    </>
                  }
                />
              </ListItem>
            ))}
          </List>
        )}
        
        {notifications.length > 0 && (
          <>
            <Divider />
            <Box sx={{ p: 1, textAlign: 'center' }}>
              <Button size="small" onClick={handleClose}>
                View All Notifications
              </Button>
            </Box>
          </>
        )}
      </Popover>
    </>
  );
};

export default NotificationBell;
