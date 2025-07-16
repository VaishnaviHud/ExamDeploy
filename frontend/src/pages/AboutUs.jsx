import React from "react";

const teamMembers = [
  {
    name: "Kasturi Pawar",
    email: "kasturi@gmail.com",
    imgSrc: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTEIciKPKWE240l1KfyRDZ2P2tFvZxAEFWr0w&usqp=CAU"
  },
  {
    name: "Rachana Dinkar",
    email: "rachana@gmail.com",
    imgSrc: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTEIciKPKWE240l1KfyRDZ2P2tFvZxAEFWr0w&usqp=CAU"
  },
  {
    name: "Vaishnavi Hud",
    email: "vaishnavihud07@gmail.com",
    imgSrc: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTEIciKPKWE240l1KfyRDZ2P2tFvZxAEFWr0w&usqp=CAU"
  },
];

function AboutUs() {
  return (
    // Solid Blue Background
    <div className="min-h-screen bg-blue-500 py-12 px-8 text-white">

    {/* If you want a blue gradient instead, comment the above line and use this one:
    <div className="min-h-screen bg-gradient-to-b from-blue-500 to-blue-900 py-12 px-8 text-white"> 
    */}

      <section className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold">The Team Behind Examease</h2>
          <p className="mt-2 text-gray-200">Meet the minds making exam management easy and efficient.</p>
        </div>

        <div className="flex flex-wrap justify-center gap-6">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className="w-full sm:w-[300px] bg-white text-blue-500 rounded-xl overflow-hidden shadow-lg transform transition duration-300 hover:scale-105"
            >
              <img
                src={member.imgSrc}
                alt={member.name}
                className="w-full h-52 object-cover"
              />
              <div className="p-4">
                <h5 className="text-xl font-semibold mb-1">{member.name}</h5>
                <p className="text-sm">
                  <strong>Email:</strong>{" "}
                  <a
                    href={`mailto:${member.email}`}
                    className="text-blue-600 hover:underline"
                  >
                    {member.email}
                  </a>
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default AboutUs;
