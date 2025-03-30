"use client"
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { FaFeatherAlt } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { saveLoginDetails } from "../slice/AdminSlice";

export default function LoginPage() {
    let apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    let loginData = useSelector((myAllStore) => {
        return myAllStore.loginStore.adminDetails
    })

    let router = useRouter();
    let dispatch = useDispatch();

    let checkLogin = (event) => {

        event.preventDefault()

        console.log("ewffwefrerew", event.target);
        let obj = {
            adminUname: event.target.adminUname.value,
            adminPassword: event.target.adminPassword.value
        }

        console.log("hii", obj);
        axios.post(`${apiBaseUrl}admin/adminauth/login`, obj)
            .then((res) => res.data)
            .then((finalres) => {

                if (finalres.status) {
                    console.log(finalres.data)
                    dispatch(saveLoginDetails({ admin: finalres.data }))
                }
                else {
                    alert(finalres.msg)
                }
            })

    }

    useEffect(() => {

        if (loginData) {
            router.push("/dashboard");
        }
    }, [loginData])

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 shadow-lg w-96">
                {/* Logo and Title */}
                <img src="../images/logo.svg" alt="Logo" className="h-10 " />

                <p className="text-gray-600 text-sm mb-4">Sign in to continue.</p>

                {/* Input Fields */}
                <form onSubmit={checkLogin}>

                    <div className="space-y-4">
                        <input
                            name="adminUname"
                            type="text"
                            placeholder="Username"
                            className="w-full px-4 py-2 border focus:ring-2 text-gray-600 focus:ring-indigo-600 focus:outline-none"
                        />
                        <input
                            name="adminPassword"
                            type="password"
                            placeholder="Password"
                            className="w-full px-4 py-2 border focus:ring-2 text-gray-600 focus:ring-indigo-600 focus:outline-none"
                        />
                    </div>

                    {/* Submit Button */}
                    <button className="w-full mt-4 bg-indigo-600 text-white py-2 hover:bg-indigo-700 transition">
                        Submit
                    </button>

                </form>

                {/* Options */}
                <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
                    <label className="flex items-center space-x-2">
                        <input type="checkbox" className="accent-indigo-600" />
                        <span>Keep me signed in</span>
                    </label>
                    <a href="#" className="text-indigo-500 hover:underline">
                        Forgot password?
                    </a>
                </div>
            </div>
        </div>
    );
}
