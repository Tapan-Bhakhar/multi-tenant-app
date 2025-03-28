import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema()
export class Tenant extends Document {
    @Prop({ required: true, unique: true })
    name: string;

    @Prop({ required: true, unique: true })
    email: string;

    @Prop({ required: true })
    password: string;
    
    @Prop({ required: true, unique: true })
    tenantKey: string; // Unique key for each tenant
}

export const TenantSchema = SchemaFactory.createForClass(Tenant);
