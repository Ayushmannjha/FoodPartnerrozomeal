import type { User } from '../../../types/user';
import { ProfileCard } from '../../ui/layout';
import { InputField } from '../../ui/form/InputField';
import { LicenseIcon, CertificationIcon } from '../../ui/icons';

interface ProfessionalFormProps {
  formData: Partial<User>;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export const ProfessionalForm = ({ formData, onChange }: ProfessionalFormProps) => (
  <ProfileCard title="Professional Details" icon={<LicenseIcon />} isEditing={true}>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <InputField
        label="License Number"
        name="licenseNumber"
        value={formData.licenseNumber || ''}
        onChange={onChange}
        placeholder="Enter your license number"
        icon={<LicenseIcon />}
      />
      <InputField
        label="Certifications"
        name="certifications"
        value={formData.certifications || ''}
        onChange={onChange}
        placeholder="Enter your certifications"
        icon={<CertificationIcon />}
      />
    </div>
  </ProfileCard>
);
