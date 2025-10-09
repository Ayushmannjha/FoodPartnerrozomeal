// src/components/order/OrderCard.tsx
import { useState, useEffect } from 'react';
import { Order, OrderStatus, ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '../../types/order';
import { Food } from '../../types/food';
import { Thali } from '../../types/thali';
import { foodService } from '../../services/foodService';
import { thaliService } from '../../services/thaliService';
import { User, Package, DollarSign, Clock, ChevronDown, ChevronUp, CheckCircle, Phone, Mail, UtensilsCrossed, Loader2 } from 'lucide-react';

interface OrderCardProps {
  order: Order;
  onAccept: (orderId: string) => Promise<{ success: boolean; message: string }>;
  isAccepting: boolean;
  showDetails?: boolean;
}

interface OrderItemDetail {
  id: string;
  name: string;
  price: number;
  quantity: number;
  category?: string;
  imageUrl?: string;
  type: 'food' | 'thali';
}

interface ThaliWithFoodDetails extends Thali {
  orderQuantity: number; // Quantity ordered by customer
  foodDetails: Food[];
}

export function OrderCard({ order, onAccept, isAccepting, showDetails = false }: OrderCardProps) {
  const [isExpanded, setIsExpanded] = useState(showDetails);
  const [isProcessing, setIsProcessing] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [foodItems, setFoodItems] = useState<OrderItemDetail[]>([]);
  const [thaliItems, setThaliItems] = useState<ThaliWithFoodDetails[]>([]);
  const [detailsLoaded, setDetailsLoaded] = useState(false);

  // Load detailed information when expanded
  useEffect(() => {
    if (isExpanded && !detailsLoaded) {
      loadOrderItemDetails();
    }
  }, [isExpanded, detailsLoaded]);

  const loadOrderItemDetails = async () => {
    setLoadingDetails(true);
    try {
      // Load individual food items
      if (order.foodIds && order.foodIds.length > 0) {
        const foodPromises = order.foodIds.map(async (foodId, index) => {
          try {
            const food: Food = await foodService.getFoodDetail(foodId);
            return {
              id: food.id,
              name: food.name,
              price: food.price,
              quantity: order.quantity[index] || 1,
              category: food.category,
              imageUrl: food.imageUrl || undefined,
              type: 'food' as const
            };
          } catch (error) {
            console.error(`Failed to load food ${foodId}:`, error);
            return {
              id: foodId,
              name: `Food Item ${foodId.slice(-4)}`,
              price: 0,
              quantity: order.quantity[index] || 1,
              type: 'food' as const,
              category: 'Unknown'
            };
          }
        });

        const loadedFoodItems = await Promise.all(foodPromises);
        setFoodItems(loadedFoodItems);
      }

      // Load thali items with their food details
      if (order.thaliIds && order.thaliIds.length > 0) {
        const thaliPromises = order.thaliIds.map(async (thaliId, index) => {
          try {
            const thali: Thali = await thaliService.getThaliDetail(thaliId);
            
            // Get the quantity ordered for this thali
            const thaliQuantity = order.quantity[order.foodIds.length + index] || 1;
            const foodDetails: Food[] = [];
            
            // Load food details for each food in the thali
            if (thali.foodIds && thali.foodIds.length > 0) {
              const thaliFoodPromises = thali.foodIds.map(async (foodId) => {
                try {
                  return await foodService.getFoodDetail(foodId);
                } catch (error) {
                  console.error(`Failed to load thali food ${foodId}:`, error);
                  return {
                    id: foodId,
                    name: `Food Item ${foodId.slice(-4)}`,
                    category: 'Unknown',
                    price: 0
                  } as Food;
                }
              });
              
              const loadedFoodDetails = await Promise.all(thaliFoodPromises);
              foodDetails.push(...loadedFoodDetails);
            }

            return {
              ...thali,
              orderQuantity: thaliQuantity,
              foodDetails
            } as ThaliWithFoodDetails;
          } catch (error) {
            console.error(`Failed to load thali ${thaliId}:`, error);
            return {
              id: thaliId,
              name: `Thali ${thaliId.slice(-4)}`,
              price: 0,
              orderQuantity: order.quantity[order.foodIds.length + index] || 1,
              foodIds: [],
              quantity: [],
              createdAt: new Date().toISOString(),
              foodDetails: []
            } as ThaliWithFoodDetails;
          }
        });

        const loadedThaliItems = await Promise.all(thaliPromises);
        setThaliItems(loadedThaliItems);
      }

      setDetailsLoaded(true);
    } catch (error) {
      console.error('Error loading order item details:', error);
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleAccept = async () => {
    setIsProcessing(true);
    try {
      const result = await onAccept(order.orderId);
      if (result.success) {
        console.log('✅ Order accepted successfully');
      } else {
        console.error('❌ Failed to accept order:', result.message);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const totalItems = order.foodIds.length + (order.thaliIds?.length || 0);
  const totalQuantity = order.quantity.reduce((sum, qty) => sum + qty, 0);
  const isPending = order.status === OrderStatus.PREPARING || order.status === 0;

  // Get order priority
  const getOrderPriority = () => {
    const orderDate = new Date(order.date);
    const now = new Date();
    const diffHours = (now.getTime() - orderDate.getTime()) / (1000 * 60 * 60);
    
    if (isPending && diffHours > 1) return 'urgent';
    if (isPending) return 'pending';
    return 'normal';
  };

  const priority = getOrderPriority();

  const priorityStyles = {
    urgent: 'border-red-300 bg-red-50',
    pending: 'border-yellow-300 bg-yellow-50',
    normal: 'border-gray-200 bg-white'
  };

  return (
    <div className={`rounded-lg shadow-md border-2 ${priorityStyles[priority]} hover:shadow-lg transition-all duration-200`}>
      
      {/* Priority Badge */}
      {priority === 'urgent' && (
        <div className="bg-red-600 text-black px-3 py-1 text-xs font-medium rounded-t-lg">
          🚨 URGENT - Order placed over 1 hour ago
        </div>
      )}
      
      {/* Order Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            
            {/* Order Title & Status */}
            <div className="flex items-center space-x-4 mb-3">
              <h3 className="text-lg font-semibold text-gray-900">
                Order #{order.orderId.slice(-8)}
              </h3>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                ORDER_STATUS_COLORS[order.status as OrderStatus] || 'bg-gray-100 text-gray-800'
              }`}>
                {ORDER_STATUS_LABELS[order.status as OrderStatus] || 'Unknown Status'}
              </span>
              {isPending && (
                <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                  Needs Action
                </span>
              )}
            </div>
            
            {/* Order Summary Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              <div className="flex items-center text-gray-600">
                <User className="h-4 w-4 mr-2 flex-shrink-0" />
                <span className="truncate">{order.user.name}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Package className="h-4 w-4 mr-2 flex-shrink-0" />
                <span>{totalItems} items ({totalQuantity} qty)</span>
              </div>
              <div className="flex items-center text-gray-600">
                <DollarSign className="h-4 w-4 mr-2 flex-shrink-0" />
                <span className="font-semibold text-green-600">₹{order.price}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Clock className="h-4 w-4 mr-2 flex-shrink-0" />
                <span>{new Date(order.date).toLocaleDateString()}</span>
              </div>
            </div>

            {/* Quick Contact Info */}
            <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center">
                <Phone className="h-3 w-3 mr-1" />
                <span>{order.user.phone}</span>
              </div>
              <div className="flex items-center">
                <Mail className="h-3 w-3 mr-1" />
                <span className="truncate">{order.user.email}</span>
              </div>
            </div>

            {/* Quick Items Preview */}
            {!isExpanded && (foodItems.length > 0 || thaliItems.length > 0) && (
              <div className="mt-3 p-2 bg-gray-50 rounded text-sm">
                <div className="flex items-center space-x-4">
                  {foodItems.length > 0 && (
                    <span className="flex items-center text-blue-600">
                      <UtensilsCrossed className="h-3 w-3 mr-1" />
                      {foodItems.length} Food Items
                    </span>
                  )}
                  {thaliItems.length > 0 && (
                    <span className="flex items-center text-purple-600">
                      <Package className="h-3 w-3 mr-1" />
                      {thaliItems.length} Thali Items
                    </span>
                  )}
                </div>
                <div className="mt-1 text-gray-600">
                  {[...foodItems, ...thaliItems].slice(0, 2).map(item => item.name).join(', ')}
                  {totalItems > 2 && ` +${totalItems - 2} more`}
                </div>
              </div>
            )}
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center space-x-2 ml-4">
            
            {/* Accept Button */}
            {isPending && (
              <button
                onClick={handleAccept}
                disabled={isProcessing || isAccepting}
                className="px-4 py-2 bg-green-600 text-black text-sm font-medium rounded-md hover:bg-green-700 disabled:opacity-50 flex items-center space-x-1 transition-colors"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Accepting...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    <span>Accept</span>
                  </>
                )}
              </button>
            )}
            
            {/* Expand Button */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 text-gray-500 hover:text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
              title={isExpanded ? 'Hide details' : 'Show details'}
            >
              {isExpanded ? (
                <ChevronUp className="h-5 w-5" />
              ) : (
                <ChevronDown className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="p-4 bg-gray-50">
          
          {/* Customer Details */}
          <div className="mb-6">
            <h4 className="font-medium text-gray-900 mb-2">Customer Information</h4>
            <div className="bg-white p-3 rounded-md border">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Name:</span>
                  <span className="ml-2">{order.user.name}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Phone:</span>
                  <span className="ml-2">{order.user.phone}</span>
                </div>
                <div className="md:col-span-2">
                  <span className="font-medium text-gray-700">Email:</span>
                  <span className="ml-2">{order.user.email}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Order Items Details */}
          <div className="mb-6">
            <h4 className="font-medium text-gray-900 mb-3">Order Items Details</h4>
            
            {loadingDetails ? (
              <div className="flex items-center justify-center py-8 bg-white rounded-md border">
                <Loader2 className="h-6 w-6 animate-spin text-blue-600 mr-2" />
                <span className="text-gray-600">Loading item details...</span>
              </div>
            ) : (foodItems.length > 0 || thaliItems.length > 0) ? (
              <div className="space-y-6">
                
                {/* Individual Food Items Section */}
                {foodItems.length > 0 && (
                  <div>
                    <h5 className="font-medium text-blue-700 mb-3 flex items-center">
                      <UtensilsCrossed className="h-4 w-4 mr-2" />
                      Individual Food Items ({foodItems.length})
                    </h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {foodItems.map((item) => (
                        <FoodItemCard key={item.id} item={item} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Thali Items Section */}
                {thaliItems.length > 0 && (
                  <div>
                    <h5 className="font-medium text-purple-700 mb-3 flex items-center">
                      <Package className="h-4 w-4 mr-2" />
                      Thali Items ({thaliItems.length})
                    </h5>
                    <div className="space-y-4">
                      {thaliItems.map((thali) => (
                        <ThaliItemCard key={thali.id} thali={thali} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white p-4 rounded-md border text-center text-gray-500">
                <Package className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                <p>Unable to load detailed item information</p>
                <p className="text-sm">Food Items: {order.foodIds.length} | Thali Items: {order.thaliIds?.length || 0}</p>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="bg-white p-4 rounded-md border">
            <h4 className="font-medium text-gray-900 mb-2">Order Summary</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <p><span className="font-medium">Status:</span> {ORDER_STATUS_LABELS[order.status as OrderStatus] || 'Unknown'}</p>
                <p><span className="font-medium">Placed:</span> {new Date(order.date).toLocaleString()}</p>
              </div>
              <div>
                <p><span className="font-medium">Total Items:</span> {totalItems}</p>
                <p><span className="font-medium">Total Quantity:</span> {totalQuantity}</p>
              </div>
              <div>
                <p className="font-semibold text-xl text-green-600">Total: ₹{order.price}</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          {isPending && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <button
                onClick={handleAccept}
                disabled={isProcessing || isAccepting}
                className="w-full px-4 py-3 bg-green-600 text-black font-semibold rounded-md hover:bg-green-700 disabled:opacity-50 transition-colors"
              >
                {isProcessing ? 'Accepting Order...' : 'Accept This Order'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Individual Food Item Card Component
interface FoodItemCardProps {
  item: OrderItemDetail;
}

function FoodItemCard({ item }: FoodItemCardProps) {
  const [imageError, setImageError] = useState(false);

  const getImageUrl = (imageUrl?: string) => {
    if (!imageUrl) {
      return `https://via.placeholder.com/80x60?text=${encodeURIComponent(item.name.slice(0, 8))}&color=6B7280&background=F3F4F6`;
    }
    
    if (imageUrl.startsWith('https://') || imageUrl.startsWith('http://')) {
      return imageUrl;
    }
    
    const cleanPath = imageUrl.startsWith('/') ? imageUrl.slice(1) : imageUrl;
    return `https://api.rozomeal.com/${cleanPath}`;
  };

  return (
    <div className="bg-white border border-blue-200 rounded-lg p-3 hover:shadow-sm transition-shadow">
      <div className="flex space-x-3">
        {/* Food Image */}
        <div className="w-16 h-16 flex-shrink-0">
          <img
            src={getImageUrl(item.imageUrl)}
            alt={item.name}
            className="w-full h-full object-cover rounded"
            onError={(e) => {
              if (!imageError) {
                setImageError(true);
                e.currentTarget.src = getImageUrl();
              }
            }}
          />
        </div>
        
        {/* Food Details */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start mb-1">
            <h6 className="font-semibold text-gray-900 truncate">{item.name}</h6>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 ml-2">
              Food
            </span>
          </div>
          
          <div className="text-sm text-gray-600 mb-2">
            <p>Category: <span className="font-medium">{item.category}</span></p>
            <p>Unit Price: <span className="font-medium">₹{item.price}</span></p>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Qty: <span className="font-medium">{item.quantity}</span></span>
            <span className="font-semibold text-orange-600">₹{(item.price * item.quantity).toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Thali Item Card Component
interface ThaliItemCardProps {
  thali: ThaliWithFoodDetails;
}

function ThaliItemCard({ thali }: ThaliItemCardProps) {
  const [imageError, setImageError] = useState(false);

  const getImageUrl = (imageUrl?: string) => {
    if (!imageUrl) {
      return `https://via.placeholder.com/100x80?text=${encodeURIComponent(thali.name.slice(0, 8))}&color=7C3AED&background=F3F4F6`;
    }
    
    if (imageUrl.startsWith('https://') || imageUrl.startsWith('http://')) {
      return imageUrl;
    }
    
    const cleanPath = imageUrl.startsWith('/') ? imageUrl.slice(1) : imageUrl;
    return `https://api.rozomeal.com /${cleanPath}`;
  };

  return (
    <div className="bg-white border-2 border-purple-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
      <div className="flex space-x-4">
        {/* Thali Image */}
        <div className="w-20 h-20 flex-shrink-0">
          <img
            src={getImageUrl(thali.imageUrl)}
            alt={thali.name}
            className="w-full h-full object-cover rounded"
            onError={(e) => {
              if (!imageError) {
                setImageError(true);
                e.currentTarget.src = getImageUrl();
              }
            }}
          />
        </div>
        
        {/* Thali Details */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start mb-2">
            <h6 className="font-bold text-gray-900 text-lg">{thali.name}</h6>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800 ml-2">
              Complete Thali
            </span>
          </div>
          
          <div className="text-sm text-gray-600 mb-3">
            <p>Thali Price: <span className="font-semibold text-purple-600">₹{thali.price}</span></p>
            <p>Quantity: <span className="font-medium">{thali.orderQuantity}</span></p>
            <p>Total: <span className="font-bold text-orange-600">₹{(thali.price * thali.orderQuantity).toFixed(2)}</span></p>
          </div>

          {/* Food Items in Thali */}
          {thali.foodDetails && thali.foodDetails.length > 0 && (
            <div className="mt-3">
              <div className="font-semibold text-purple-700 text-sm flex items-center mb-2">
                🍽️ Included Food Items ({thali.foodDetails.length})
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {thali.foodDetails.map((food, index) => (
                  <div key={food.id} className="bg-purple-50 border border-purple-200 rounded p-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 flex-shrink-0">
                        <img
                          src={getImageUrl(food.imageUrl)}
                          alt={food.name}
                          className="w-full h-full object-cover rounded"
                          onError={(e) => {
                            e.currentTarget.src = `https://via.placeholder.com/32x32?text=${food.name.charAt(0)}&color=7C3AED&background=F3F4F6`;
                          }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-purple-900 text-sm truncate">{food.name}</p>
                        <p className="text-purple-600 text-xs">
                          {food.category} • Qty: {thali.quantity[index] || 1}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}