import type { User } from '../../../types/user';
import { ProfileCard } from '../../ui/layout';
import { InputField } from '../../ui/form/InputField';
import { UserIcon, EmailIcon, PhoneIcon } from '../../ui/icons';

interface PersonalInfoFormProps {
  formData: Partial<User>;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export const PersonalInfoForm = ({ formData, onChange }: PersonalInfoFormProps) => (
  <ProfileCard title="Personal Information" icon={<UserIcon />} isEditing={true}>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <InputField
        label="Full Name"
        name="name"
        value={formData.name || ''}
        onChange={onChange}
        placeholder="Enter your full name"
        required
        icon={<UserIcon />}
      />
      <InputField
        label="Email"
        name="email"
        type="email"
        value={formData.email || ''}
        onChange={onChange}
        placeholder="Enter your email"
        required
        icon={<EmailIcon />}
      />
      <InputField
        label="Phone"
        name="phone"
        type="tel"
        value={formData.phone || ''}
        onChange={onChange}
        placeholder="Enter your phone number"
        icon={<PhoneIcon />}
      />
    </div>
  </ProfileCard>
);
