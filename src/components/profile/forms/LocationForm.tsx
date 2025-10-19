import { MapPin, AlertCircle } from 'lucide-react';
import { Input } from '../../ui/input';
import { Textarea } from '../../ui/textarea';
import { Label } from '../../ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Alert, AlertDescription } from '../../ui/alert';

interface LocationFormProps {
  formData: {
    state?: string;
    city?: string;
    pincode?: string;
    address?: string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export function LocationForm({ formData, onChange }: LocationFormProps) {
  const isPincodeInvalid = !formData.pincode || formData.pincode === '0' || formData.pincode === '';

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-blue-600" />
          Location Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Pincode Warning if missing */}
        {isPincodeInvalid && (
          <Alert variant="destructive" className="border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-900">
              <p className="font-semibold">⚠️ Pincode is Required!</p>
              <p className="text-sm mt-1">
                You cannot receive orders without setting your delivery area pincode. Please enter a valid 6-digit pincode below.
              </p>
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Pincode - MOST IMPORTANT - Show First */}
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="pincode" className="text-base font-semibold">
              Pincode <span className="text-destructive">*</span>
              <span className="ml-2 text-xs font-normal text-muted-foreground">
                (Delivery area - Required for orders)
              </span>
            </Label>
            <Input
              id="pincode"
              name="pincode"
              value={formData.pincode || ''}
              onChange={(e) => {
                // Only allow digits
                const value = e.target.value.replace(/\D/g, '');
                if (value.length <= 6) {
                  e.target.value = value;
                  onChange(e);
                }
              }}
              maxLength={6}
              placeholder="e.g., 800020"
              required
              className={`text-lg font-medium h-12 ${
                isPincodeInvalid 
                  ? 'border-red-400 bg-red-50/50 focus-visible:ring-red-500' 
                  : 'border-green-400 bg-green-50/50 focus-visible:ring-green-500'
              }`}
            />
            <Alert className={`${
              isPincodeInvalid 
                ? 'border-red-200 bg-red-50' 
                : 'border-orange-200 bg-orange-50'
            }`}>
              <AlertDescription className={`text-sm ${
                isPincodeInvalid ? 'text-red-800' : 'text-orange-800'
              }`}>
                {isPincodeInvalid ? (
                  <>🚫 Orders are DISABLED until you set a valid pincode</>
                ) : (
                  <>✅ You'll receive orders from pincode: <strong>{formData.pincode}</strong></>
                )}
              </AlertDescription>
            </Alert>
          </div>

          {/* State */}
          <div className="space-y-2">
            <Label htmlFor="state">State</Label>
            <Input
              id="state"
              name="state"
              value={formData.state || ''}
              onChange={onChange}
              placeholder="e.g., Bihar"
            />
          </div>

          {/* City */}
          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              name="city"
              value={formData.city || ''}
              onChange={onChange}
              placeholder="e.g., Patna"
            />
          </div>
        </div>

        {/* Address */}
        <div className="space-y-2">
          <Label htmlFor="address">Address</Label>
          <Textarea
            id="address"
            name="address"
            value={formData.address || ''}
            onChange={onChange}
            rows={3}
            placeholder="Enter your full address"
          />
        </div>
      </CardContent>
    </Card>
  );
}
