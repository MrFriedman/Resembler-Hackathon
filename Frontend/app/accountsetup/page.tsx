"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"
import { updateAccount } from "@/lib/api";

export default function AccountSetup() {
  const [full_name, setFullName] = useState("");
  const [id_number, setIdNumber] = useState("");
  const [phone_number, setPhoneNumber] = useState("");
  const [home_address, setHomeAddress] = useState("");
  const [insurance_name, setInsuranceName] = useState("");
  const [insurance_number, setInsuranceNumber] = useState("");
  const [license_plate, setLicensePlate] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter()
  const handleSubmit = async (e: React.FormEvent) => {
    console.log("anything")
    e.preventDefault();
    
    try {
      const data = await updateAccount({
        full_name,
        id_number,
        phone_number,
        home_address,
        insurance_name,
        insurance_number,
        license_plate,
      });
      setMessage(data.message);
      router.push("/dashboard");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "An error occurred. Please try again.");
    }
  };

  return (
    <div className="w-screen min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-black">
      <div className="bg-gray-800 text-white p-8 rounded-2xl shadow-lg w-full max-w-lg">
        <h2 className="text-3xl font-bold text-cyan-400 mb-6 text-center">
          Account Registration
        </h2>
        <p className="text-gray-300 mb-6 text-center">Enter your personal details below</p>

        {message && (
          <p className={`text-center mb-4 ${/saved|success/i.test(message) ? "text-green-400" : "text-red-400"}`}>
            {message}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-300 text-sm font-bold mb-2">
              Full Name
            </label>
            <input
              type="full_name"
              value={full_name}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter your full name"
              className="w-full bg-gray-700 text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              required
            />
          </div>

          <div>
            <label className="block text-gray-300 text-sm font-bold mb-2">
              ID Number
            </label>
            <input
              type="id_number"
              value={id_number}
              onChange={(e) => setIdNumber(e.target.value)}
              placeholder="Enter your id number"
              className="w-full bg-gray-700 text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              required
            />
          </div>

          <div>
            <label className="block text-gray-300 text-sm font-bold mb-2">
              Phone Number
            </label>
            <input
              type="phone_number"
              value={phone_number}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Enter your phone number"
              className="w-full bg-gray-700 text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              required
            />
          </div>

          <div>
            <label className="block text-gray-300 text-sm font-bold mb-2">
              Home Address
            </label>
            <input
              type="home_address"
              value={home_address}
              onChange={(e) => setHomeAddress(e.target.value)}
              placeholder="Enter your home address"
              className="w-full bg-gray-700 text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              required
            />
          </div>

          <div>
            <label className="block text-gray-300 text-sm font-bold mb-2">
              Insurance Name
            </label>
            <input
              type="insurance_name"
              value={insurance_name}
              onChange={(e) => setInsuranceName(e.target.value)}
              placeholder="Enter your insurance name"
              className="w-full bg-gray-700 text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              required
            />
          </div>

          <div>
            <label className="block text-gray-300 text-sm font-bold mb-2">
              Insurance Number
            </label>
            <input
              type="insurance_number"
              value={insurance_number}
              onChange={(e) => setInsuranceNumber(e.target.value)}
              placeholder="Enter your insurance number"
              className="w-full bg-gray-700 text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              required
            />
          </div>

          <div>
            <label className="block text-gray-300 text-sm font-bold mb-2">
              License Plate
            </label>
            <input
              type="license_plate"
              value={license_plate}
              onChange={(e) => setLicensePlate(e.target.value)}
              placeholder="Enter your license plater"
              className="w-full bg-gray-700 text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              required
            />
          </div>

          <button type="submit" className="block bg-cyan-500 hover:bg-cyan-600 text-center text-white font-bold py-3 px-6 rounded-lg transition duration-200 w-full">
            Register
          </button>
        </form>
      </div>
    </div>
  );
}
