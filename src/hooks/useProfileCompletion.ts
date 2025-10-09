import type { User } from '../types/user';

export const useProfileCompletion = (user: User | null) => {
  if (!user) return 0;
  
  const fields = ['name', 'email', 'phone', 'licenseNumber', 'state', 'city', 'address'];
  const filledFields = fields.filter(field => user[field as keyof User]);
  
  return Math.round((filledFields.length / fields.length) * 100);
};
