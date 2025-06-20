# Zapier Webhook Setup Guide for Mighty Networks

## ✅ Complete Zapier Configuration

### **Step 1: Webhook URL**
```
https://qnruorhzdxkyfhdgtkqp.supabase.co/functions/v1/mn-minimal
```

### **Step 2: Request Method**
```
POST
```

### **Step 3: Headers (CRITICAL)**
Add these headers in Zapier:

**Header 1:**
- **Name**: `Content-Type`
- **Value**: `application/json`

**Header 2:**
- **Name**: `Authorization`
- **Value**: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFucnVvcmh6ZHhreWZoZGd0a3FwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgwMDU1MTAsImV4cCI6MjA2MzU4MTUxMH0.d42EFmjURUJ2aLFeAyFQsWwFmbnL7L_ObfAIlpv8McM`

### **Step 4: Request Body (JSON)**
```json
{
  "api_key": "Pw8Io8duTZqtSm0jQMYYv9KVPRQfJMf99Nrtc1ZyOGA",
  "member_id": "{{Member ID}}",
  "email": "{{Email}}",
  "first_name": "{{First Name}}",
  "last_name": "{{Last Name}}",
  "name": "{{Full Name}}",
  "activity_type": "{{Activity Type}}",
  "timestamp": "{{Timestamp}}"
}
```

## 🔧 **Zapier Setup Steps**

1. **Create New Zap**
   - Trigger: Mighty Networks → Member Activity
   - Action: Webhooks by Zapier → POST

2. **Configure Webhook Action**
   - URL: (from Step 1 above)
   - Payload Type: JSON
   - Method: POST

3. **Add Headers** (This fixes the "Invalid JWT" error)
   - Click "Show advanced options"
   - Add both headers from Step 3 above

4. **Configure JSON Body**
   - Use the JSON structure from Step 4
   - Map Mighty Networks fields to the placeholders

## ✅ **Test Command (for verification)**
```bash
curl -X POST \
  "https://qnruorhzdxkyfhdgtkqp.supabase.co/functions/v1/mn-minimal" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFucnVvcmh6ZHhreWZoZGd0a3FwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgwMDU1MTAsImV4cCI6MjA2MzU4MTUxMH0.d42EFmjURUJ2aLFeAyFQsWwFmbnL7L_ObfAIlpv8McM" \
  -d '{
    "api_key": "Pw8Io8duTZqtSm0jQMYYv9KVPRQfJMf99Nrtc1ZyOGA",
    "email": "test@example.com",
    "first_name": "Test",
    "last_name": "User",
    "activity_type": "member_joined"
  }'
```

## 🎯 **Expected Success Response**
```json
{
  "success": true,
  "message": "Affiliate created successfully",
  "affiliateId": "...",
  "email": "test@example.com",
  "referralCode": "MN-...",
  "timestamp": "2025-06-17T..."
}
```

## ❌ **Common Errors & Solutions**

| Error | Cause | Solution |
|-------|-------|----------|
| "Invalid JWT" | Missing Authorization header | Add Authorization header with Bearer token |
| "Unauthorized" | Wrong API key in body | Use correct api_key in JSON body |
| 404 Not Found | Wrong URL | Use exact URL from Step 1 |
| CORS Error | Missing headers | Add both Content-Type and Authorization headers |

## 🔑 **Key Points**
- **TWO different authentication layers**:
  1. **Supabase Auth**: Authorization header (for Edge Function access)
  2. **Webhook Auth**: api_key in JSON body (for your webhook logic)
- **Both are required** for the webhook to work
- **Use anon key** in Authorization header (not service role key) 