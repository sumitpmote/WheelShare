// Utility functions for consistent IST date/time formatting

export const formatDateIST = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-IN', { 
    timeZone: 'Asia/Kolkata',
    day: '2-digit',
    month: '2-digit', 
    year: 'numeric'
  });
};

export const formatTimeIST = (dateString) => {
  return new Date(dateString).toLocaleTimeString('en-IN', { 
    hour: '2-digit', 
    minute: '2-digit',
    timeZone: 'Asia/Kolkata'
  });
};

export const formatDateTimeIST = (dateString) => {
  return `${formatDateIST(dateString)} • ${formatTimeIST(dateString)}`;
};