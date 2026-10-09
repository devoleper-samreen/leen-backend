const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const uuid = () => crypto.randomUUID();

// ---- DSL helpers ----
function field(name, type, opts = {}) {
  const f = { id: uuid(), PK: !!opts.pk, name, type };
  if (opts.array) f.isArray = true;
  if (opts.nn) f.isNN = true;
  if (opts.children) f.children = opts.children;
  return f;
}
const pkId = () => field('_id', 'objectId', { pk: true, nn: true });

// ---- Service definitions ----
// Each service: { key, label, tables: [ { name, fields: [...] } ] }
// FK markers are plain field defs; relations are declared separately below
// referencing `${service}.${table}.${fieldName}`.

const services = [
  {
    key: 'auth',
    label: 'auth-service (leen_auth)',
    tables: [
      {
        name: 'User',
        fields: [
          pkId(),
          field('phone', 'string', { nn: true }),
          field('email', 'string'),
          field('passwordHash', 'string', { nn: true }),
          field('role', 'enum', { nn: true }),
          field('status', 'enum', { nn: true }),
          field('language', 'enum', { nn: true }),
        ],
      },
      {
        name: 'CustomerProfile',
        fields: [
          pkId(),
          field('userId', 'objectId', { nn: true }),
          field('fullName', 'string', { nn: true }),
          field('addresses', 'object', {
            array: true,
            children: [
              field('label', 'string', { nn: true }),
              field('lat', 'double', { nn: true }),
              field('lng', 'double', { nn: true }),
              field('formatted', 'string', { nn: true }),
              field('isPrimary', 'bool'),
            ],
          }),
        ],
      },
      {
        name: 'PartnerProfile',
        fields: [
          pkId(),
          field('userId', 'objectId', { nn: true }),
          field('fullName', 'string', { nn: true }),
          field('photoUrl', 'string'),
          field('dob', 'date'),
          field('idNumber', 'string', { nn: true }),
          field('companyRegistrationNumber', 'string', { nn: true }),
          field('commissionRatePct', 'double', { nn: true }),
          field('slaAgreementSignedAt', 'date'),
          field('categories', 'objectId', { array: true }),
          field('coverageRadiusKm', 'double'),
          field('coverageZones', 'string', { array: true }),
          field('approvalStatus', 'enum', { nn: true }),
          field('rejectionReason', 'string'),
        ],
      },
      {
        name: 'StaffProfile',
        fields: [
          pkId(),
          field('userId', 'objectId', { nn: true }),
          field('partnerId', 'objectId', { nn: true }),
          field('fullName', 'string', { nn: true }),
          field('probationEndsAt', 'date'),
          field('isOnProbation', 'bool'),
        ],
      },
      {
        name: 'AdminProfile',
        fields: [
          pkId(),
          field('userId', 'objectId', { nn: true }),
          field('fullName', 'string', { nn: true }),
          field('roleId', 'objectId'),
          field('isSuperAdmin', 'bool'),
        ],
      },
      {
        name: 'Role',
        fields: [
          pkId(),
          field('name', 'string', { nn: true }),
          field('permissions', 'object', {
            array: true,
            children: [
              field('module', 'enum', { nn: true }),
              field('accessLevel', 'enum', { nn: true }),
            ],
          }),
        ],
      },
      {
        name: 'OtpCode',
        fields: [
          pkId(),
          field('phone', 'string', { nn: true }),
          field('code', 'string', { nn: true }),
          field('purpose', 'enum', { nn: true }),
          field('expiresAt', 'date', { nn: true }),
          field('consumedAt', 'date'),
        ],
      },
      {
        name: 'RefreshToken',
        fields: [
          pkId(),
          field('userId', 'objectId', { nn: true }),
          field('tokenHash', 'string', { nn: true }),
          field('expiresAt', 'date', { nn: true }),
          field('revokedAt', 'date'),
        ],
      },
      {
        name: 'PartnerService',
        fields: [
          pkId(),
          field('partnerId', 'objectId', { nn: true }),
          field('categoryId', 'objectId', { nn: true }),
          field('subCategoryId', 'objectId', { nn: true }),
          field('serviceId', 'objectId', { nn: true }),
          field('status', 'enum', { nn: true }),
          field('coverageCityIds', 'objectId', { array: true }),
          field('coverageRadiusKm', 'double'),
          field('requiresReapproval', 'bool', { nn: true }),
          field('addedAt', 'date', { nn: true }),
          field('removedAt', 'date'),
        ],
      },
      {
        name: 'PartnerServiceApprovalHistory',
        fields: [
          pkId(),
          field('partnerServiceId', 'objectId', { nn: true }),
          field('partnerId', 'objectId', { nn: true }),
          field('action', 'enum', { nn: true }),
          field('reviewedBy', 'objectId'),
          field('reviewedAt', 'date'),
          field('reason', 'string'),
          field('previousStatus', 'enum'),
          field('newStatus', 'enum', { nn: true }),
        ],
      },
      {
        name: 'PartnerAvailability',
        fields: [
          pkId(),
          field('partnerId', 'objectId', { nn: true }),
          field('workingDays', 'int', { array: true }),
          field('workingHours', 'object', {
            nn: true,
            children: [field('start', 'string', { nn: true }), field('end', 'string', { nn: true })],
          }),
          field('timezone', 'string', { nn: true }),
          field('status', 'enum', { nn: true }),
          field('effectiveFrom', 'date', { nn: true }),
          field('effectiveTo', 'date'),
          field('breaks', 'object', {
            array: true,
            children: [
              field('startTime', 'string', { nn: true }),
              field('endTime', 'string', { nn: true }),
              field('reason', 'string'),
            ],
          }),
        ],
      },
      {
        name: 'PartnerApprovalHistory',
        fields: [
          pkId(),
          field('partnerId', 'objectId', { nn: true }),
          field('action', 'enum', { nn: true }),
          field('reviewedBy', 'objectId'),
          field('reviewedAt', 'date'),
          field('reason', 'string'),
          field('resubmissionCount', 'int', { nn: true }),
          field('triggeredBy', 'enum', { nn: true }),
        ],
      },
      {
        name: 'AccountSuspension',
        fields: [
          pkId(),
          field('userId', 'objectId', { nn: true }),
          field('role', 'enum', { nn: true }),
          field('reason', 'string', { nn: true }),
          field('durationDays', 'int'),
          field('startsAt', 'date', { nn: true }),
          field('expiresAt', 'date'),
          field('suspendedBy', 'objectId', { nn: true }),
          field('status', 'enum', { nn: true }),
          field('liftedAt', 'date'),
          field('liftedBy', 'objectId'),
          field('note', 'string'),
        ],
      },
      {
        name: 'FraudRecord',
        fields: [
          pkId(),
          field('userId', 'objectId', { nn: true }),
          field('role', 'enum', { nn: true }),
          field('reason', 'string', { nn: true }),
          field('reportedBy', 'objectId', { nn: true }),
          field('reportedAt', 'date', { nn: true }),
          field('status', 'enum', { nn: true }),
          field('evidence', 'string', { array: true }),
          field('clearedAt', 'date'),
          field('clearedBy', 'objectId'),
        ],
      },
      {
        name: 'DataDeletionRequest',
        fields: [
          pkId(),
          field('userId', 'objectId', { nn: true }),
          field('role', 'enum', { nn: true }),
          field('requestedAt', 'date', { nn: true }),
          field('requestedBy', 'objectId', { nn: true }),
          field('status', 'enum', { nn: true }),
          field('completedAt', 'date'),
          field('reason', 'string'),
          field('note', 'string'),
        ],
      },
    ],
    relations: [
      ['User._id', 'CustomerProfile.userId', '1:1'],
      ['User._id', 'PartnerProfile.userId', '1:1'],
      ['User._id', 'StaffProfile.userId', '1:1'],
      ['User._id', 'StaffProfile.partnerId', '1:M'],
      ['User._id', 'AdminProfile.userId', '1:1'],
      ['Role._id', 'AdminProfile.roleId', '1:M'],
      ['User._id', 'RefreshToken.userId', '1:M'],
      ['PartnerProfile._id', 'PartnerService.partnerId', '1:M'],
      ['PartnerService._id', 'PartnerServiceApprovalHistory.partnerServiceId', '1:M'],
      ['PartnerProfile._id', 'PartnerAvailability.partnerId', '1:1'],
      ['PartnerProfile._id', 'PartnerApprovalHistory.partnerId', '1:M'],
      ['User._id', 'AccountSuspension.userId', '1:M'],
      ['User._id', 'FraudRecord.userId', '1:M'],
      ['User._id', 'DataDeletionRequest.userId', '1:M'],
    ],
  },
  {
    key: 'catalog',
    label: 'catalog-service (leen_catalog)',
    tables: [
      {
        name: 'City',
        fields: [
          pkId(),
          field('name', 'object', {
            nn: true,
            children: [field('en', 'string', { nn: true }), field('ar', 'string', { nn: true })],
          }),
          field('status', 'enum', { nn: true }),
        ],
      },
      {
        name: 'Category',
        fields: [
          pkId(),
          field('name', 'object', {
            nn: true,
            children: [field('en', 'string', { nn: true }), field('ar', 'string', { nn: true })],
          }),
          field('icon', 'string'),
          field('status', 'enum', { nn: true }),
        ],
      },
      {
        name: 'SubCategory',
        fields: [
          pkId(),
          field('name', 'object', {
            nn: true,
            children: [field('en', 'string', { nn: true }), field('ar', 'string', { nn: true })],
          }),
          field('icon', 'string'),
          field('parentCategoryId', 'objectId', { nn: true }),
          field('coverageCityIds', 'objectId', { array: true }),
          field('status', 'enum', { nn: true }),
        ],
      },
      {
        name: 'Service',
        fields: [
          pkId(),
          field('subCategoryId', 'objectId', { nn: true }),
          field('name', 'object', {
            nn: true,
            children: [field('en', 'string', { nn: true }), field('ar', 'string', { nn: true })],
          }),
          field('tier', 'string'),
          field('description', 'object', {
            children: [field('en', 'string', { nn: true }), field('ar', 'string', { nn: true })],
          }),
          field('status', 'enum', { nn: true }),
        ],
      },
      {
        name: 'PricingTier',
        fields: [
          pkId(),
          field('categoryId', 'objectId', { nn: true }),
          field('tierName', 'string', { nn: true }),
          field('basePriceOmr', 'double', { nn: true }),
          field('surgeWindows', 'object', {
            array: true,
            children: [
              field('adjustmentPct', 'double', { nn: true }),
              field('startDate', 'date', { nn: true }),
              field('endDate', 'date', { nn: true }),
              field('startHour', 'int', { nn: true }),
              field('endHour', 'int', { nn: true }),
            ],
          }),
        ],
      },
      {
        name: 'JobTemplate',
        fields: [
          pkId(),
          field('categoryId', 'objectId', { nn: true }),
          field('subCategoryId', 'objectId', { nn: true }),
          field('fields', 'object', {
            array: true,
            children: [
              field('key', 'string', { nn: true }),
              field('label', 'string', { nn: true }),
              field('type', 'enum', { nn: true }),
              field('value', 'string'),
            ],
          }),
          field('status', 'enum', { nn: true }),
        ],
      },
      {
        name: 'PromoCode',
        fields: [
          pkId(),
          field('code', 'string', { nn: true }),
          field('categoryIds', 'objectId', { array: true }),
          field('subCategoryIds', 'objectId', { array: true }),
          field('discountPct', 'double', { nn: true }),
          field('expiresAt', 'date', { nn: true }),
          field('maxUses', 'int', { nn: true }),
          field('usedCount', 'int', { nn: true }),
          field('leenAbsorbs', 'bool'),
          field('status', 'enum', { nn: true }),
        ],
      },
      {
        name: 'PromoRedemption',
        fields: [
          pkId(),
          field('promoCodeId', 'objectId', { nn: true }),
          field('customerId', 'objectId', { nn: true }),
          field('bookingId', 'objectId', { nn: true }),
          field('discountAmount', 'double', { nn: true }),
          field('redeemedAt', 'date', { nn: true }),
          field('status', 'enum', { nn: true }),
          field('reversedAt', 'date'),
          field('reversalReason', 'string'),
        ],
      },
      {
        name: 'CommissionRule',
        fields: [
          pkId(),
          field('categoryId', 'objectId'),
          field('cityId', 'objectId'),
          field('ratePct', 'double', { nn: true }),
          field('effectiveFrom', 'date', { nn: true }),
          field('effectiveTo', 'date'),
          field('version', 'int', { nn: true }),
          field('status', 'enum', { nn: true }),
        ],
      },
      {
        name: 'TaxRule',
        fields: [
          pkId(),
          field('categoryId', 'objectId'),
          field('cityId', 'objectId'),
          field('ratePct', 'double', { nn: true }),
          field('effectiveFrom', 'date', { nn: true }),
          field('effectiveTo', 'date'),
          field('version', 'int', { nn: true }),
          field('status', 'enum', { nn: true }),
        ],
      },
      {
        name: 'CancellationPolicy',
        fields: [
          pkId(),
          field('categoryId', 'objectId'),
          field('cityId', 'objectId'),
          field('freeWindowMinutes', 'int', { nn: true }),
          field('feeType', 'enum', { nn: true }),
          field('feeValue', 'double', { nn: true }),
          field('effectiveFrom', 'date', { nn: true }),
          field('effectiveTo', 'date'),
          field('version', 'int', { nn: true }),
        ],
      },
    ],
    relations: [
      ['Category._id', 'SubCategory.parentCategoryId', '1:M'],
      ['SubCategory._id', 'Service.subCategoryId', '1:M'],
      ['Category._id', 'PricingTier.categoryId', '1:M'],
      ['Category._id', 'JobTemplate.categoryId', '1:M'],
      ['SubCategory._id', 'JobTemplate.subCategoryId', '1:M'],
      ['PromoCode._id', 'PromoRedemption.promoCodeId', '1:M'],
      ['Category._id', 'CommissionRule.categoryId', '1:M'],
      ['Category._id', 'TaxRule.categoryId', '1:M'],
      ['Category._id', 'CancellationPolicy.categoryId', '1:M'],
      ['City._id', 'CancellationPolicy.cityId', '1:M'],
    ],
  },
  {
    key: 'booking',
    label: 'booking-service (leen_booking)',
    tables: [
      {
        name: 'Booking',
        fields: [
          pkId(),
          field('customerId', 'objectId', { nn: true }),
          field('partnerId', 'objectId'),
          field('staffId', 'objectId'),
          field('serviceId', 'objectId', { nn: true }),
          field('cityId', 'objectId', { nn: true }),
          field('type', 'enum', { nn: true }),
          field('status', 'enum', { nn: true }),
          field('scheduledFor', 'date'),
          field('address', 'object', {
            nn: true,
            children: [
              field('formatted', 'string', { nn: true }),
              field('lat', 'double', { nn: true }),
              field('lng', 'double', { nn: true }),
            ],
          }),
          field('notes', 'string'),
          field('toolsNeeded', 'string', { array: true }),
          field('priceBreakdown', 'object', {
            nn: true,
            children: [
              field('subtotal', 'double', { nn: true }),
              field('tax', 'double', { nn: true }),
              field('discount', 'double', { nn: true }),
              field('total', 'double', { nn: true }),
              field('currency', 'string', { nn: true }),
            ],
          }),
          field('paymentMethod', 'string'),
          field('otp', 'object', {
            children: [field('start', 'string'), field('restart', 'string'), field('end', 'string')],
          }),
          field('photos', 'object', {
            children: [field('before', 'string'), field('after', 'string')],
          }),
          field('cancellation', 'object', {
            children: [
              field('reason', 'string'),
              field('fee', 'double'),
              field('cancelledAt', 'date'),
              field('cancelledByRole', 'enum'),
            ],
          }),
          field('tipAmount', 'double'),
          field('extraHours', 'double'),
          field('appliedRules', 'object', {
            nn: true,
            children: [
              field('commissionRatePct', 'double', { nn: true }),
              field('taxRatePct', 'double', { nn: true }),
              field('cancellationPolicyId', 'objectId'),
              field('cancellationPolicyVersion', 'int'),
            ],
          }),
          field('promoRedemptionId', 'objectId'),
          field('winningOfferId', 'objectId'),
        ],
      },
      {
        name: 'JobEvent',
        fields: [
          pkId(),
          field('bookingId', 'objectId', { nn: true }),
          field('eventType', 'enum', { nn: true }),
          field('actorRole', 'enum', { nn: true }),
          field('actorId', 'objectId'),
          field('occurredAt', 'date', { nn: true }),
          field('payload', 'object'),
        ],
      },
      {
        name: 'Review',
        fields: [
          pkId(),
          field('bookingId', 'objectId', { nn: true }),
          field('raterRole', 'enum', { nn: true }),
          field('rateeId', 'objectId', { nn: true }),
          field('stars', 'int', { nn: true }),
          field('tags', 'string', { array: true }),
          field('text', 'string'),
        ],
      },
      {
        name: 'JobOffer',
        fields: [
          pkId(),
          field('bookingId', 'objectId', { nn: true }),
          field('partnerId', 'objectId', { nn: true }),
          field('sentAt', 'date', { nn: true }),
          field('expiresAt', 'date', { nn: true }),
          field('response', 'enum', { nn: true }),
          field('respondedAt', 'date'),
          field('distanceKm', 'double'),
          field('estimatedEarning', 'double'),
          field('rank', 'int'),
          field('rejectionReason', 'string'),
        ],
      },
      {
        name: 'JobAssignment',
        fields: [
          pkId(),
          field('bookingId', 'objectId', { nn: true }),
          field('staffId', 'objectId', { nn: true }),
          field('partnerId', 'objectId', { nn: true }),
          field('assignedBy', 'objectId', { nn: true }),
          field('assignedAt', 'date', { nn: true }),
          field('status', 'enum', { nn: true }),
          field('unassignedAt', 'date'),
          field('reason', 'string'),
        ],
      },
      {
        name: 'JobPauseCycle',
        fields: [
          pkId(),
          field('bookingId', 'objectId', { nn: true }),
          field('pausedAt', 'date', { nn: true }),
          field('resumedAt', 'date'),
          field('durationSeconds', 'int'),
          field('restartOtpVerified', 'bool', { nn: true }),
          field('reason', 'string'),
        ],
      },
      {
        name: 'JobLocationPing',
        fields: [
          pkId(),
          field('bookingId', 'objectId', { nn: true }),
          field('staffId', 'objectId', { nn: true }),
          field('lat', 'double', { nn: true }),
          field('lng', 'double', { nn: true }),
          field('accuracy', 'double'),
          field('speed', 'double'),
          field('heading', 'double'),
          field('recordedAt', 'date', { nn: true }),
        ],
      },
    ],
    relations: [
      ['Booking._id', 'JobEvent.bookingId', '1:M'],
      ['Booking._id', 'Review.bookingId', '1:M'],
      ['Booking._id', 'JobOffer.bookingId', '1:M'],
      ['Booking._id', 'JobAssignment.bookingId', '1:M'],
      ['Booking._id', 'JobPauseCycle.bookingId', '1:M'],
      ['Booking._id', 'JobLocationPing.bookingId', '1:M'],
      ['JobOffer._id', 'Booking.winningOfferId', '1:1'],
    ],
  },
  {
    key: 'payment',
    label: 'payment-service (leen_payment)',
    tables: [
      {
        name: 'Payment',
        fields: [
          pkId(),
          field('bookingId', 'objectId', { nn: true }),
          field('customerId', 'objectId', { nn: true }),
          field('amount', 'double', { nn: true }),
          field('currency', 'string', { nn: true }),
          field('status', 'enum', { nn: true }),
          field('idempotencyKey', 'string', { nn: true }),
        ],
      },
      {
        name: 'Wallet',
        fields: [
          pkId(),
          field('ownerId', 'objectId', { nn: true }),
          field('ownerRole', 'enum', { nn: true }),
          field('balance', 'double', { nn: true }),
          field('currency', 'string', { nn: true }),
          field('bankAccount', 'object', {
            children: [
              field('accountHolder', 'string'),
              field('iban', 'string'),
              field('bankName', 'string'),
            ],
          }),
        ],
      },
      {
        name: 'PayoutRequest',
        fields: [
          pkId(),
          field('partnerId', 'objectId', { nn: true }),
          field('amount', 'double', { nn: true }),
          field('periodStart', 'date', { nn: true }),
          field('periodEnd', 'date', { nn: true }),
          field('status', 'enum', { nn: true }),
          field('provider', 'string'),
          field('txnId', 'string'),
          field('heldForDispute', 'bool'),
        ],
      },
      {
        name: 'Refund',
        fields: [
          pkId(),
          field('bookingId', 'objectId', { nn: true }),
          field('paymentId', 'objectId', { nn: true }),
          field('customerId', 'objectId', { nn: true }),
          field('requestedAmount', 'double', { nn: true }),
          field('refundedAmount', 'double'),
          field('reason', 'enum', { nn: true }),
          field('status', 'enum', { nn: true }),
          field('disputeId', 'objectId'),
          field('txnId', 'string'),
          field('penaltyOnPartnerAmount', 'double'),
        ],
      },
      {
        name: 'CommissionLedgerEntry',
        fields: [
          pkId(),
          field('bookingId', 'objectId', { nn: true }),
          field('partnerId', 'objectId', { nn: true }),
          field('jobAmount', 'double', { nn: true }),
          field('commissionRatePct', 'double', { nn: true }),
          field('commissionAmount', 'double', { nn: true }),
        ],
      },
      {
        name: 'WalletTransaction',
        fields: [
          pkId(),
          field('walletId', 'objectId', { nn: true }),
          field('ownerId', 'objectId', { nn: true }),
          field('direction', 'enum', { nn: true }),
          field('amount', 'double', { nn: true }),
          field('type', 'enum', { nn: true }),
          field('referenceType', 'enum'),
          field('referenceId', 'objectId'),
          field('status', 'enum', { nn: true }),
          field('balanceBefore', 'double', { nn: true }),
          field('balanceAfter', 'double', { nn: true }),
        ],
      },
      {
        name: 'PayoutAttempt',
        fields: [
          pkId(),
          field('payoutRequestId', 'objectId', { nn: true }),
          field('attemptNumber', 'int', { nn: true }),
          field('provider', 'string', { nn: true }),
          field('providerReference', 'string'),
          field('status', 'enum', { nn: true }),
          field('failureReason', 'string'),
          field('attemptedAt', 'date', { nn: true }),
        ],
      },
      {
        name: 'PaymentAttempt',
        fields: [
          pkId(),
          field('paymentId', 'objectId', { nn: true }),
          field('provider', 'string', { nn: true }),
          field('method', 'enum', { nn: true }),
          field('status', 'enum', { nn: true }),
          field('providerReference', 'string'),
          field('failureCode', 'string'),
          field('failureMessage', 'string'),
          field('attemptedAt', 'date', { nn: true }),
        ],
      },
      {
        name: 'RefundAttempt',
        fields: [
          pkId(),
          field('refundId', 'objectId', { nn: true }),
          field('attemptNumber', 'int', { nn: true }),
          field('status', 'enum', { nn: true }),
          field('providerReference', 'string'),
          field('failureReason', 'string'),
          field('attemptedAt', 'date', { nn: true }),
        ],
      },
    ],
    relations: [
      ['Wallet._id', 'WalletTransaction.walletId', '1:M'],
      ['PayoutRequest._id', 'PayoutAttempt.payoutRequestId', '1:M'],
      ['Payment._id', 'PaymentAttempt.paymentId', '1:M'],
      ['Payment._id', 'Refund.paymentId', '1:M'],
      ['Refund._id', 'RefundAttempt.refundId', '1:M'],
    ],
  },
  {
    key: 'chat',
    label: 'chat-service (leen_chat)',
    tables: [
      {
        name: 'Conversation',
        fields: [
          pkId(),
          field('bookingId', 'objectId', { nn: true }),
          field('customerId', 'objectId', { nn: true }),
          field('staffId', 'objectId', { nn: true }),
          field('lastMessageAt', 'date'),
          field('status', 'enum', { nn: true }),
          field('closedAt', 'date'),
        ],
      },
      {
        name: 'Message',
        fields: [
          pkId(),
          field('conversationId', 'objectId', { nn: true }),
          field('senderRole', 'enum', { nn: true }),
          field('templateId', 'objectId', { nn: true }),
          field('sentAt', 'date', { nn: true }),
          field('readAt', 'date'),
        ],
      },
      {
        name: 'PredefinedMessageTemplate',
        fields: [
          pkId(),
          field('text', 'object', {
            nn: true,
            children: [field('en', 'string', { nn: true }), field('ar', 'string', { nn: true })],
          }),
          field('roleScope', 'enum', { nn: true }),
        ],
      },
    ],
    relations: [
      ['Conversation._id', 'Message.conversationId', '1:M'],
      ['PredefinedMessageTemplate._id', 'Message.templateId', '1:M'],
    ],
  },
  {
    key: 'support',
    label: 'support-dispute-service (leen_support)',
    tables: [
      {
        name: 'SupportTicket',
        fields: [
          pkId(),
          field('raisedByRole', 'enum', { nn: true }),
          field('userId', 'objectId', { nn: true }),
          field('category', 'enum', { nn: true }),
          field('details', 'string', { nn: true }),
          field('attachments', 'string', { array: true }),
          field('status', 'enum', { nn: true }),
          field('resolutionNote', 'string'),
        ],
      },
      {
        name: 'Dispute',
        fields: [
          pkId(),
          field('bookingId', 'objectId', { nn: true }),
          field('raisedByRole', 'enum', { nn: true }),
          field('raisedById', 'objectId', { nn: true }),
          field('category', 'enum', { nn: true }),
          field('evidence', 'object', {
            array: true,
            children: [
              field('submittedByRole', 'enum', { nn: true }),
              field('url', 'string', { nn: true }),
              field('note', 'string'),
              field('submittedAt', 'date', { nn: true }),
            ],
          }),
          field('priority', 'enum', { nn: true }),
          field('slaDeadline', 'date'),
          field('faultDecision', 'enum'),
          field('outcome', 'enum'),
          field('status', 'enum', { nn: true }),
        ],
      },
      {
        name: 'SupportTicketMessage',
        fields: [
          pkId(),
          field('ticketId', 'objectId', { nn: true }),
          field('senderRole', 'enum', { nn: true }),
          field('senderId', 'objectId', { nn: true }),
          field('message', 'string', { nn: true }),
          field('attachments', 'string', { array: true }),
          field('isInternalNote', 'bool', { nn: true }),
          field('sentAt', 'date', { nn: true }),
        ],
      },
      {
        name: 'SupportTicketStatusHistory',
        fields: [
          pkId(),
          field('ticketId', 'objectId', { nn: true }),
          field('fromStatus', 'enum'),
          field('toStatus', 'enum', { nn: true }),
          field('changedBy', 'objectId', { nn: true }),
          field('changedAt', 'date', { nn: true }),
          field('note', 'string'),
        ],
      },
      {
        name: 'DisputeEvent',
        fields: [
          pkId(),
          field('disputeId', 'objectId', { nn: true }),
          field('eventType', 'enum', { nn: true }),
          field('actorRole', 'enum', { nn: true }),
          field('actorId', 'objectId'),
          field('occurredAt', 'date', { nn: true }),
          field('payload', 'object'),
        ],
      },
    ],
    relations: [
      ['SupportTicket._id', 'SupportTicketMessage.ticketId', '1:M'],
      ['SupportTicket._id', 'SupportTicketStatusHistory.ticketId', '1:M'],
      ['Dispute._id', 'DisputeEvent.disputeId', '1:M'],
    ],
  },
  {
    key: 'notification',
    label: 'notification-service (leen_notification)',
    tables: [
      {
        name: 'Notification',
        fields: [
          pkId(),
          field('userId', 'objectId', { nn: true }),
          field('role', 'enum', { nn: true }),
          field('title', 'string', { nn: true }),
          field('body', 'string', { nn: true }),
          field('type', 'string', { nn: true }),
          field('readAt', 'date'),
        ],
      },
      {
        name: 'DeviceToken',
        fields: [
          pkId(),
          field('userId', 'objectId', { nn: true }),
          field('platform', 'enum', { nn: true }),
          field('token', 'string', { nn: true }),
        ],
      },
      {
        name: 'NotificationTemplate',
        fields: [
          pkId(),
          field('key', 'string', { nn: true }),
          field('text', 'object', {
            nn: true,
            children: [field('en', 'string', { nn: true }), field('ar', 'string', { nn: true })],
          }),
          field('channel', 'enum', { nn: true }),
        ],
      },
    ],
    relations: [],
  },
  {
    key: 'admin',
    label: 'admin-service (leen_admin)',
    tables: [
      {
        name: 'Banner',
        fields: [
          pkId(),
          field('categoryId', 'objectId'),
          field('imageUrl', 'string', { nn: true }),
          field('status', 'enum', { nn: true }),
        ],
      },
      {
        name: 'Report',
        fields: [
          pkId(),
          field('type', 'string', { nn: true }),
          field('filters', 'object'),
          field('generatedFileUrl', 'string'),
          field('requestedBy', 'objectId', { nn: true }),
          field('status', 'enum', { nn: true }),
        ],
      },
      {
        name: 'AuditLog',
        fields: [
          pkId(),
          field('actorId', 'objectId', { nn: true }),
          field('action', 'string', { nn: true }),
          field('targetType', 'string', { nn: true }),
          field('targetId', 'objectId', { nn: true }),
          field('timestamp', 'date', { nn: true }),
        ],
      },
    ],
    relations: [],
  },
];

