// 'use client'
// import { Step1Form } from "@/app/admin/(otherPages)/laptop/add/Step1Form";
// import { Step2Form } from "@/app/admin/(otherPages)/laptop/add/Step2Form";
// import { Step3Form } from "@/app/admin/(otherPages)/laptop/add/Step3Form";
// import { Step4Form } from "@/app/admin/(otherPages)/laptop/add/Step4Form";
// import { useLaptopStore } from "@/store/laptopStore";
// import { useState } from "react";

// export const AddLaptopForm = () => {
//   const [step, setStep] = useState(1);
//   const { formData } = useLaptopStore();

//   const nextStep = () => setStep((prev) => prev + 1);
//   const prevStep = () => setStep((prev) => prev - 1);

//   const submitForm = async () => {
//     try {
//       const res = await fetch("/api/laptops", {
//         method: "POST",
//         body: JSON.stringify(formData),
//         headers: { "Content-Type": "application/json" },
//       });
//       if (!res.ok) throw new Error("Failed to create laptop");
//       alert("Laptop created successfully!");
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   return (
//     <div>
//       {step === 1 && <Step1Form nextStep={nextStep} />}
//       {step === 2 && <Step2Form nextStep={nextStep} prevStep={prevStep} />}
//       {step === 3 && <Step3Form nextStep={nextStep} prevStep={prevStep} />}
//       {step === 4 && <Step4Form prevStep={prevStep} submitForm={submitForm} />}
//     </div>
//   );
// };