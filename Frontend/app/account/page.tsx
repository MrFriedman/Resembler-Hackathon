"use client";

import { FormEvent, useEffect, useState } from "react";
import { isDemoMode } from "@/lib/demo";
import { readDemoProfile, saveDemoProfile } from "@/lib/demo-store";

const ManageAccount = () => {
  const demo = isDemoMode();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const profile = readDemoProfile();
    setFullName(profile.full_name);
    setEmail(profile.email);
  }, []);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setMessage(null);
    if (!demo) {
      setMessage("Save the full profile from account setup when the API is connected.");
      return;
    }
    saveDemoProfile({ full_name: fullName, email });
    setPassword("");
    setMessage("Account saved in this browser session.");
  };

  return (
    <div className="w-screen min-h-screen flex items-center justify-center p-6 bg-gradient-to-b from-gray-900 to-black">
      <div className="bg-gray-900 text-white max-w-xl w-full p-8 rounded-xl shadow-lg border border-gray-800">
        <h1 className="text-3xl font-bold mb-4 text-cyan-400">Manage Account</h1>
        <p className="mb-6 text-gray-400">
          {demo ? "Demo profile stored in this browser session." : "Update your account details below"}
        </p>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="fullName" className="block font-medium mb-2">User Full Name</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              placeholder="Enter your full name"
              className="w-full bg-gray-800 text-white border border-gray-700 p-3 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="email" className="block font-medium mb-2">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Enter your email"
              className="w-full bg-gray-800 text-white border border-gray-700 p-3 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="password" className="block font-medium mb-2">Change Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder={demo ? "Ignored in the demo" : "Enter new password"}
              className="w-full bg-gray-800 text-white border border-gray-700 p-3 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center text-gray-400">
            <input type="checkbox" id="consent" name="consent" className="mr-2 accent-blue-500" />
            <label htmlFor="consent" className="text-sm">
              I consent to the sharing of video footage with Resemble.AI
            </label>
          </div>

          {message && <p className="text-sm text-cyan-300">{message}</p>}

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-md w-full transition shadow-md hover:shadow-xl"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default ManageAccount;
