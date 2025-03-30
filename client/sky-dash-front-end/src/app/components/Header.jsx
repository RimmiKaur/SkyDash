import { usePathname } from 'next/navigation';
import React from 'react';

export default function Header() {
    const pathname = usePathname(); // Get the current route path

    // Function to properly format the pathname
    const formatPathname = (path) => {
        if (path === "/") return "Home"; // Default to 'Home'

        return path
            .replace("/", "") // Remove the leading '/'
            .split("-") // Split words by '-'
            .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize each word
            .join(" "); // Join back with spaces
    };

    const formattedPathname = formatPathname(pathname);

    return (
        <div>
            <img
                src="/images/hero-bg.jpg"
                className="object-cover h-[400px] w-full object-top"
                alt="Hero Background"
            />

          <div className="absolute inset-0 h-[400px] bg-black opacity-50"></div> {/* Dark Overlay */}


            <div className="text-center absolute z-10 top-[160px]  left-1/2 mt-4">
                <h2 className="text-4xl font-semibold text-white">
                    {formattedPathname} {/* If empty, default to "Home" */}
                </h2>
                <p className='pt-3'>
                    Home  / {formattedPathname}
                </p>
            </div>
        </div>
    );
}

