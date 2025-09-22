// src/components/order/EmptyOrderState.tsx
import { Package } from 'lucide-react';

interface EmptyOrderStateProps {
  title?: string;
  description?: string;
  actionButton?: React.ReactNode;
}

export function EmptyOrderState({ 
  title = "No Orders Found", 
  description = "There are no orders to display at the moment.",
  actionButton 
}: EmptyOrderStateProps) {
  return (
    <div className="text-center py-12">
      <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 mb-6">{description}</p>
      {actionButton}
    </div>
  );
}