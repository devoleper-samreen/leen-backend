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
  NoPartnerFound = 'no_partner_found',
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

export enum PartnerServiceStatus {
  Active = 'active',
  PendingApproval = 'pending_approval',
  Rejected = 'rejected',
  Suspended = 'suspended',
}

export enum PartnerApprovalAction {
  Submitted = 'submitted',
  UnderReview = 'under_review',
  Approved = 'approved',
  Rejected = 'rejected',
  Resubmitted = 'resubmitted',
  CoverageChanged = 'coverage_changed',
  Suspended = 'suspended',
}

export enum AvailabilityStatus {
  Available = 'available',
  Unavailable = 'unavailable',
  OnBreak = 'on_break',
}

export enum JobOfferResponse {
  Pending = 'pending',
  Accepted = 'accepted',
  Rejected = 'rejected',
  TimedOut = 'timed_out',
}

export enum JobAssignmentStatus {
  Active = 'active',
  Reassigned = 'reassigned',
  Unassigned = 'unassigned',
}

export enum JobEventType {
  StatusChanged = 'status_changed',
  OnTheWay = 'on_the_way',
  Arrived = 'arrived',
  StartOtpVerified = 'start_otp_verified',
  BeforePhotoUploaded = 'before_photo_uploaded',
  JobStarted = 'job_started',
  Paused = 'paused',
  Resumed = 'resumed',
  RestartOtpVerified = 'restart_otp_verified',
  AfterPhotoUploaded = 'after_photo_uploaded',
  ExtraTimeAdded = 'extra_time_added',
  RemarkAdded = 'remark_added',
  EndOtpVerified = 'end_otp_verified',
  JobCompleted = 'job_completed',
  Cancelled = 'cancelled',
  AddressModified = 'address_modified',
}

export enum PromoRedemptionStatus {
  Applied = 'applied',
  Reversed = 'reversed',
  Cancelled = 'cancelled',
}

export enum WalletTransactionDirection {
  Credit = 'credit',
  Debit = 'debit',
}

export enum WalletTransactionType {
  JobEarning = 'job_earning',
  Payout = 'payout',
  RefundDeduction = 'refund_deduction',
  Penalty = 'penalty',
  Adjustment = 'adjustment',
  Tip = 'tip',
}

export enum WalletTransactionStatus {
  Pending = 'pending',
  Completed = 'completed',
  Reversed = 'reversed',
}

export enum TransferAttemptStatus {
  Pending = 'pending',
  Success = 'success',
  Failed = 'failed',
}

export enum PaymentStatus {
  Pending = 'pending',
  Success = 'success',
  Failed = 'failed',
  Expired = 'expired',
}

export enum DisputeEventType {
  Message = 'message',
  EvidenceSubmitted = 'evidence_submitted',
  StatusChanged = 'status_changed',
  InfoRequested = 'info_requested',
  FaultDecided = 'fault_decided',
  Resolved = 'resolved',
}

export enum SuspensionStatus {
  Active = 'active',
  Lifted = 'lifted',
  Expired = 'expired',
}

export enum FraudRecordStatus {
  Flagged = 'flagged',
  Cleared = 'cleared',
}

export enum ConversationStatus {
  Active = 'active',
  Closed = 'closed',
}

export enum DataDeletionStatus {
  Pending = 'pending',
  Processing = 'processing',
  Completed = 'completed',
  Rejected = 'rejected',
}
