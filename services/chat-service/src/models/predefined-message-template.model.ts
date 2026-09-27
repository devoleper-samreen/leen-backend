import { LocalizedText, basePlugin } from '@leen/shared';
import { Schema, model, Document } from 'mongoose';

export interface IPredefinedMessageTemplate extends Document {
  text: LocalizedText;
  roleScope: 'customer' | 'staff' | 'both';
}

const predefinedMessageTemplateSchema = new Schema<IPredefinedMessageTemplate>({
  text: {
    type: new Schema({ en: { type: String, required: true }, ar: { type: String, required: true } }, { _id: false }),
    required: true,
  },
  roleScope: { type: String, enum: ['customer', 'staff', 'both'], default: 'both' },
});

predefinedMessageTemplateSchema.plugin(basePlugin);

export const PredefinedMessageTemplate = model<IPredefinedMessageTemplate>(
  'PredefinedMessageTemplate',
  predefinedMessageTemplateSchema,
);
