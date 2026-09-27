import { Schema } from 'mongoose';

/**
 * Applied to every service's mongoose schemas so response shapes stay
 * consistent across services without a shared base class.
 */
export function basePlugin(schema: Schema): void {
  schema.set('timestamps', true);
  schema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: (_doc, ret) => {
      ret.id = ret._id?.toString();
      delete ret._id;
      return ret;
    },
  });
}
