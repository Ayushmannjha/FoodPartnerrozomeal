# AuthContext Refresh Fix - Complete Implementation

## Problem Statement

When a user updates their profile (especially the pincode), the WebSocket connection doesn't properly update because:

1. **Profile Update Flow**: 
   - User updates profile with new pincode
   - Backend saves the update and returns "Updated" string
   - We fetch the updated profile via `getCurrentUserProfile()`
   - But AuthContext user state is NOT refreshed

2. **AuthContext Issue**:
   - AuthContext sets `user` state only during initialization (on mount)
   - Profile updates save new data to backend but don't update AuthContext
   - useWebSocket reads stale `user.pincode` from AuthContext

3. **Page Refresh Race Condition**:
   - On page refresh, AuthContext loads asynchronously
   - useWebSocket might connect before auth is ready
   - Shows brief flash of old/undefined pincode

## Root Cause Analysis

### Data Flow Before Fix

```
Profile Update
   ↓
Backend saves new pincode
   ↓
getCurrentUserProfile() returns updated data
   ↓
❌ AuthContext.user STILL has old pincode (not refreshed)
   ↓
useWebSocket reads user.pincode → OLD VALUE
   ↓
WebSocket connects with wrong pincode
```

### Page Refresh Flow Before Fix

```
Page Refresh
   ↓
AuthContext starts loading (async)
   ↓
useWebSocket reads user → undefined (auth not ready)
   ↓
Auth completes → user has OLD pincode briefly
   ↓
Brief flash of old value before correct value loads
```

## Solution Implementation

### 1. Add `refreshAuth()` Method to AuthContext

**File**: `src/context/AuthContext.tsx`

```typescript
// Added to AuthContextType interface
refreshAuth: () => Promise<void>;

// Implementation
const refreshAuth = async () => {
  console.log('🔄 refreshAuth called - fetching updated profile from API');
  
  if (!isAuthenticated || !TokenManager.hasValidToken()) {
    console.warn('⚠️ Cannot refresh: not authenticated or no valid token');
    return;
  }

  try {
    // Fetch the updated profile from the API
    const profileResult = await getCurrentUserProfile();
    
    if (profileResult.success && profileResult.data) {
      console.log('✅ Profile refreshed successfully:', {
        id: profileResult.data.id,
        pincode: profileResult.data.pincode,
        name: profileResult.data.name
      });
      setUser(profileResult.data);
    } else {
      console.error('❌ Failed to refresh profile:', profileResult.error);
    }
  } catch (error) {
    console.error('❌ Error refreshing auth:', error);
  }
};

// Added to context provider value
<AuthContext.Provider 
  value={{ 
    isAuthenticated, 
    user, 
    foodPartnerId,
    login, 
    logout, 
    loading,
    refreshProfile,
    refreshAuth,  // ✅ NEW
    tokenInfo
  }}
>
```

**Key Points**:
- `refreshAuth()` is async and fetches updated profile from API
- Updates AuthContext.user state with fresh data
- Includes comprehensive logging for debugging
- Guards against calling when not authenticated

### 2. Call `refreshAuth()` After Profile Update

**File**: `src/hooks/useProfile.ts`

```typescript
import { useAuth } from '../context/AuthContext';

export function useProfile() {
  const { refreshAuth } = useAuth();

  const updateProfile = useCallback(async (profileData: Partial<User>): Promise<User | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await updateUserProfile(profileData);
      if (result.success && result.data) {
        // 🔄 Refresh AuthContext after successful profile update
        console.log('✅ Profile updated successfully, refreshing AuthContext...');
        await refreshAuth();  // ✅ KEY LINE
        return result.data;
      } else {
        setError(result.error || 'Failed to update profile');
        return null;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, [refreshAuth]);
}
```

**Key Points**:
- Added `useAuth()` hook to access `refreshAuth()`
- Call `await refreshAuth()` after successful profile update
- Added `refreshAuth` to dependency array of `useCallback`

### 3. Fix Page Refresh Race Condition in useWebSocket

**File**: `src/hooks/useWebSocket.ts`

