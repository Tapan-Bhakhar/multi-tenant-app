import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { Tenant } from "src/tenants/tenant.schema";

@Schema()
export class User extends Document {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true, unique: true })
    email: string;

    @Prop({ required: true })
    password: string;

    @Prop({type: Types.ObjectId, ref: "Tanent", required: true})
    tenant: Types.ObjectId;
}

export const UserSchema = SchemaFactory.createForClass(User);