import { Registration } from "../models/registration.js";

export const register = async (req, res) => {
  try {
    const {
      name, age, gender, emails, height, weight, bmi, bloodGroup,
      issues, description = "", profession, phone, address, pincode,
      packages, duration, services, startDate, endDate,
      bodyFat, waist, neck, hip,
      sugarLevel, bloodPressure,
      personalTraining = "", customWorkout = "", customDiet = "", rehabTherapy = ""
    } = req.body;
console.log( req.body)
    // Access uploaded image file paths
    const profileImage = req.files?.profileImage?.[0]?.path || "";
    const frontBodyImage = req.files?.frontBodyImage?.[0]?.path || "";
    const sideBodyImage = req.files?.sideBodyImage?.[0]?.path || "";
    const backBodyImage = req.files?.backBodyImage?.[0]?.path || "";

    // Validate required fields
    if (!name || !age || !gender || !emails) {
      return res.status(400).json({ message: "Please provide all required details" });
    }

    // Check for existing email
    const existingUser = await Registration.findOne({ emails });
    if (existingUser) {
      return res.status(409).json({ message: "Email already registered" });
    }

    // Calculate health status
    let statusLevel = "Normal";
    if (gender == "Male") {
      if (age > 40 || bmi > 25 || bodyFat > 20) statusLevel = "High";
    } else if (gender == "Female") {
      if (age > 40 || bmi > 24 || bodyFat > 30) statusLevel = "High";
    }

    const newUser = new Registration({
      name, age, gender, emails, height, weight, bmi, bloodGroup,
      issues, description, profession, phone, address, pincode,
      packages, duration, services, startDate, endDate,
      bodyFat, waist, neck, hip,
      sugarLevel, bloodPressure,
      personalTraining, customWorkout, customDiet, rehabTherapy,
      statusLevel,
      images: {
        profileImage,
        frontBodyImage,
        sideBodyImage,
        backBodyImage,
      }
    });

    const savedUser = await newUser.save();

    return res.status(200).json({
      message: "Registered successfully!",
      data: savedUser
    });

  } catch (err) {
    console.error("Registration Error:", err);
    return res.status(500).json({
      message: "Internal Server Error",
      error: err.message
    });
  }
};




export const fetch = async (req, res) => {
  try {
    const fetchAll = await Registration.find({})
    res.status(200).json({
      message: "fetch all data",
      data: fetchAll
    })

  } catch (err) {
    console.log("error on ", err)
  }
}

export const updatereg = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name, age, gender, emails, height, weight, bmi, bloodGroup,
      issues, description = "", profession, phone, address, pincode,
      packages, duration, services, startDate, endDate,bodyFat,waist,neck,hip,
      personalTraining = "", customWorkout = "", customDiet = "", rehabTherapy = ""
    } = req.body;

    
    if (
      !name 
    ) {
      return res.status(400).json({
        message: "Please provide all required details"
      });
    }

    const updateData = {
      name, age, gender, emails, height, weight, bmi, bloodGroup,
      issues, description, profession, phone, address, pincode,
      packages, duration, services, startDate, endDate,waist,neck,hip,
      personalTraining, customWorkout, customDiet, rehabTherapy,bodyFat
    };

    const updatedUser = await Registration.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      message: "Updated successfully",
      data: updatedUser
    });

  } catch (err) {
    console.error("Update Error:", err);
    return res.status(500).json({
      message: "Internal Server Error",
      error: err.message
    });
  }
};


export const deletereg = async(req,res)=>{
  try{
    const {id}=req.params
    const deleteData = await Registration.findByIdAndDelete(id)
    res.status(200).json({
      message: "delete successfully",
      data: deleteData
    })
  }catch(err){
    console.log("error on ", err)
  }
}

export const fetchOne = async(req,res)=>{
  try{
const {id}=req.params
const fetchOneData= await Registration.findById(id)
res.status(200).json({
  message: "fetch one data",
  data: fetchOneData
})
  }  
  catch(err){
console.log("error on ", err)
  }
}