// ---- Layout + build ----
const COL_WIDTH = 340;
const COL_GAP = 100;
const TABLE_GAP = 60;
const HEADER_ROW_HEIGHT = 32;
const FIELD_ROW_HEIGHT = 26;

function estimateHeight(fields) {
  // rough estimate: header + one row per top-level field (children collapsed by default)
  return HEADER_ROW_HEIGHT + fields.length * FIELD_ROW_HEIGHT + 20;
}

const tables = [];
const relations = [];
const notes = [];
const tableIndex = {}; // "service.TableName" -> { table, fieldsByName }

let colX = 40;
for (const svc of services) {
  let y = 90;
  notes.push({
    id: uuid(),
    title: svc.label,
    description: `Owns its own MongoDB database. Cross-service references are plain ObjectId fields (no local relation drawn).`,
    x: colX,
    y: 20,
    width: COL_WIDTH,
    height: 56,
  });

  for (const t of svc.tables) {
    const tbl = {
      id: uuid(),
      tableName: t.name,
      fields: t.fields,
      x: colX,
      y,
      width: COL_WIDTH,
    };
    tables.push(tbl);
    tableIndex[`${svc.key}.${t.name}`] = {
      table: tbl,
      fieldsByName: Object.fromEntries(t.fields.map((f) => [f.name, f])),
    };
    y += estimateHeight(t.fields) + TABLE_GAP;
  }

  colX += COL_WIDTH + COL_GAP;
}

