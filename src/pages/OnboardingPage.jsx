import { useState } from "react";
import { useUser } from "@clerk/clerk-react";

export default function OnboardingPage() {
  const { user } = useUser();

  const [form, setForm] = useState({
    name: "",
    age: "",
    gender: "",
    phone: "",
    college: "",
    pocketMoney: "",
    emergencyContact: "",
    friendName: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = () => {
    const data = {
      clerkId: user?.id,
      email: user?.primaryEmailAddress?.emailAddress,
      ...form,
    };

    localStorage.setItem(
      "pocketBuddyUser",
      JSON.stringify(data)
    );

    console.log(data);

    alert("Profile Saved Successfully!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-purple-50 flex items-center justify-center p-6">

      <div className="bg-white shadow-2xl rounded-3xl p-10 w-full max-w-3xl">

        <h1 className="text-4xl font-bold text-center">
          Let's Get To Know You 🌸
        </h1>

        <p className="text-center text-gray-500 mt-2 mb-8">
          Help Pocket Buddy personalize your experience.
        </p>

        <div className="grid grid-cols-2 gap-4">

          <input
            name="name"
            placeholder="Full Name"
            onChange={handleChange}
            className="border p-3 rounded-xl"
          />

          <input
            name="age"
            placeholder="Age"
            onChange={handleChange}
            className="border p-3 rounded-xl"
          />

          <input
            name="gender"
            placeholder="Gender"
            onChange={handleChange}
            className="border p-3 rounded-xl"
          />

          <input
            name="phone"
            placeholder="Phone Number"
            onChange={handleChange}
            className="border p-3 rounded-xl"
          />

          <input
            name="college"
            placeholder="College Name"
            onChange={handleChange}
            className="border p-3 rounded-xl"
          />

          <input
            name="pocketMoney"
            placeholder="Monthly Pocket Money"
            onChange={handleChange}
            className="border p-3 rounded-xl"
          />

          <input
            name="emergencyContact"
            placeholder="Emergency Contact"
            onChange={handleChange}
            className="border p-3 rounded-xl"
          />

        </div>

        <div className="mt-8 bg-green-50 p-6 rounded-2xl">

          <h2 className="font-bold text-xl">
            Meet Your AI Companion 🤖
          </h2>

          <p className="text-gray-600 mt-2">
            What would you like to call your virtual best friend?
          </p>

          <input
            name="friendName"
            placeholder="Nova / Luna / Pixel"
            onChange={handleChange}
            className="w-full mt-4 border p-3 rounded-xl"
          />

        </div>

        <button
          onClick={handleSubmit}
          className="w-full mt-8 bg-green-500 hover:bg-green-600 text-white py-4 rounded-xl font-semibold"
        >
          Continue
        </button>

      </div>

    </div>
  );
}