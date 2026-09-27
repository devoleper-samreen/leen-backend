export enum Role {
  Customer = 'customer',
  Partner = 'partner',
  Staff = 'staff',
  Admin = 'admin',
  SubAdmin = 'subadmin',
}

export enum UserStatus {
  Active = 'active',
  Suspended = 'suspended',
  Deleted = 'deleted',
}

export enum PublishStatus {
  Draft = 'draft',
  Live = 'live',
}

export enum BookingType {
  Urgent = 'urgent',
  Scheduled = 'scheduled',
}

export enum BookingStatus {
  Searching = 'searching',
  Confirmed = 'confirmed',
  EnRoute = 'en_route',
  Arrived = 'arrived',
  InProgress = 'in_progress',
  Paused = 'paused',
  Completed = 'completed',
  Cancelled = 'cancelled',
}

export enum PayoutStatus {
  Pending = 'pending',
  Processing = 'processing',
  Paid = 'paid',
  Failed = 'failed',
}

export enum RefundStatus {
  Pending = 'pending',
  Success = 'success',
  Failed = 'failed',
}

export enum TicketStatus {
  Open = 'open',
  InReview = 'in_review',
  Resolved = 'resolved',
  Closed = 'closed',
}

export enum DisputePriority {
  Urgent = 'urgent',
  High = 'high',
  Medium = 'med',
  Low = 'low',
}

export enum DisputeFault {
  Customer = 'customer',
  Partner = 'partner',
  Both = 'both',
}

export enum DisputeOutcome {
  FullRefund = 'full_refund',
  PartialRefund = 'partial_refund',
  PayoutHeld = 'payout_held',
  FalseComplaint = 'false_complaint',
  CancellationIssue = 'cancellation_issue',
  CustomerUnavailable = 'customer_unavailable',
  IncorrectResolution = 'incorrect_resolution',
  PartnerPaid = 'partner_paid',
}

export enum DisputeStatus {
  Open = 'open',
  InProcess = 'in_process',
  Resolved = 'resolved',
  Closed = 'closed',
}

export enum RbacModule {
  Finance = 'finance',
  Operations = 'operations',
  Support = 'support',
}

export enum RbacAccessLevel {
  ReadOnly = 'read_only',
  ReadWrite = 'read_write',
}