```typescript
export const useWebSocket = (options?: UseWebSocketOptions) => {
  const { user, loading: authLoading } = useAuth();  // ✅ Get loading state

  // Initial HTTP load effect
  useEffect(() => {
    // Guard: Wait for auth to finish loading first
    if (authLoading) {
      console.log('⏳ Auth is loading, waiting for user data...');
      return;
    }

    // Rest of initial load logic...
  }, [user?.id, pincode, isPincodeValid, authLoading]);  // ✅ Added authLoading

  // WebSocket connection effect
  useEffect(() => {
    // Guard: Wait for auth to finish loading first
    if (authLoading) {
      console.log('⏳ Auth is loading, waiting before WebSocket connection...');
      return;
    }

    // Rest of WebSocket connection logic...
  }, [user?.id, pincode, isPincodeValid, isInitialLoadComplete, authLoading, options]);  // ✅ Added authLoading
}
```

**Key Points**:
- Extract `loading` state from `useAuth()` as `authLoading`
- Add guard condition to wait for auth loading to complete
- Prevents connecting WebSocket before user data is ready
- Added `authLoading` to dependency arrays

## Complete Data Flow After Fix

### Profile Update Flow

```
Profile Update
   ↓
Backend saves new pincode
   ↓
getCurrentUserProfile() returns updated data
   ↓
✅ refreshAuth() called
   ↓
✅ AuthContext.user updated with new pincode
   ↓
useWebSocket detects pincode change (via useRef tracking)
   ↓
✅ WebSocket disconnects and reconnects with NEW pincode
```

### Page Refresh Flow

```
Page Refresh
   ↓
AuthContext starts loading (authLoading = true)
   ↓
✅ useWebSocket waits (checks authLoading)
   ↓
Auth completes loading (authLoading = false)
   ↓
✅ useWebSocket reads user.pincode → CORRECT VALUE
   ↓
✅ WebSocket connects with correct pincode
```

## Files Modified

1. **src/context/AuthContext.tsx**
   - Added `refreshAuth()` method to AuthContextType interface
   - Implemented `refreshAuth()` to fetch updated profile from API
   - Added `refreshAuth` to context provider value
   - Fixed type imports (ReactNode, User)
   - Added `chatId` property to user object creation

2. **src/hooks/useProfile.ts**
   - Imported `useAuth` hook
   - Added `refreshAuth` from useAuth
   - Called `await refreshAuth()` after successful profile update
   - Updated dependency array to include `refreshAuth`

3. **src/hooks/useWebSocket.ts**
   - Extracted `loading` as `authLoading` from useAuth
   - Added `authLoading` guard in initial load effect
   - Added `authLoading` guard in WebSocket connection effect
   - Added `authLoading` to dependency arrays

## Testing Checklist

- [ ] Update profile with new pincode
- [ ] Verify AuthContext.user updates immediately
- [ ] Verify WebSocket reconnects with new pincode
- [ ] Check console logs for proper flow
- [ ] Refresh page after profile update
- [ ] Verify no flash of old pincode value
- [ ] Check that orders load correctly after refresh
- [ ] Verify WebSocket connects with correct pincode

## Benefits

1. **Immediate Context Update**: AuthContext refreshes right after profile update
2. **No Race Conditions**: useWebSocket waits for auth to be ready
3. **Proper WebSocket Update**: Pincode changes trigger reconnection
4. **Better User Experience**: No flash of old values on refresh
5. **Comprehensive Logging**: Easy to debug issues
6. **Memory Safety**: Existing cleanup mechanisms preserved

## Architecture Improvements

### Before
- AuthContext: Set user only on mount ❌
- Profile Update: Backend updated, context stale ❌
- WebSocket: Read stale pincode ❌
- Page Refresh: Race condition ❌

### After
- AuthContext: Provides `refreshAuth()` method ✅
- Profile Update: Backend updated, context refreshed ✅
- WebSocket: Waits for auth ready, reads fresh pincode ✅
- Page Refresh: No race condition, proper loading state ✅

## Related Documentation

- [WEBSOCKET_PINCODE_FIX_COMPLETE.md](./WEBSOCKET_PINCODE_FIX_COMPLETE.md) - Pincode change detection
- [ORDER_ACCEPTANCE_IMPLEMENTATION.md](./ORDER_ACCEPTANCE_IMPLEMENTATION.md) - Order acceptance flow
- [NOTIFICATION_SYSTEM_README.md](./NOTIFICATION_SYSTEM_README.md) - Notification system

## Notes

- The `refreshAuth()` method fetches from API instead of decoding JWT because the JWT token may not be updated by backend after profile update
- The backend returns "Updated" string and then we fetch the updated profile, which has the new pincode
- This approach ensures we always have the latest data from the backend
- The `authLoading` state is crucial for preventing race conditions on page refresh
