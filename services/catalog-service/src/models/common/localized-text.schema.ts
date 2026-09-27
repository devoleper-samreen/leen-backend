import { LocalizedText } from '@leen/shared';
import { Schema } from 'mongoose';

export const localizedTextSchema = new Schema<LocalizedText>(
  { en: { type: String, required: true }, ar: { type: String, required: true } },
  { _id: false },
);
