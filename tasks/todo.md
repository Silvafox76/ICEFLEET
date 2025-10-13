# Input Validation and API Utilities - ICE FLEET

## Task Overview
Create Zod validation schemas and API helper utilities for input validation across all API routes.

## Plan

### Files to Create

- [ ] Create `app/lib/api/api-response.ts` - Standardized API response helpers
- [ ] Create `app/lib/validations/vehicle.validation.ts` - Vehicle validation schema
- [ ] Create `app/lib/validations/trailer.validation.ts` - Trailer validation schema
- [ ] Create `app/lib/validations/driver.validation.ts` - Driver validation schema
- [ ] Create `app/lib/validations/assignment.validation.ts` - Assignment validation schema
- [ ] Create `app/lib/validations/maintenance.validation.ts` - Maintenance record validation schema
- [ ] Create `app/lib/validations/compliance.validation.ts` - Compliance document validation schema

## Details

### API Response Helpers (api-response.ts)
- Create standardized success/error response functions
- Include validation error helper
- Keep simple with proper typing

### Validation Schemas
Each schema should:
- Use Zod for type-safe validation
- Follow existing database schema from types.ts
- Include both create and update variants (partial)
- Handle optional fields correctly
- Validate Canadian provinces
- Validate enums (status, type, etc.)
- Keep simple and focused

### Key Validations Required

**Vehicle Schema:**
- VIN: 17 characters exactly
- Make/Model: Required strings
- Year: Integer between 1990 and current year + 1
- License plate: Required
- Towing capacity: Optional positive integer
- Hitch class: Optional integer 1-5
- Has electric brake controller: Optional boolean
- Fuel type: Required string
- Province: Canadian province enum
- Odometer: Optional positive integer
- Status: Enum (ACTIVE, MAINTENANCE, OUT_OF_SERVICE, RETIRED)

**Trailer Schema:**
- Serial number: Required string
- Type: Enum (ENCLOSED, FLATBED, UTILITY, EQUIPMENT, SPECIALTY)
- Required towing capacity: Positive integer
- Required hitch class: Integer 1-5
- Has brakes: Boolean
- License plate: Optional string
- Province: Canadian province enum
- Status: Enum (ACTIVE, MAINTENANCE, OUT_OF_SERVICE, RETIRED)

**Driver Schema:**
- Employee ID: Required string
- First/Last name: Required strings
- Email: Valid email format
- Phone: Required string (Canadian format validation)
- License number: Required string
- License class: Required string
- License expiry: Future date
- Endorsements: Array of strings
- Province: Canadian province enum
- Status: Enum (ACTIVE, INACTIVE, ON_LEAVE, TERMINATED)

**Assignment Schema:**
- Job number: Required string
- Description: Required string
- Location: Required string
- Start date: Required date
- End date: Optional date (must be after start date)
- Lead driver ID: Required string
- Vehicle ID: Optional string
- Trailer ID: Optional string
- Priority: Enum (LOW, MEDIUM, HIGH, CRITICAL)
- Estimated hours: Optional positive number
- Status: Enum (SCHEDULED, IN_PROGRESS, COMPLETED, CANCELLED, ON_HOLD)

**Maintenance Record Schema:**
- Type: Enum (PREVENTIVE, CORRECTIVE, EMERGENCY, INSPECTION, RECALL)
- Description: Required string
- Scheduled date: Optional date
- Completed date: Optional date
- Odometer: Optional positive integer
- Cost: Optional positive decimal
- Vehicle ID or Trailer ID: At least one required
- Service provider: Optional string
- Work order number: Optional string
- Notes: Optional string
- Status: Enum (SCHEDULED, IN_PROGRESS, COMPLETED, CANCELLED, OVERDUE)

**Compliance Document Schema:**
- Type: Enum (INSURANCE, REGISTRATION, INSPECTION, COMMERCIAL_PERMIT, SPECIAL_PERMIT)
- Document number: Required string
- Issue date: Required date
- Expiry date: Required date (must be after issue date)
- Vehicle ID or Trailer ID: At least one required
- Notes: Optional string
- Cloud storage path: Optional string
- Status: Enum (VALID, EXPIRED, EXPIRING_SOON, SUSPENDED, CANCELLED)

## Implementation Approach
1. Create API response helpers first (foundation)
2. Create each validation schema file (one at a time)
3. Keep each file simple and focused
4. Export both create and update schemas from each file

## Review Section
(To be completed after implementation)
