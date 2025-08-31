import mongoose from "mongoose";

const registerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, required: true },
  email: { type: String, required: true, unique: true },

  height: { type: Number, required: true },
  weight: { type: Number, required: true },
  startDate: { type: Date, required: true },
endDate: { type: Date, required: true },

 
  bmi: { type: String }, 

  bloodGroup: { type: String, required: true },
  issues: { type: String },
  description: { type: String, default: "" },

  profession: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  pincode: { type: String, required: true },

  packages: { type: String, required: true },
  duration: { type: String, required: true },
  services: { type: String, required: true },

  personalTraining: { type: String, default: "" },
  customWorkout: { type: String, default: "" },
  customDiet: { type: String, default: "" },
  rehabTherapy: { type: String, default: "" },

},{ timestamps: true });

export const Registration = mongoose.model("Registration", registerSchema);