for (const svc of services) {
  for (const [fromRef, toRef, type] of svc.relations) {
    const [fromTableName, fromFieldName] = fromRef.split('.');
    const [toTableName, toFieldName] = toRef.split('.');
    const from = tableIndex[`${svc.key}.${fromTableName}`];
    const to = tableIndex[`${svc.key}.${toTableName}`];
    if (!from || !to) throw new Error(`Bad relation ref in ${svc.key}: ${fromRef} -> ${toRef}`);
    const fromField = from.fieldsByName[fromFieldName];
    const toField = to.fieldsByName[toFieldName];
    if (!fromField || !toField) throw new Error(`Bad field ref in ${svc.key}: ${fromRef} -> ${toRef}`);
    relations.push({
      id: uuid(),
      fromTableId: from.table.id,
      toTableId: to.table.id,
      fromFieldId: fromField.id,
      toFieldId: toField.id,
      type,
    });
  }
}

const schema = {
  version: '0.1',
  tables,
  relations,
  notes,
  selectedElementId: null,
};

const outPath = path.join(__dirname, 'leen-full-schema.mml');
fs.writeFileSync(outPath, JSON.stringify(schema, null, 2), 'utf8');
console.log('Wrote', outPath);
console.log('tables:', tables.length, 'relations:', relations.length, 'notes:', notes.length);
