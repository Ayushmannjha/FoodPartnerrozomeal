import React from 'react';
import { X, Package, User, Phone, IndianRupee, Clock } from 'lucide-react';
import { useNotification } from '../../hooks/useNotification';
import { Button } from '../ui/button';
import { Alert, AlertDescription } from '../ui/alert';

export const OrderNotificationModal: React.FC = () => {
  const { 
    activeNotification, 
    dismissNotification, 
    acceptOrderFromNotification,
    isAccepting,
    acceptError
  } = useNotification();

  // 🐛 DEBUG: Log modal render state
  console.log('🎬 OrderNotificationModal render:', {
    hasActiveNotification: !!activeNotification,
    orderId: activeNotification?.order?.orderId,
    timestamp: new Date().toISOString()
  });

  if (!activeNotification) {
    console.log('❌ Modal hidden - no activeNotification');
    return null;
  }

  console.log('✅ Modal VISIBLE - showing order:', activeNotification.order.orderId);
  const { order } = activeNotification;

  // Format date/time
  const orderTime = new Date(order.date).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit'
  });

  // Calculate total items
  const totalItems = (order.foodIds?.length || 0) + (order.thaliIds?.length || 0);

  return (
    <>
      {/* Backdrop - Semi-transparent */}
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 animate-in fade-in duration-200"
        onClick={dismissNotification}
      />

      {/* Modal - Compact 1/4 Screen Size */}
      <div className="fixed top-4 right-4 z-50 w-96 animate-in slide-in-from-right duration-300">
        <div 
          className="bg-white rounded-xl shadow-2xl overflow-hidden border-l-4 border-orange-500 hover:shadow-orange-200/50 transition-shadow duration-300"
          onClick={(e: React.MouseEvent) => e.stopPropagation()}
        >
          {/* Header - Compact */}
          <div className="bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 px-4 py-3 relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-white/95 rounded-lg flex items-center justify-center shadow-lg animate-pulse">
                  <Package className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    New Order! 
                    <span className="inline-flex items-center justify-center w-2 h-2 bg-green-400 rounded-full animate-ping"></span>
                  </h2>
                  <p className="text-orange-100 text-xs font-medium">#{order.orderId.slice(0, 8)}</p>
                </div>
              </div>
              <button
                onClick={(e: React.MouseEvent) => {
                  e.stopPropagation();
                  dismissNotification();
                }}
                disabled={isAccepting}
                className="text-white/80 hover:text-white hover:bg-white/10 p-1.5 rounded-lg transition-all disabled:opacity-50"
                aria-label="Close notification"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Body - Compact & Clean */}
          <div className="p-4 space-y-3 max-h-[70vh] overflow-y-auto">
            {/* Error Alert */}
            {acceptError && (
              <Alert variant="destructive" className="animate-in slide-in-from-top py-2">
                <AlertDescription className="text-xs">{acceptError}</AlertDescription>
              </Alert>
            )}

            {/* Price Highlight - Most Important */}
            <div className="bg-gradient-to-br from-green-50 via-emerald-50 to-green-100 rounded-lg p-3 border border-green-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                    <IndianRupee className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-gray-700 font-medium text-sm">Order Value</span>
                </div>
                <span className="text-2xl font-bold text-green-600">
                  ₹{order.price}
                </span>
              </div>
            </div>

            {/* Order Info - Condensed */}
            <div className="space-y-2">
              {/* Customer Name */}
              <div className="flex items-center gap-2 bg-blue-50 rounded-lg p-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500">Customer</p>
                  <p className="font-semibold text-sm text-gray-900 truncate">{order.user?.name || 'N/A'}</p>
                </div>
              </div>

              {/* Phone */}
              {order.user?.phone && (
                <div className="flex items-center gap-2 bg-green-50 rounded-lg p-2">
                  <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500">Phone</p>
                    <p className="font-semibold text-sm text-gray-900">{order.user.phone}</p>
                  </div>
                </div>
              )}

              {/* Items & Time - Side by Side */}
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center gap-2 bg-purple-50 rounded-lg p-2">
                  <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Package className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500">Items</p>
                    <p className="font-bold text-sm text-gray-900">{totalItems}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 bg-amber-50 rounded-lg p-2">
                  <div className="w-8 h-8 bg-amber-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500">Time</p>
                    <p className="font-bold text-xs text-gray-900">{orderTime}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Item Details - Collapsible */}
            {(order.foodIds?.length > 0 || (order.thaliIds && order.thaliIds.length > 0)) && (
              <div className="bg-gray-50 rounded-lg p-3 space-y-2 border border-gray-200">
                <p className="text-xs font-semibold text-gray-700 flex items-center gap-1">
                  <Package className="w-3 h-3" />
                  Order Items
                </p>
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {order.foodIds?.map((foodId: string, index: number) => (
                    <div key={foodId} className="flex justify-between text-xs bg-white rounded px-2 py-1">
                      <span className="text-gray-600">Food Item {index + 1}</span>
                      <span className="font-semibold text-gray-900">
                        Qty: {order.quantity?.[index] || 1}
                      </span>
                    </div>
                  ))}
                  {order.thaliIds?.map((thaliId: string, index: number) => (
                    <div key={thaliId} className="flex justify-between text-xs bg-white rounded px-2 py-1">
                      <span className="text-gray-600">Thali {index + 1}</span>
                      <span className="font-semibold text-gray-900">
                        Qty: {order.quantity?.[order.foodIds?.length + index] || 1}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions - Compact */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-4 py-3 flex gap-2 border-t border-gray-200">
            <Button
              onClick={(e: React.MouseEvent) => {
                e.stopPropagation();
                acceptOrderFromNotification(order.orderId);
              }}
              disabled={isAccepting}
              className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-3 text-sm shadow-md hover:shadow-lg transition-all duration-200"
            >
              {isAccepting ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span className="text-xs">Accepting...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <Package className="w-4 h-4" />
                  <span>Accept Order</span>
                </div>
              )}
            </Button>
            
            <Button
              onClick={(e: React.MouseEvent) => {
                e.stopPropagation();
                dismissNotification();
              }}
              disabled={isAccepting}
              variant="outline"
              className="px-4 py-3 border-2 border-gray-300 hover:bg-gray-200 font-semibold text-sm transition-colors"
            >
              Later
            </Button>
          </div>
        </div>

        {/* Subtle glow effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 rounded-xl opacity-20 blur-xl -z-10 animate-pulse"></div>
      </div>
    </>
  );
};
