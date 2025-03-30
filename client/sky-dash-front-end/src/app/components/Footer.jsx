"use client";
import Link from "next/link";
import React from "react";
import { FaFacebookF, FaTwitter, FaGithub, FaDiscord, FaDribbble } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 text-sm pt-12">
      {/* Top Section: Links */}
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {/* Company */}
        <div>
          <h4 className="text-white font-semibold mb-4">COMPANY</h4>
          <ul className="space-y-2">
            <li><Link href="/home" className="hover:underline">Home</Link></li>
            <li><Link href="/courses" className="hover:underline">Course</Link></li>
            <li><Link href="/about-us" className="hover:underline">About Us</Link></li>
            <li><Link href="/team" className="hover:underline">Team</Link></li>
            <li><Link href="/contact-us" className="hover:underline">Contact Us</Link></li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h4 className="text-white font-semibold mb-4">SUPPORT</h4>
          <ul className="space-y-2">
            <li><a href="#" className="hover:underline">Documentation</a></li>
            <li><a href="#" className="hover:underline">Forums</a></li>
            <li><a href="#" className="hover:underline">Language Packs</a></li>
            <li><a href="#" className="hover:underline">Release Status</a></li>
          </ul>
        </div>

        {/* Download */}
        <div>
          <h4 className="text-white font-semibold mb-4">DOWNLOAD</h4>
          <ul className="space-y-2">
            <li><a href="#" className="hover:underline">iOS</a></li>
            <li><a href="#" className="hover:underline">Android</a></li>
            <li><a href="#" className="hover:underline">Windows</a></li>
            <li><a href="#" className="hover:underline">MacOS</a></li>
          </ul>
        </div>

        {/* Contact Us */}
        <div>
          <h4 className="text-white font-semibold mb-4">CONTACT US</h4>
          <ul className="space-y-2">
            <li>Ratanada Bhaskar Circle, Jodhpur</li>
            <li>123 456 7890</li>
            <li><a href="#" className="hover:underline">wscubetech.com</a></li>
          </ul>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="border-t bg-gray-500 mt-8 pt-6 pb-6 px-6 flex flex-col md:flex-row justify-between items-center">
        <p className="mb-4 md:mb-0">© 2023 Flowbite™. All Rights Reserved.</p>

        {/* Social Media Icons */}
        <div className="flex space-x-4 text-xl">
          <a href="#" className="hover:text-gray-300"><FaFacebookF /></a>
          <a href="#" className="hover:text-gray-300"><FaDiscord /></a>
          <a href="#" className="hover:text-gray-300"><FaTwitter /></a>
          <a href="#" className="hover:text-gray-300"><FaGithub /></a>
          <a href="#" className="hover:text-gray-300"><FaDribbble /></a>
        </div>
      </div>
    </footer>
);
}
