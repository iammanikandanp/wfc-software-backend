import { Registration } from "../models/registration.js";

export const register = async (req, res) => {
  try {
    const {
      name, age, gender, email, height, weight, bmi, bloodGroup,
      issues, description="", profession, phone, address, pincode,
      packages, duration, services,startDate,
        endDate,
      personalTraining = "", customWorkout = "", customDiet = "", rehabTherapy = ""
    } = req.body;

    console.log("Register Request:", req.body);

    
    if (
      !name || !age || !gender || !email || !height || !weight || !bmi || !bloodGroup ||
      !issues  || !profession || !phone || !address || !pincode ||
      !packages || !duration || !services || !startDate ||
        !endDate
    ) {
      return res.status(400).json({ message: "Please provide all required details" });
    }
    
    const existingUser = await Registration.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already registered" });
    }

  
    const newUser = new Registration({
      name, age, gender, email, height, weight, bmi, bloodGroup,
      issues, description, profession, phone, address, pincode,
      packages, duration, services,
      personalTraining, customWorkout, customDiet, rehabTherapy,startDate,
  endDate
    });

    const savedUser = await newUser.save();
console.log("Saved User:", savedUser);
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
      name, age, gender, email, height, weight, bmi, bloodGroup,
      issues, description = "", profession, phone, address, pincode,
      packages, duration, services, startDate, endDate,
      personalTraining = "", customWorkout = "", customDiet = "", rehabTherapy = ""
    } = req.body;

    
    if (
      !name || !age || !gender || !email || !height || !weight || !bmi || !bloodGroup ||
      !issues || !profession || !phone || !address || !pincode ||
      !packages || !duration || !services || !startDate || !endDate
    ) {
      return res.status(400).json({
        message: "Please provide all required details"
      });
    }

    const updateData = {
      name, age, gender, email, height, weight, bmi, bloodGroup,
      issues, description, profession, phone, address, pincode,
      packages, duration, services, startDate, endDate,
      personalTraining, customWorkout, customDiet, rehabTherapy
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