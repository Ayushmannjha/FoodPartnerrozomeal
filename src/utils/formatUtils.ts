export const formatPrice = (price: number): string => {
  return `₹${price.toFixed(2)}`;
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const formatPhoneNumber = (phone: string): string => {
  // Format Indian phone numbers
  if (phone.length === 10) {
    return `+91-${phone.slice(0, 5)}-${phone.slice(5)}`;
  }
  return phone;
};