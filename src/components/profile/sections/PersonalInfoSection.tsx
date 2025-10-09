import type { User } from '../../../types/user';
import { ProfileCard } from '../../ui/layout';
import { DisplayField } from '../../ui/form/DisplayField';
import { UserIcon, EmailIcon, PhoneIcon } from '../../ui/icons';

interface PersonalInfoSectionProps {
  user: User;
}

export const PersonalInfoSection = ({ user }: PersonalInfoSectionProps) => (
  <ProfileCard title="Personal Information" icon={<UserIcon />}>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <DisplayField
        label="Full Name"
        value={user.name || 'Not provided'}
        icon={<UserIcon />}
        verified={!!user.name}
      />
      <DisplayField
        label="Email"
        value={user.email || 'Not provided'}
        icon={<EmailIcon />}
        verified={!!user.email}
      />
      <DisplayField
        label="Role"
        value={user.role || 'Food Partner'}
        icon={<UserIcon />}
      />
      <DisplayField
        label="Phone"
        value={user.phone || 'Not provided'}
        icon={<PhoneIcon />}
        verified={!!user.phone}
      />
    </div>
  </ProfileCard>
);
