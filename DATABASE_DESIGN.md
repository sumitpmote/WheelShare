# WheelShare Database Design - Phase 2

## Enhanced Entity Relationship Model

### Core Entities

#### 1. ApplicationUser (Identity)
- **Id** (string, PK) - Identity User ID
- **FullName** (string) - User's full name
- **Role** (string) - Customer/Driver/Admin
- **Email** (string) - User email
- **PhoneNumber** (string) - User phone
- **OtpCode** (string?) - OTP for verification
- **OtpExpiry** (DateTime?) - OTP expiration
- **IsActive** (bool) - Account status
- **CreatedAt** (DateTime) - Account creation date

#### 2. DriverProfile
- **DriverId** (int, PK) - Primary key
- **UserId** (string, FK) - Reference to ApplicationUser
- **LicenseNumber** (string, Unique) - Driver license number
- **LicenseExpiry** (DateTime) - License expiration date
- **IsVerified** (bool) - Verification status
- **VerifiedAt** (DateTime?) - Verification date
- **Rating** (decimal) - Average driver rating
- **TotalRides** (int) - Total completed rides
- **IsAvailable** (bool) - Current availability
- **CreatedAt** (DateTime) - Profile creation date

#### 3. CustomerProfile
- **CustomerProfileId** (int, PK) - Primary key
- **UserId** (string, FK) - Reference to ApplicationUser
- **Preferences** (string) - Customer preferences
- **Rating** (decimal) - Average customer rating
- **TotalRides** (int) - Total rides taken
- **CreatedAt** (DateTime) - Profile creation date

#### 4. Vehicle
- **VehicleId** (int, PK) - Primary key
- **DriverId** (int, FK) - Reference to DriverProfile
- **VehicleNumber** (string, Unique) - Vehicle registration number
- **VehicleType** (string) - "Cab" or "Carpool"
- **Make** (string) - Vehicle manufacturer
- **Model** (string) - Vehicle model
- **Color** (string) - Vehicle color
- **SeatCapacity** (int) - Total seat capacity
- **IsActive** (bool) - Vehicle status
- **IsVerified** (bool) - Verification status
- **VerifiedAt** (DateTime?) - Verification date
- **CreatedAt** (DateTime) - Registration date

#### 5. Ride
- **RideId** (int, PK) - Primary key
- **VehicleId** (int, FK) - Reference to Vehicle
- **Source** (string) - Source location name
- **Destination** (string) - Destination location name
- **SourceLatitude** (double) - Source coordinates
- **SourceLongitude** (double) - Source coordinates
- **DestinationLatitude** (double) - Destination coordinates
- **DestinationLongitude** (double) - Destination coordinates
- **AvailableSeats** (int) - Currently available seats
- **TotalSeats** (int) - Total seats offered
- **FarePerSeat** (decimal) - Price per seat
- **RideDateTime** (DateTime) - Scheduled ride time
- **RideStatus** (string) - "Open", "InProgress", "Completed", "Cancelled"
- **EstimatedDistance** (decimal) - Distance in km
- **EstimatedDuration** (int) - Duration in minutes
- **Notes** (string?) - Additional ride notes
- **CreatedAt** (DateTime) - Ride creation date

#### 6. Booking
- **BookingId** (int, PK) - Primary key
- **RideId** (int, FK) - Reference to Ride
- **CustomerId** (string, FK) - Reference to ApplicationUser
- **SeatsBooked** (int) - Number of seats booked
- **TotalFare** (decimal) - Total booking amount
- **BookingStatus** (string) - "Pending", "Confirmed", "Cancelled", "Completed"
- **PickupLocation** (string) - Customer pickup location
- **PickupLatitude** (double) - Pickup coordinates
- **PickupLongitude** (double) - Pickup coordinates
- **DropLocation** (string) - Customer drop location
- **DropLatitude** (double) - Drop coordinates
- **DropLongitude** (double) - Drop coordinates
- **BookedAt** (DateTime) - Booking creation date
- **CancelledAt** (DateTime?) - Cancellation date
- **CancellationReason** (string?) - Reason for cancellation

