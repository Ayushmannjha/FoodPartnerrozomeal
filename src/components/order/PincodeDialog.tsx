import { useState } from 'react';
import { MapPin, AlertCircle, CheckCircle2 } from 'lucide-react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Alert, AlertDescription } from '../ui/alert';
import { Label } from '../ui/label';
import { cn } from '../ui/utils';

interface PincodeDialogProps {
  isOpen: boolean;
  onSubmit: (pincode: string) => Promise<void>;
  loading?: boolean;
  error?: string | null;
}

export function PincodeDialog({ isOpen, onSubmit, loading, error }: PincodeDialogProps) {
  const [pincode, setPincode] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  const validatePincode = (value: string): boolean => {
    const pincodeRegex = /^[1-9][0-9]{5}$/;
    return pincodeRegex.test(value);
  };

  const isValid = pincode.length === 6 && validatePincode(pincode);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (!pincode.trim()) {
      setLocalError('Pincode is required');
      return;
    }

    if (!validatePincode(pincode)) {
      setLocalError('Please enter a valid 6-digit pincode');
      return;
    }

    try {
      setIsValidating(true);
      await onSubmit(pincode);
      setPincode('');
    } catch (err) {
      setLocalError('Failed to update pincode. Please try again.');
    } finally {
      setIsValidating(false);
    }
  };

  const handlePincodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 6) {
      setPincode(value);
      setLocalError(null);
    }
  };

  const displayError = error || localError;

  return (
    <DialogPrimitive.Root open={isOpen} modal>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content
          onPointerDownOutside={(e) => e.preventDefault()}
          onInteractOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
          className={cn(
            "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg"
          )}
        >
          <div className="flex flex-col space-y-1.5 text-center sm:text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-orange-100">
              <MapPin className="h-8 w-8 text-orange-600" />
            </div>
            <DialogPrimitive.Title className="text-2xl font-semibold leading-none tracking-tight">
              Pincode Required
            </DialogPrimitive.Title>
            <DialogPrimitive.Description className="text-sm text-muted-foreground">
              Set your delivery area pincode to start receiving orders
            </DialogPrimitive.Description>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Alert className="border-blue-200 bg-blue-50">
              <AlertCircle className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-900">
                <p className="font-medium">Why is this needed?</p>
                <p className="mt-1 text-sm">
                  You'll only receive orders from customers in your pincode area.
                </p>
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <Label htmlFor="pincode" className="text-base font-semibold">
                Enter Your Pincode <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="pincode"
                  type="text"
                  value={pincode}
                  onChange={handlePincodeChange}
                  placeholder="e.g., 800020"
                  maxLength={6}
                  disabled={loading || isValidating}
                  className={cn(
                    "pr-10 text-lg font-medium h-12",
                    displayError && "border-destructive focus-visible:ring-destructive",
                    isValid && "border-green-500 focus-visible:ring-green-500"
                  )}
                  autoFocus
                  required
                />
                {pincode && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {isValid ? (
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    ) : pincode.length === 6 ? (
                      <AlertCircle className="h-5 w-5 text-amber-500" />
                    ) : null}
                  </div>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Enter a 6-digit Indian pincode (e.g., 110001, 560001, 800020)
              </p>
            </div>

            {displayError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{displayError}</AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              disabled={loading || isValidating || !isValid}
              className="w-full h-12 text-base font-semibold"
              size="lg"
            >
              {loading || isValidating ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                  Saving Pincode...
                </>
              ) : (
                <>
                  <MapPin className="mr-2 h-5 w-5" />
                  Save Pincode & Continue
                </>
              )}
            </Button>

            <p className="text-center text-xs text-muted-foreground">
              💡 You can change your pincode later from your profile settings
            </p>
          </form>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}