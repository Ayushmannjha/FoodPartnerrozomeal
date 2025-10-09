import type { User } from '../../../types/user';
import { ProfileCard } from '../../ui/layout';
import { InputField } from '../../ui/form/InputField';
import { LocationIcon } from '../../ui/icons';

interface LocationFormProps {
  formData: Partial<User>;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export const LocationForm = ({ formData, onChange }: LocationFormProps) => (
  <ProfileCard title="Location Information" icon={<LocationIcon />} isEditing={true}>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      <InputField
        label="State"
        name="state"
        value={formData.state || ''}
        onChange={onChange}
        placeholder="Enter your state"
        icon={<LocationIcon />}
      />
      <InputField
        label="City"
        name="city"
        value={formData.city || ''}
        onChange={onChange}
        placeholder="Enter your city"
        icon={<LocationIcon />}
      />
      <InputField
        label="Pincode"
        name="pincode"
        type="number"
        value={formData.pincode || ''}
        onChange={onChange}
        placeholder="Enter your pincode"
      />
    </div>
    <InputField
      label="Address"
      name="address"
      value={formData.address || ''}
      onChange={onChange}
      placeholder="Enter your full address"
      isTextarea
      rows={3}
    />
  </ProfileCard>
);
