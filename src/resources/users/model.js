// @flow
import mongoose, { Schema } from 'mongoose';

const userSchema: Object = new Schema({
  username: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  status: {
    type: String,
    enum: ['unverified', 'active', 'disabled', 'blocked'],
    default: 'unverified'
  },
  updatedAt: { type: Date },
  roles: [{ type: String, enum: ['member', 'admin', 'super-user'] }]
});

userSchema
  .pre('save', function updatedAt(next) {
    // change the updated_at field to current date
    this.updatedAt = new Date();

    next();
  })
  .virtual('createdAt')
  .get(function createdAt() {
    if (this['_created']) return this['_created'];
    return (this['_created'] = this._id.getTimestamp());
  });

const User: Object = mongoose.model('User', userSchema);
export default User;
