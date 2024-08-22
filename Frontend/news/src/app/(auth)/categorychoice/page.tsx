'use client'
import { Button } from "@/components/ui/button";
import React, { useState, useCallback } from "react";

export default function Categories() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const categories = [
    { name: "Sports", src: "https://i.postimg.cc/76FFhWHR/Sports.jpg" },
    { name: "Politics", src: "https://i.postimg.cc/tCZLWyZM/Politics.jpg" },
    { name: "Food", src: "https://i.postimg.cc/ZqMttq14/Food.jpg" },
    { name: "Crime", src: "https://i.postimg.cc/x1gV555k/Crime.jpg" },
    { name: "Technology", src: "https://i.postimg.cc/nrTN2cKy/Technology.jpg" },
    { name: "Entertainment", src: "https://i.postimg.cc/sDYrQsZ4/Entertainment.jpg" },
    { name: "Finance", src: "https://i.postimg.cc/43dkSc2W/Finance.jpg" },
    { name: "Health", src: "https://i.postimg.cc/vBxRQss9/Health.jpg" },
    { name: "Tourism", src: "https://i.postimg.cc/xjRrntr6/Tourism.jpg" },
    { name: "Education", src: "https://i.postimg.cc/Z5Jh628t/Education.jpg" },
    { name: "Business", src: "https://i.postimg.cc/4NkGxmn3/Business.jpg" },
    { name: "Lifestyle",src:"https://i.postimg.cc/MH1hQmXp/Lifestyle.jpg" }
  ];

  const toggleCategory = useCallback((categoryName: string) => {
    setSelectedCategories(prevSelected => {
      if (prevSelected.includes(categoryName)) {
        return prevSelected.filter(c => c !== categoryName);
      } else {
        return [...prevSelected, categoryName];
      }
    });
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = () => {
    console.log("Submitting selected categories:", selectedCategories);
    
  };

  return (
    <section className="w-full py-16  bg-black">
      <div className="container grid gap-8 px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center -mt-8">
          <div className="space-y-4">
            <h1 className="text-3xl font-bold tracking-tighter text-white sm:text-4xl md:text-5xl">
              Choose Your Interests
            </h1>
            <p className="max-w-[700px] text-slate-200 text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Select the categories you&apos;re most interested in to personalize your newsletter experience.
            </p>
          </div>
        </div>

        {/* Search Section */}
        <div className="flex justify-center mt-8">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Search categories..."
            className="px-4 py-2 w-full max-w-md rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          />
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3  md:grid-cols-4 lg:grid-cols-3 mt-4 ">
          {filteredCategories.map((category) => (
            <div
              key={category.name}
              onClick={() => toggleCategory(category.name)}
              className={`relative group rounded-lg overflow-hidden shadow-lg cursor-pointer ${
                selectedCategories.includes(category.name) ? "ring-2 ring-white ring-opacity-100" : ""
              }`}
            >
              <img
                src={category.src}
                alt={category.name}
                width={300}
                height={200}
                className="w-full h-48 object-cover group-hover:opacity-80 transition-opacity"
                style={{ aspectRatio: "300/200", objectFit: "cover" }}
              />
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-semibold text-lg transition-colors group-hover:bg-black/30">
                {category.name}
              </div>
            </div>
          ))}
        </div>

        {/* Submit Button */}
        <div className="flex justify-center mt-8">
          <Button
            onClick={handleSubmit}
            className="px-6 py-2 bg-white text-black font-semibold rounded-lg hover:bg-blue-200 transition-colors"
            variant="default"
          >
            Submit Preferences
          </Button>
        </div>
      </div>
    </section>
  );
}



// 'use client';

// import React, { useState, useCallback } from 'react';
// import { useSession } from 'next-auth/react'; // To get user session
// import { Button } from '@/components/ui/button'; // Assuming you have a Button component

// export default function Categories() {
//   const { data: session } = useSession(); // Get the user's session
//   const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
//   const [searchTerm, setSearchTerm] = useState<string>("");

//   const categories = [
//     { name: "Sports", src: "https://i.postimg.cc/76FFhWHR/Sports.jpg" },
//     { name: "Politics", src: "https://i.postimg.cc/tCZLWyZM/Politics.jpg" },
//     { name: "Food", src: "https://i.postimg.cc/ZqMttq14/Food.jpg" },
//     { name: "Crime", src: "https://i.postimg.cc/x1gV555k/Crime.jpg" },
//     { name: "Technology", src: "https://i.postimg.cc/nrTN2cKy/Technology.jpg" },
//     { name: "Entertainment", src: "https://i.postimg.cc/sDYrQsZ4/Entertainment.jpg" },
//     { name: "Finance", src: "https://i.postimg.cc/43dkSc2W/Finance.jpg" },
//     { name: "Health", src: "https://i.postimg.cc/vBxRQss9/Health.jpg" },
//     { name: "Tourism", src: "https://i.postimg.cc/xjRrntr6/Tourism.jpg" },
//     { name: "Education", src: "https://i.postimg.cc/Z5Jh628t/Education.jpg" },
//     { name: "Business", src: "https://i.postimg.cc/4NkGxmn3/Business.jpg" },
//     { name: "Lifestyle", src: "https://i.postimg.cc/MH1hQmXp/Lifestyle.jpg" }
//   ];

  

//   const toggleCategory = useCallback((categoryName: string) => {
//     setSelectedCategories(prevSelected => {
//       if (prevSelected.includes(categoryName)) {
//         return prevSelected.filter(c => c !== categoryName);
//       } else {
//         return [...prevSelected, categoryName];
//       }
//     });
//   }, []);

//   const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setSearchTerm(e.target.value);
//   };

//   const filteredCategories = categories.filter(category =>
//     category.name.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const handleSubmit = async () => {
//     if (session?.user?.id) { // Now session.user.id should be available
//       try {
//         const response = await fetch(`https://globalbuzz.azurewebsites.net/admin/users/${session.user.id}`, {
//           method: "PATCH",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({ categoryNames: selectedCategories }),
//         });
  
//         if (!response.ok) {
//           throw new Error("Failed to update categories");
//         }
  
//         console.log("Categories updated successfully");
//       } catch (error) {
//         console.error("Error updating categories:", error);
//       }
//     } else {
//       console.error("User is not logged in");
//     }
//   };
  
  
  
//   return (
//     <section className="w-full py-16 bg-black">
//       <div className="container grid gap-8 px-4 md:px-6">
//         <div className="flex flex-col items-center justify-center space-y-4 text-center -mt-8">
//           <div className="space-y-4">
//             <h1 className="text-3xl font-bold tracking-tighter text-white sm:text-4xl md:text-5xl">
//               Choose Your Interests
//             </h1>
//             <p className="max-w-[700px] text-slate-200 text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
//               Select the categories you're most interested in to personalize your newsletter experience.
//             </p>
//           </div>
//         </div>

//         <div className="flex justify-center mt-8">
//           <input
//             type="text"
//             value={searchTerm}
//             onChange={handleSearch}
//             placeholder="Search categories..."
//             className="px-4 py-2 w-full max-w-md rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
//           />
//         </div>

//         <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 mt-4">
//           {filteredCategories.map((category) => (
//             <div
//               key={category.name}
//               onClick={() => toggleCategory(category.name)}
//               className={`relative group rounded-lg overflow-hidden shadow-lg cursor-pointer ${
//                 selectedCategories.includes(category.name) ? "ring-2 ring-white ring-opacity-100" : ""
//               }`}
//             >
//               <img
//                 src={category.src}
//                 alt={category.name}
//                 width={300}
//                 height={200}
//                 className="w-full h-48 object-cover group-hover:opacity-80 transition-opacity"
//                 style={{ aspectRatio: "300/200", objectFit: "cover" }}
//               />
//               <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-semibold text-lg transition-colors group-hover:bg-black/30">
//                 {category.name}
//               </div>
//             </div>
//           ))}
//         </div>

//         <div className="flex justify-center mt-8">
//           <Button
//             onClick={handleSubmit}
//             className="px-6 py-2 bg-white text-black font-semibold rounded-lg hover:bg-blue-200 transition-colors"
//             variant="default"
//           >
//             Submit Preferences
//           </Button>
//         </div>
//       </div>
//     </section>
//   );
// }