#### 7. Payment
- **PaymentId** (int, PK) - Primary key
- **BookingId** (int, FK) - Reference to Booking
- **Amount** (decimal) - Payment amount
- **PaymentMode** (string) - "UPI", "Card", "Cash", "Mock"
- **PaymentStatus** (string) - "Success", "Failed", "Pending"
- **PaidAt** (DateTime) - Payment date

#### 8. Rating
- **RatingId** (int, PK) - Primary key
- **BookingId** (int, FK) - Reference to Booking
- **RideId** (int?, FK) - Reference to Ride
- **RatedByUserId** (string, FK) - User giving rating
- **RatedToUserId** (string, FK) - User receiving rating
- **DriverId** (int?, FK) - Driver being rated
- **RatingValue** (decimal) - Rating value (1-5)
- **Comment** (string?) - Rating comment
- **RatingType** (string) - "DriverRating", "CustomerRating"
- **CreatedAt** (DateTime) - Rating date

#### 9. Notification
- **NotificationId** (int, PK) - Primary key
- **UserId** (string, FK) - Reference to ApplicationUser
- **Title** (string) - Notification title
- **Message** (string) - Notification message
- **NotificationType** (string) - Type of notification
- **IsRead** (bool) - Read status
- **ReadAt** (DateTime?) - Read timestamp
- **RelatedEntityType** (string?) - Related entity type
- **RelatedEntityId** (int?) - Related entity ID
- **CreatedAt** (DateTime) - Notification date

#### 10. Location
- **LocationId** (int, PK) - Primary key
- **Name** (string) - Location name
- **Latitude** (double) - Location coordinates
- **Longitude** (double) - Location coordinates

## Relationships

### One-to-One Relationships
- **ApplicationUser ↔ DriverProfile** (UserId)
- **ApplicationUser ↔ CustomerProfile** (UserId)

### One-to-Many Relationships
- **DriverProfile → Vehicle** (DriverId)
- **Vehicle → Ride** (VehicleId)
- **Ride → Booking** (RideId)
- **ApplicationUser → Booking** (CustomerId)
- **Booking → Payment** (BookingId)
- **Booking → Rating** (BookingId)
- **Ride → Rating** (RideId)
- **DriverProfile → Rating** (DriverId)
- **ApplicationUser → Notification** (UserId)

## Database Indexes

### Performance Indexes
- **Booking**: CustomerId, RideId, BookingStatus
- **Ride**: VehicleId, RideStatus, RideDateTime
- **Vehicle**: DriverId
- **Rating**: BookingId, RatedToUserId
- **Notification**: UserId, IsRead

### Unique Indexes
- **Vehicle**: VehicleNumber
- **DriverProfile**: UserId, LicenseNumber
- **CustomerProfile**: UserId

## Business Rules

### Booking Rules
1. Cannot book more seats than available
2. Cannot book past rides
3. Customer cannot book their own ride
4. Booking status flow: Pending → Confirmed → Completed/Cancelled

### Ride Rules
1. Available seats cannot exceed total seats
2. Ride status flow: Open → InProgress → Completed/Cancelled
3. Only verified drivers can create rides

### Rating Rules
1. Can only rate after ride completion
2. Rating value must be between 1-5
3. One rating per booking per user

### Payment Rules
1. Payment required for booking confirmation
2. Refund processing for cancelled bookings

## Data Integrity Constraints

### Foreign Key Constraints
- Cascade delete for dependent entities
- Restrict delete for user references to prevent data loss

### Check Constraints
- Rating values between 1-5
- Seat counts must be positive
- Fare amounts must be positive
- Valid status values for enums

## Security Considerations

### Data Protection
- Sensitive data encryption at rest
- PII data anonymization for deleted users
- Audit trail for critical operations

### Access Control
- Role-based data access
- User can only access their own data
- Admin oversight capabilities

## Scalability Features

### Indexing Strategy
- Composite indexes for common query patterns
- Covering indexes for read-heavy operations

### Partitioning Strategy
- Date-based partitioning for historical data
- Geographic partitioning for location-based queries

## Migration Strategy

### Phase 2 Implementation
1. Apply enhanced entity models
2. Create new database migration
3. Update existing data to new schema
4. Implement new relationships
5. Add performance indexes
6. Test data integrity

### Rollback Plan
- Backup current database
- Maintain backward compatibility
- Gradual feature rollout