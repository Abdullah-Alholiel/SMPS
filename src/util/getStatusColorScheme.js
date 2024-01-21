export const getStatusColorScheme = (status) => {
    const statusColorMapping = {
      active: 'green',
      completed: 'blue',
      cancelled: 'red'
    };
    return statusColorMapping[status.toLowerCase()] || 'gray';
  };
  