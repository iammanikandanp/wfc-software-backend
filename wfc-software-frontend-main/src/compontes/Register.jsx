import React, { useState, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export const Register = () => {
  const [step, setStep] = useState(1);
  const [bmiStatus, setBmiStatus] = useState("");
  const [bpStatus, setBpStatus] = useState("");
  const [sugarStatus, setSugarStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "", age: "", gender: "", emails: "",
    height: "", weight: "", bmi: "",
    waist: "", neck: "", hip: "", 
    bloodGroup: "", issues: "", description: "",
    bloodPressure: "", sugarLevel: "", 
    packages: "", duration: "", services: "",
    personalTraining: "", customWorkout: "", customDiet: "", rehabTherapy: "",
    profession: "", phone: "", address: "", pincode: "", startDate: "", endDate: "",

    profileImage: null,
    frontBodyImage: null,
    sideBodyImage: null,
    backBodyImage: null
  });

  useEffect(() => {
    const { height, weight } = formData;
    if (height && weight) {
      const h = parseFloat(height) / 100;
      const w = parseFloat(weight);
      const bmi = w / (h * h);
      const bmiVal = bmi.toFixed(1);
      let status = "";
      if (bmi < 18.5) status = "Underweight";
      else if (bmi < 24.9) status = "Normal";
      else if (bmi < 29.9) status = "Overweight";
      else status = "Obese";
      setFormData(prev => ({ ...prev, bmi: bmiVal }));
      setBmiStatus(status);
    }
  }, [formData.height, formData.weight]);

  useEffect(() => {
    const log10 = (val) => Math.log(val) / Math.LN10;
    const { gender, height, waist, neck, hip, age, bmi } = formData;

    const allCommon = gender && height && waist && neck;
    let fat = null;

    if (allCommon) {
      const h = parseFloat(height);
      const w = parseFloat(waist);
      const n = parseFloat(neck);

      if (gender === "Male") {
        fat = (
          495 / (1.0324 - 0.19077 * log10(w - n) + 0.15456 * log10(h)) - 450
        ).toFixed(2);
      }

      if (gender === "Female" && hip) {
        const hp = parseFloat(hip);
        fat = (
          495 /
          (1.29579 - 0.35004 * log10(w + hp - n) + 0.221 * log10(h)) - 450
        ).toFixed(2);
      }
    }

    if ((!fat || isNaN(fat)) && bmi && age && gender) {
      const bmiVal = parseFloat(bmi);
      const ageVal = parseFloat(age);
      fat =
        gender === "Male"
          ? (1.20 * bmiVal + 0.23 * ageVal - 16.2).toFixed(2)
          : (1.20 * bmiVal + 0.23 * ageVal - 5.4).toFixed(2);
    }

    if (fat) {
      setFormData((prev) => ({ ...prev, bodyFat: fat }));
    }
  }, [formData.gender, formData.height, formData.waist, formData.neck, formData.hip, formData.bmi, formData.age]);

  useEffect(() => {
    if (formData.startDate && formData.duration) {
      const start = new Date(formData.startDate);
      const durationMonths = parseInt(formData.duration, 10);
      const end = new Date(start.setMonth(start.getMonth() + durationMonths));
      const formattedEnd = end.toISOString().split('T')[0];
      setFormData(prev => ({ ...prev, endDate: formattedEnd }));
    }
  }, [formData.startDate, formData.duration]);

  useEffect(() => {
    const { bloodPressure, sugarLevel, age, gender } = formData;

    // Blood Pressure Status
    if (bloodPressure) {
      const [systolic, diastolic] = bloodPressure.split("/").map(Number);
      if (systolic && diastolic) {
        if (systolic < 90 || diastolic < 60) setBpStatus("Low");
        else if (systolic <= 120 && diastolic <= 80) setBpStatus("Normal");
        else if (systolic <= 139 || diastolic <= 89) setBpStatus("Elevated");
        else setBpStatus("High");
      } else {
        setBpStatus("Invalid");
      }
    } else {
      setBpStatus("");
    }

    // Sugar Level Status
    if (sugarLevel && age && gender) {
      const sugar = parseFloat(sugarLevel);
      if (sugar < 70) setSugarStatus("Low");
      else if (sugar <= 99) setSugarStatus("Normal");
      else if (sugar <= 125) setSugarStatus("Pre-Diabetic");
      else setSugarStatus("High");
    } else {
      setSugarStatus("");
    }
  }, [formData.bloodPressure, formData.sugarLevel, formData.age, formData.gender]);

  const getCurrentFields = () => {
    switch (step) {
      case 1:
        return ["name", "age", "gender", "emails"];
      case 2:
        return ["height", "weight", "bmi", "waist", "neck", ...(formData.gender === "Female" ? ["hip"] : [])];
      case 3:
        return formData.issues === "Mental" || formData.issues === "Physical"
          ? ["bloodGroup", "issues", "description", "bloodPressure", "sugarLevel"]
          : ["bloodGroup", "issues", "bloodPressure", "sugarLevel"];
      case 4:
        return ["profession", "phone", "address", "pincode"];
      case 5:
        return [
          "packages", "duration", "startDate", "services",
          ...(formData.services === "Yes"
            ? ["personalTraining", "customWorkout", "customDiet", "rehabTherapy"]
            : [])
        ];
      default:
        return [];
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setFormData(prev => ({ ...prev, [name]: files[0] }));
    }
  };

  const isValidPhone = phone => /^\d{10}$/.test(phone);

  const handleNext = () => {
    const currentFields = getCurrentFields();
    const isValid = currentFields.every(field => formData[field]?.toString().trim() !== "");
    if (!isValid) return toast.error("Please fill all required fields");
    if (step === 4 && !isValidPhone(formData.phone)) return toast.error("Invalid 10-digit phone number");
    if (step < 5) setStep(prev => prev + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(prev => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const data = new FormData();
      for (const key in formData) {
        data.append(key, formData[key]);
      }

      const response = await axios.post("https://wfc-backend-software.onrender.com/api/v1/register", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response) toast.success(response.data.message);
      navigate("/");
    } catch {
      toast.error("Submission failed!");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            <h3 className="text-gray-600 font-semibold text-2xl sm:text-md ">Basic Details</h3>
            <Input label="Name" name="name" value={formData.name} onChange={handleChange} />
            <Input label="Age" name="age" value={formData.age} onChange={handleChange} type="number" />
            <Select label="Gender" name="gender" value={formData.gender} onChange={handleChange} options={["Male", "Female", "Other"]} />
            <Input label="Email" name="emails" value={formData.emails} onChange={handleChange} type="email" />
          </>
        );
      case 2:
        return (
          <>
            <h3 className="text-gray-600 font-semibold text-2xl sm:text-md">Weight Details</h3>
            <Input label="Height (cm)" name="height" value={formData.height} onChange={handleChange} type="number" />
            <Input label="Weight (kg)" name="weight" value={formData.weight} onChange={handleChange} type="number" />
            <Input label="BMI" name="bmi" value={formData.bmi} onChange={handleChange} />
            <Input label="Waist (cm)" name="waist" value={formData.waist} onChange={handleChange} type="number" />
            <Input label="Neck (cm)" name="neck" value={formData.neck} onChange={handleChange} type="number" />
            {formData.gender === "Female" && (
              <Input label="Hip (cm)" name="hip" value={formData.hip} onChange={handleChange} type="number" />
            )}
            <InputFile label="Profile Photo" name="profileImage" onChange={handleImageChange} />
            <InputFile label="Front Body Photo" name="frontBodyImage" onChange={handleImageChange} />
            <InputFile label="Side Body Photo" name="sideBodyImage" onChange={handleImageChange} />
            <InputFile label="Back Body Photo" name="backBodyImage" onChange={handleImageChange} />
            {formData.bmi && (
              <div className="flex items-center justify-between mt-1">
                <p className={`text-sm font-medium ${bmiStatus === "Underweight"
                  ? "text-blue-500"
                  : bmiStatus === "Normal"
                    ? "text-green-500"
                    : bmiStatus === "Overweight"
                      ? "text-yellow-500"
                      : "text-red-500"
                  }`}>
                  BMI Status: {bmiStatus}
                </p>
                {formData.bodyFat && (
                  <p className="text-sm font-medium text-purple-500">
                    Body Fat: {formData.bodyFat}%
                  </p>
                )}
              </div>
            )}
          </>
        );
      case 3:
        return (
          <>
            <h3 className="text-gray-600 font-semibold text-2xl sm:text-md">Medical Details</h3>
            <Select label="Blood Group" name="bloodGroup" value={formData.bloodGroup} onChange={handleChange}
              options={["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"]} />
            <Select label="Health Issues" name="issues" value={formData.issues} onChange={handleChange}
              options={["Mental", "Physical", "None"]} />
            {(formData.issues === "Mental" || formData.issues === "Physical") && (
              <Input label="Description" name="description" value={formData.description} onChange={handleChange} />
            )}
            <Input label="Blood Pressure (e.g. 120/80)" name="bloodPressure" value={formData.bloodPressure} onChange={handleChange} />
            {bpStatus && (
              <p className={`text-sm font-medium mt-1 ${bpStatus === "Normal" ? "text-green-500" : "text-red-500"}`}>
                Blood Pressure Status: {bpStatus}
              </p>
            )}
            <Input label="Sugar Level (mg/dL)" name="sugarLevel" value={formData.sugarLevel} onChange={handleChange} type="number" />
            {sugarStatus && (
              <p className={`text-sm font-medium mt-1 ${sugarStatus === "Normal" ? "text-green-500" : "text-red-500"}`}>
                Sugar Level Status: {sugarStatus}
              </p>
            )}
          </>
        );
      case 4:
        return (
          <>
            <h3 className="text-gray-600 font-semibold text-2xl sm:text-md">Contact Details</h3>
            <Input label="Profession" name="profession" value={formData.profession} onChange={handleChange} />
            <Input label="Phone" name="phone" value={formData.phone} onChange={handleChange} />
            <Input label="Address" name="address" value={formData.address} onChange={handleChange} />
            <Input label="Pincode" name="pincode" value={formData.pincode} onChange={handleChange} />
          </>
        );
      case 5:
        return (
          <>
            <h3 className="text-gray-600 font-semibold text-2xl sm:text-md">Membership Details</h3>
            <Select label="Package" name="packages" value={formData.packages} onChange={handleChange}
              options={["Basic", "Standard", "Premium", "Student", "Woman", "Group", "Offer"]} />
            <Select label="Duration (Months)" name="duration" value={formData.duration} onChange={handleChange}
              options={Array.from({ length: 12 }, (_, i) => (i + 1).toString())} />
            <Input label="Start Date" type="date" name="startDate" value={formData.startDate} onChange={handleChange} />
            <Input label="End Date" type="date" name="endDate" value={formData.endDate} readOnly />
            <Select label="Require Services?" name="services" value={formData.services} onChange={handleChange}
              options={["Yes", "No"]} />
            {formData.services === "Yes" && (
              <>
                <Input label="Personal Training" name="personalTraining" placeholder="e.g. 45 Days"
                  value={formData.personalTraining || ""} onChange={handleChange} />
                <Select label="Customized Workout" name="customWorkout" value={formData.customWorkout} onChange={handleChange}
                  options={["None", "Beginner", "Intermediate", "Advanced"]} />
                <Select label="Customized Diet" name="customDiet" value={formData.customDiet} onChange={handleChange}
                  options={["None", "Basic", "Weight Loss", "Muscle Gain", "Pro Diet"]} />
                <Select label="Rehab Therapy" name="rehabTherapy" value={formData.rehabTherapy} onChange={handleChange}
                  options={["None", "Basic Recovery", "Advanced Healing", "Elite Recovery"]} />
              </>
            )}
          </>
        );
      default:
        return null;
    }
  };

  const StepIndicator = () => (
    <div className="flex items-center justify-between mb-8">
      {[1, 2, 3, 4, 5].map((num) => (
        <div key={num}
          className={`flex-1 text-center py-2 rounded-full mx-1 text-sm
          ${step === num
              ? "bg-blue-600 text-white"
              : step > num
                ? "bg-green-600 text-white"
                : "bg-gray-200 text-gray-600"}`}>
          Step {num}
        </div>
      ))}
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-xl rounded-xl mt-[100px]">
      <Toaster position="top-right" />
      <StepIndicator />
      <form onSubmit={handleSubmit} className="space-y-5">
        {renderStep()}
        <div className="flex justify-between pt-6">
          {step > 1 && (
            <button type="button" onClick={handleBack}
              className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600">Back</button>
          )}
          {step < 5 ? (
            <button type="button" onClick={handleNext}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">Next</button>
          ) : (
            <button type="submit" disabled={isSubmitting}
              className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-700">
              {isSubmitting ? "Submitting..." : "Finish"}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

const Input = ({ label, ...props }) => (
  <div className="mb-3">
    <label className="block mb-1 text-sm font-medium text-gray-700">{label}</label>
    <input
      className={`w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${props.readOnly ? "bg-gray-100" : ""}`}
      {...props}
      required={!props.readOnly}
    />
  </div>
);

const Select = ({ label, name, value, onChange, options }) => (
  <div className="mb-3">
    <label className="block mb-1 text-sm font-medium text-gray-700">{label}</label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      required
    >
      <option value="" disabled hidden>
        Select an option
      </option>
      {options.map((opt) => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </select>
  </div>
);


const InputFile = ({ label, name, onChange }) => (
  <div className="mb-3">
    <label className="block mb-1 text-sm font-medium text-gray-700">{label}</label>
    <input type="file" name={name} onChange={onChange}
      className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:border file:border-gray-300 file:rounded-md file:text-sm file:font-semibold file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100" />
  </div>
);
