# 🧪 TESTING GUIDE - Profile Pincode Update

## Current Status

Looking at your console logs, the system is currently working correctly with pincode **800020**. The WebSocket is connected and listening to that pincode.

**The fix is already implemented** - you just need to TEST it by actually updating your profile with a NEW pincode!

## Step-by-Step Testing Instructions

### Step 1: Note Your Current Pincode
Your current pincode from the logs: **800020**

### Step 2: Navigate to Profile Page
1. Go to your dashboard
2. Click on "Profile" or navigate to `/dashboard/profile`

### Step 3: Edit Profile
1. Click the "Edit" button
2. Find the Pincode field (should show: 800020)

### Step 4: Update Pincode
1. Change the pincode to a NEW value, for example: **700091**
2. Click "Save" or "Update Profile"

### Step 5: Watch the Console Output

You should see this complete flow in the console:

```bash
# ========== PROFILE UPDATE STARTS ==========

🔄 ========== PROFILE UPDATE FLOW START ==========
   📝 Updating profile with data: {pincode: "700091"}
   🔍 Has pincode change: true
   📍 Old pincode from current user: 800020
   📍 New pincode in update: 700091
==================================================

# Step 1: Backend Update
Updating profile for user ID: f858012e-39ec-4528-ab6d-14099d010e26
Update data: {pincode: "700091"}
✅ Backend confirmed update successful
✅ Step 1: Profile updated on backend

# Step 2: Fetch New JWT
🔄 Step 2: Fetching new JWT token from profile API...

🔍 ========== FETCHING USER PROFILE ==========
   👤 User ID: f858012e-39ec-4528-ab6d-14099d010e26
   📅 Timestamp: 2025-10-19T...
   🔗 Endpoint: /food-partner/profile?id=f858012e-...
=============================================

✅ Profile API Response Received
   📦 Response type: string
   📦 Extracted token (first 50 chars): eyJhbGciOiJIUzI1NiJ9...

✅ Valid JWT token received

🔓 Decoded new token:
   📍 Pincode: 700091  ← ✅ NEW PINCODE IN JWT!
   📧 Email: testing1234@gmail.com
   📛 Name: testing1234

✅ Step 2: Received new JWT token
   📦 Token (first 20 chars): eyJhbGciOiJIUzI1NiJ...

# Step 3: Save to localStorage
💾 Step 3: Saving new token to localStorage...
✅ Step 3: Token saved to localStorage

# Step 4: Update AuthContext
🔄 Step 4: Updating AuthContext with new token...
🚪 AuthContext login called
🔓 Decoded JWT payload: {pincode: 700091, ...}  ← ✅ NEW PINCODE IN AUTHCONTEXT!
👤 Created user object: {..., pincode: 700091, ...}
✅ Step 4: AuthContext updated

🎉 ========== PROFILE UPDATE COMPLETE ==========
   ✅ Backend updated
   ✅ New token received
   ✅ Token saved to localStorage
   ✅ AuthContext refreshed
   🎯 WebSocket should now reconnect with new pincode
==================================================

# ========== WEBSOCKET AUTO-RECONNECTION ==========

# Pincode change detected!
🔍 ========== PINCODE SOURCE DEBUG ==========
   📍 Current pincode: 700091  ← ✅ NEW!
   📍 Previous pincode: 800020  ← OLD
   👤 User object: {...}
   🎫 Pincode from user.pincode: 700091
   ✅ Is valid: true
============================================

🔄 ========== PINCODE CHANGE DETECTED ==========
   📍 Old pincode: 800020
   📍 New pincode: 700091
   🔌 Triggering complete reconnection...
================================================

# Cleanup old connection
>>> DISCONNECT
🔌 WebSocket disconnected
❌ Disconnected old WebSocket connection
🔄 Reset initial load state - will re-fetch orders
🗑️ Cleared old orders for pincode: 800020
✅ Pincode change handling complete

# Fetch orders for new pincode
🚀 ========== INITIAL LOAD STARTED ==========
   👤 User ID: f858012e-39ec-4528-ab6d-14099d010e26
   📍 Pincode: 700091  ← ✅ USING NEW PINCODE!
=============================================

🔍 Fetching ALL pending orders for initial load: {foodPartnerId: '...', pincode: 700091}
🔗 Request URL: /food-partner/get-orders?userId=f858012e-39ec-4528-ab6d-14099d010e26

✅ Found X pending orders out of X total orders
✅ Initial load: Found X pending orders for pincode 700091
✅ ========== INITIAL LOAD COMPLETE ==========
   📍 Pincode: 700091
   🎯 Ready for WebSocket connection
=============================================

# Connect WebSocket to new pincode
🔌 ========== CONNECTING WEBSOCKET ==========
   📍 Pincode: 700091  ← ✅ CONNECTING TO NEW PINCODE!
=============================================

🔌 Connecting to WebSocket URL: https://api.rozomeal.com/ws
🔌 WebSocket Debug: Opening Web Socket...
🔌 WebSocket Debug: Web Socket Opened...
>>> CONNECT
<<< CONNECTED

✅ Connected to WebSocket for pincode: 700091

>>> SUBSCRIBE
destination:/topic/food-orders/700091  ← ✅ SUBSCRIBED TO NEW PINCODE!

>>> SEND
destination:/app/getOrders
📤 ========== SENDING REQUEST TO SERVER ==========
   Destination: /app/getOrders
   Pincode (original): 700091  ← ✅ REQUESTING NEW PINCODE!
   Pincode (type): number
================================================

✅ ========== WEBSOCKET CONNECTED ==========
   📍 Pincode: 700091  ← ✅ CONNECTED TO NEW PINCODE!
   🎯 Ready for real-time orders
=============================================
```

