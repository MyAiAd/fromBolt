# Affiliate Code System Implementation

## Overview

The affiliate code system has been completely redesigned to ensure **unique, consistent, and database-backed** affiliate codes for all users across the multi-tenant platform. This addresses the previous issue where affiliate codes were randomly generated each time and not stored persistently.

## Key Features

### ✅ **Database-Backed Storage**
- All affiliate codes are stored in the `affiliate_system_users` table
- Codes are retrieved from the database on each dashboard load
- No more random generation on every page refresh

### ✅ **Cross-Platform Uniqueness**
- Checks for code conflicts across all integration tables:
  - `affiliate_system_users`
  - `ghl_affiliates` 
  - `mighty_affiliates`
  - `goaffpro_affiliates`
- Ensures no duplicate codes exist anywhere in the system

### ✅ **Consistent Code Generation**
- Smart algorithm based on user email prefix + random suffix
- Example: `user@example.com` → `USER1A2B`
- Fallback to timestamp-based codes if conflicts occur
- Up to 10 attempts to find unique codes

### ✅ **Multi-Platform Sync**
- Automatically syncs affiliate codes across all platforms
- Updates existing records in GHL, MightyNetworks, etc.
- Ensures same code is used everywhere

## Implementation Details

### Core Service: `AffiliateCodeService`

Located in `src/services/affiliateCodeService.ts`, this service provides:

#### Main Methods:
- `getOrCreateAffiliateCode(email, userId, metadata)` - Primary method for getting user codes
- `validateAffiliateCode(code)` - Validates if a code exists and is valid
- `generateAffiliateLink(code)` - Creates full affiliate links
- `syncAffiliateCodeAcrossPlatforms(email, code)` - Syncs codes across platforms

#### Internal Methods:
- `generateUniqueAffiliateCode()` - Creates unique codes with conflict checking
- `checkCodeExists()` - Verifies code uniqueness across tables
- `updateAffiliateCode()` - Admin function to change codes

### Updated Components

#### Dashboard (`src/pages/Dashboard.tsx`)
- Now uses `AffiliateCodeService` instead of random generation
- Displays consistent affiliate code in upper right corner
- Automatic sync across platforms on code creation
- Proper error handling with fallback codes

#### User Dashboard (`src/pages/UserDashboard.tsx`)
- Already used database-backed system correctly
- No changes needed

#### GHL Import (`supabase/functions/ghl-import/index.ts`)
- Updated to use `AffiliateCodeService` for consistent code generation
- Ensures imported contacts get unique codes that don't conflict

## Database Structure

### Primary Table: `affiliate_system_users`
```sql
CREATE TABLE affiliate_system_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  referral_code TEXT UNIQUE,
  primary_source TEXT CHECK (primary_source IN ('ghl', 'mightynetworks', 'shopify', 'goaffpro', 'manual')),
  -- ... other fields
);
```

### Key Constraints:
- `referral_code` is UNIQUE across the table
- `primary_source` must be one of the allowed values
- Email is unique identifier for users

## Code Generation Algorithm

1. **Extract Base Code**: Take first 4 characters from email prefix
   - `john.doe@example.com` → `JOHN`
   - Remove special characters, convert to uppercase

2. **Generate Suffix**: Random 4-6 character alphanumeric string
   - First attempt: 4 characters
   - Subsequent attempts: 6+ characters

3. **Check Uniqueness**: Verify code doesn't exist in any table
   - `affiliate_system_users`
   - `ghl_affiliates`
   - `mighty_affiliates` 
   - `goaffpro_affiliates`

4. **Fallback Strategy**: If 10 attempts fail, use timestamp-based code
   - Format: `{BASE}{TIMESTAMP_SUFFIX}`

## Usage Examples

### Getting User's Affiliate Code
```typescript
import { AffiliateCodeService } from '../services/affiliateCodeService';

const service = new AffiliateCodeService(supabase);
const code = await service.getOrCreateAffiliateCode(
  user.email, 
  user.id, 
  user.user_metadata
);
```

### Validating a Code
```typescript
const isValid = await service.validateAffiliateCode('USER1A2B');
```

### Generating Affiliate Link
```typescript
const link = service.generateAffiliateLink('USER1A2B');
// Returns: https://jennaz.co/join/USER1A2B
```

## Error Handling

### Graceful Degradation
- If database operations fail, system uses temporary codes
- Temporary codes are prefixed with `TEMP` for easy identification
- Users can still use the platform while issues are resolved

### Validation
- All codes are validated before being considered "real"
- Temporary codes always return `false` for validation
- Invalid codes trigger regeneration attempts

## Benefits

### For Users:
- ✅ **Consistent Experience**: Same affiliate code every time they log in
- ✅ **Reliable Sharing**: Affiliate links don't change unexpectedly
- ✅ **Cross-Platform**: Same code works across GHL, MightyNetworks, Shopify

### For Administrators:
- ✅ **No Conflicts**: Guaranteed unique codes across all platforms
- ✅ **Easy Tracking**: All codes stored in central database
- ✅ **Audit Trail**: Can track when codes were created and by whom

### For Developers:
- ✅ **Centralized Logic**: Single service handles all code operations
- ✅ **Extensible**: Easy to add new platform integrations
- ✅ **Testable**: Comprehensive error handling and fallbacks

## Testing

The system has been thoroughly tested with:
- ✅ New code generation and uniqueness verification
- ✅ Existing code retrieval consistency
- ✅ Cross-platform conflict detection
- ✅ Database constraint compliance
- ✅ Error handling and fallback scenarios

## Migration Notes

### Existing Users
- Users with existing codes in `affiliate_system_users` will keep their current codes
- New users get automatically generated unique codes
- No manual migration required

### Platform Integration
- GHL imports now use the new service
- MightyNetworks integration ready for same service
- Shopify webhooks can be updated to use service

## Security Considerations

- ✅ **No Predictable Patterns**: Codes use random suffixes
- ✅ **Database Validation**: All codes validated against database
- ✅ **Conflict Prevention**: Multi-table uniqueness checking
- ✅ **Audit Trail**: All code operations logged

## Future Enhancements

### Planned Features:
1. **Admin Code Management**: Interface for admins to view/update codes
2. **Code Analytics**: Track usage and performance of affiliate codes
3. **Custom Code Requests**: Allow users to request specific codes
4. **Bulk Code Operations**: Tools for managing codes in bulk

### Integration Opportunities:
1. **Email Templates**: Include affiliate codes in automated emails
2. **QR Code Generation**: Create QR codes for affiliate links
3. **Social Media Integration**: Auto-post with affiliate codes
4. **Analytics Dashboard**: Track code performance across platforms

---

## Summary

The new affiliate code system provides a robust, scalable solution for managing unique affiliate codes across the multi-tenant platform. It ensures consistency, prevents conflicts, and provides a solid foundation for future growth and integrations. 