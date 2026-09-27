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
    ],
    relations: [
      ['User._id', 'CustomerProfile.userId', '1:1'],
      ['User._id', 'PartnerProfile.userId', '1:1'],
      ['User._id', 'StaffProfile.userId', '1:1'],
      ['User._id', 'StaffProfile.partnerId', '1:M'],
      ['User._id', 'AdminProfile.userId', '1:1'],
      ['Role._id', 'AdminProfile.roleId', '1:M'],
      ['User._id', 'RefreshToken.userId', '1:M'],
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
    ],
    relations: [
      ['Category._id', 'SubCategory.parentCategoryId', '1:M'],
      ['SubCategory._id', 'Service.subCategoryId', '1:M'],
      ['Category._id', 'PricingTier.categoryId', '1:M'],
      ['Category._id', 'JobTemplate.categoryId', '1:M'],
      ['SubCategory._id', 'JobTemplate.subCategoryId', '1:M'],
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
        ],
      },
      {
        name: 'BookingStatusHistory',
        fields: [
          pkId(),
          field('bookingId', 'objectId', { nn: true }),
          field('fromStatus', 'enum'),
          field('toStatus', 'enum', { nn: true }),
          field('actorRole', 'enum', { nn: true }),
          field('actorId', 'objectId'),
          field('changedAt', 'date', { nn: true }),
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
    ],
    relations: [
      ['Booking._id', 'BookingStatusHistory.bookingId', '1:M'],
      ['Booking._id', 'Review.bookingId', '1:M'],
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
          field('method', 'enum', { nn: true }),
          field('status', 'enum', { nn: true }),
          field('txnId', 'string'),
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
          field('txnId', 'string'),
          field('heldForDispute', 'bool'),
        ],
      },
      {
        name: 'Refund',
        fields: [
          pkId(),
          field('bookingId', 'objectId', { nn: true }),
          field('customerId', 'objectId', { nn: true }),
          field('amount', 'double', { nn: true }),
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
    ],
    relations: [],
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
    ],
    relations: [],
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
