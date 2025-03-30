"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { useDispatch } from "react-redux";
import { saveLoginDetails } from "../slice/userSlice"; // Adjust path if needed
import Cookies from "js-cookie";

export default function AuthForm() {
  const searchParams = useSearchParams();
  const type = searchParams.get("type"); // Get 'type' query parameter
  const [isSignup, setIsSignup] = useState(false);

  // Controlled input states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Additional states for checkboxes
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const router = useRouter();
  const dispatch = useDispatch();

  // Automatically switch to signup if type=register
  useEffect(() => {
    if (type === "register") {
      setIsSignup(true);
    }
  }, [type]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // If in signup mode, ensure Terms are accepted
    if (isSignup && !acceptedTerms) {
      toast.error("You must accept the Terms and Conditions to create an account.");
      return;
    }

    // In signup mode, check if passwords match
    if (isSignup && password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      if (isSignup) {
        // Call the register API endpoint
        const response = await axios.post(
          `http://localhost:8080/web/webAuth/register`,
          {
            userEmail: email,
            userPassword: password,
          }
        );
        if (response.data.status === 1) {
          toast.success(response.data.mgs || "Registration successful");
          // Optionally switch to login mode
          setIsSignup(false);
        } else {
          toast.error(response.data.mgs || "Registration failed");
        }
      } else {
        // Call the login API endpoint
        const response = await axios.post(
          `http://localhost:8080/web/webAuth/login`,
          {
            userEmail: email,
            password: password,
          }
        );
        if (response.data.status === 1) {
          toast.success("Login successful");
          // Dispatch Redux action to store login details
          dispatch(
            saveLoginDetails({
              user: response.data.loginDataCheckEmail, // Adjust based on your API response
              token: response.data.token,
            })
          );

          router.push("/home");
        } else {
          toast.error(response.data.mgs || "Invalid credentials");
        }
      }
    } catch (error) {
      console.error("API Error:", error);
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen flex justify-center items-center">
      <div className="w-96 p-6 bg-gray-800 rounded-lg shadow-lg">
        <ToastContainer />
        <h2 className="text-2xl font-semibold mb-6 text-white">
          {isSignup ? "Create an account" : "Sign in to your account"}
        </h2>
        <form onSubmit={handleSubmit}>
          <label className="block text-sm font-medium">Your email</label>
          <input
            type="email"
            placeholder="name@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
          />

          <label className="block text-sm font-medium">Password</label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
          />

          {isSignup && (
            <>
              <label className="block text-sm font-medium">Confirm password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
              />
            </>
          )}

          {!isSignup && (
            <div className="flex items-center justify-end mb-4">
              
              <a href="#" className="text-blue-400 text-sm">
                Forgot password?
              </a>
            </div>
          )}

          {isSignup && (
            <label className="flex items-center text-sm mb-4">
              <input
                type="checkbox"
                className="mr-2"
                 checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
              />{" "}
              I accept the Terms and Conditions
            </label>
          )}

          <button
            type="submit"
            className="w-full py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg"
          >
            {isSignup ? "Create An Account" : "Sign in"}
          </button>

          <p className="text-center mt-4 text-sm">
            {isSignup ? (
              <>
                Already have an account?{" "}
                <span
                  className="text-blue-400 cursor-pointer"
                  onClick={() => setIsSignup(false)}
                >
                  Login here
                </span>
              </>
            ) : (
              <>
                Don’t have an account yet?{" "}
                <span
                  className="text-blue-400 cursor-pointer"
                  onClick={() => setIsSignup(true)}
                >
                  Sign up
                </span>
              </>
            )}
          </p>
        </form>
      </div>
    </div>
  );
}
