import type { User } from '../../../types/user';
import { ProfileCard } from '../../ui/layout';
import { DisplayField } from '../../ui/form/DisplayField';
import { LicenseIcon, CertificationIcon } from '../../ui/icons';

interface ProfessionalSectionProps {
  user: User;
}

export const ProfessionalSection = ({ user }: ProfessionalSectionProps) => (
  <ProfileCard title="Professional Details" icon={<LicenseIcon />}>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <DisplayField
        label="License Number"
        value={user.licenseNumber || 'Not provided'}
        icon={<LicenseIcon />}
        verified={!!user.licenseNumber}
      />
      <DisplayField
        label="Certifications"
        value={user.certifications || 'Not provided'}
        icon={<CertificationIcon />}
      />
      <DisplayField
        label="Chat ID"
        value={user.chatId || 'Not provided'}
        icon={<CertificationIcon />}
      />
    </div>
  </ProfileCard>
);
