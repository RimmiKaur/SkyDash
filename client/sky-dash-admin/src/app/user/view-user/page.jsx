"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

export default function UsersTable() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                // Make sure NEXT_PUBLIC_API_BASE_URL is set in your .env.local file.
                const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}web/user/view-users`);
                if (res.data.status === 1) {
                    setUsers(res.data.data);
                } else {
                    toast.error("Failed to fetch users");
                }
            } catch (error) {
                console.error("Error fetching users:", error);
                toast.error("Error fetching users");
            }
        };

        fetchUsers();
    }, []);

    return (
        <div className="container min-h-screen mx-auto p-4 mt-16 text-black ">
            <ToastContainer />
            <h2 className="text-2xl font-bold mb-4">User List</h2>
            <table className="min-w-full border border-gray-300">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="px-4 py-2 border">S.no</th>
                        <th className="px-4 py-2 border">Name</th>
                        <th className="px-4 py-2 border">Email</th>
                        <th className="px-4 py-2 border">Member Since</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user, index) => (
                        <tr key={user._id} className="border-t">
                            <td className="px-4 py-2 border">{index + 1}</td>
                            <td className="px-4 py-2 border">{user.name || "N/A"}</td>
                            <td className="px-4 py-2 border">{user.userEmail}</td>
                            <td className="px-4 py-2 border">
                                {new Date(user.createdAt).toLocaleDateString()}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
