import mongoose from "mongoose";
const UserSchema = mongoose.Schema({
  pseudo: { type: String, required: true },
  score: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});
const User = mongoose.models.User || mongoose.model("User", UserSchema);
export default User;
