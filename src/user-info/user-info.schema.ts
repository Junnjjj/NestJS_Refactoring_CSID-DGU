import { Prop, Schema, SchemaFactory, SchemaOptions } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

const options: SchemaOptions = {
  timestamps: true,
};

@Schema(options)
export class UserInfo extends Document {
  @Prop({
    type: Types.ObjectId,
    required: true,
    ref: 'users',
  })
  userId: Types.ObjectId;

  @Prop({
    required: true,
    default: [true, true, true],
  })
  analysisChannel: boolean[];

  @Prop({
    required: true,
    default: '12',
  })
  analysisPeriod: string;

  @Prop({
    required: false,
  })
  analysisKeyword: string[];
}

export const UserInfoSchema = SchemaFactory.createForClass(UserInfo);
