import type { User } from '../../../types/user';
import { ProfileCard } from '../../ui/layout';
import { DisplayField } from '../../ui/form/DisplayField';
import { LocationIcon } from '../../ui/icons';

interface LocationSectionProps {
  user: User;
}

export const LocationSection = ({ user }: LocationSectionProps) => (
  <ProfileCard title="Location Information" icon={<LocationIcon />}>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      <DisplayField
        label="State"
        value={user.state || 'Not provided'}
        icon={<LocationIcon />}
      />
      <DisplayField
        label="City"
        value={user.city || 'Not provided'}
        icon={<LocationIcon />}
      />
      <DisplayField
        label="Pincode"
        value={user.pincode || 'Not provided'}
      />
    </div>
    <DisplayField
      label="Address"
      value={user.address || 'Not provided'}
    />
  </ProfileCard>
);
