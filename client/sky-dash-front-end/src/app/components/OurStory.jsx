import React from "react";
import Image from "next/image";

export default function OurStory() {
  return (
    <section className="flex flex-col md:flex-row items-center justify-between px-10 py-16 bg-white">
      {/* Left Content */}
      <div className="md:w-1/2">
        <h2 className="text-3xl font-bold text-black">
          Enhance your skills with best Online courses
        </h2>
        <p className="mt-4 text-gray-600 leading-relaxed">
          Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium laudantium,
          totam rem aperiam, eaque ipsa quae ab illo inventore veritatis, et quasi architecto
          beatae vitae dicta sunt explicabo.
        </p>
        <p className="mt-4 text-gray-600 leading-relaxed">
          Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium laudantium,
          totam rem aperiam, eaque ipsa quae ab illo inventore veritatis, et quasi architecto
          beatae vitae dicta sunt explicabo.
        </p>
        <p className="mt-4 text-gray-600 leading-relaxed">
          Nemo enim ipsam, voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed
          quia, consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque
          porro quisquam est, qui dolorem ipsum quia dolor sit amet, adipisci velit, sed
          quia non numquam eius modi tempor.
        </p>
      </div>

      {/* Right Image */}
      <div className="md:w-1/2 flex justify-center mt-6 md:mt-0">
        <Image
          src="/images/skills-girl.jpg" // Replace with actual image path
          alt="Online Learning"
          width={500}
          height={350}
          className="rounded-lg shadow-md"
        />
      </div>
    </section>
  );
}