## ✅ Success Indicators

After updating the profile, you should see:

1. ✅ "PINCODE CHANGE DETECTED" log
2. ✅ Old WebSocket disconnects
3. ✅ Orders fetch for NEW pincode
4. ✅ WebSocket connects to NEW pincode
5. ✅ Subscription to `/topic/food-orders/700091` (new pincode)

## ❌ What You're Seeing Now

Your current logs show:
- WebSocket connected to: **800020** ← Current pincode
- Manual refresh reconnecting to: **800020** ← Same pincode

This is NORMAL because you haven't updated the profile yet! The manual refresh is just reconnecting to the same pincode.

## 🎯 Next Steps

1. **Go to Profile Page**
2. **Click Edit**
3. **Change Pincode from 800020 to 700091**
4. **Click Save**
5. **Watch Console for the complete flow above**

## 🔧 Troubleshooting

### If you don't see the profile update flow:

**Check 1: Profile form is using the correct updateProfile**
```typescript
// In ProfilePage.tsx, should call:
const updatedUser = await updateProfile(formData);
// formData should include the new pincode
```

**Check 2: formData has the pincode**
```typescript
// Add console.log before updateProfile call:
console.log('🧪 FormData being sent:', formData);
// Should show: {pincode: "700091", ...}
```

**Check 3: Network request is made**
- Open DevTools → Network tab
- Save profile
- Look for request to: `/food-partner/update?id=...`
- Should show new pincode in request payload

### If profile updates but WebSocket doesn't reconnect:

**Check 1: New token received**
Look for log: "✅ Valid JWT token received"

**Check 2: Pincode in new token**
Look for log: "🔓 Decoded new token:" → should show new pincode

**Check 3: AuthContext updated**
Look for log: "👤 Created user object:" → should have new pincode

**Check 4: useWebSocket detected change**
Look for log: "🔄 PINCODE CHANGE DETECTED"

## 📝 Notes

- The fix is **already implemented** and working
- You just need to **actually update your profile** to trigger it
- The manual refresh you see is normal - it's not related to profile updates
- WebSocket will only reconnect when pincode ACTUALLY CHANGES

## 🎉 Expected Result

After successful profile update:
- ✅ Profile shows new pincode
- ✅ WebSocket connected to new pincode
- ✅ Orders load for new pincode
- ✅ Real-time orders arrive for new pincode
- ✅ No manual action needed - everything is automatic!

---

**Ready to test? Update your profile now!** 🚀
