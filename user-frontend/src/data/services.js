
// MOST BOOKED
import img1 from "../assets/Full-Home-cleaning.jpg";
import img2 from "../assets/AC-Repair-Works.jpg";
import img3 from "../assets/Men-Haircut.jpg";
import img4 from "../assets/Women-Haircut.jpg";
import img5 from "../assets/Electrician-Repair.jpg";

// TOP LOVED
import img6 from "../assets/Bathroom-Cleaning.jpg";
import img7 from "../assets/AC-Gas-Refill.jpg";
import img8 from "../assets/Beard-Styling.jpg";
import img9 from "../assets/Saloon.jpg";
import img10 from "../assets/Switch-Board.jpg";

// POPULAR HOME
import img11 from "../assets/Sofa-Cleaning.jpg";
import img12 from "../assets/Washing-Machine-Repair.jpg";
import img13 from "../assets/Hair-Spa.jpg";
import img14 from "../assets/Fan-Installation.jpg";
import img15 from "../assets/Kitchen-Cleaning.jpg";

// WOMEN SALON
import img16 from "../assets/Women-Haircut-Styling.jpg";
import img17 from "../assets/Facial-Clean-up.jpg";
import img18 from "../assets/Waxing-Threading.jpg";
import img19 from "../assets/Hair-Spa-Treatment.jpg";
import img20 from "../assets/Bridal-Beauty.jpg";

// MEN SALON
import img21 from "../assets/Haircut-for-men.jpg";
import img22 from "../assets/Beard-Trim.jpg";
import img23 from "../assets/Hair-Scalp-Treatment.jpg";
import img24 from "../assets/Facial-for-men.jpg";
import img25 from "../assets/Grooming-Package.jpg";

export const services = [
  // MOST BOOKED SERVICES
  {
    id: 1,
    name: "Full Home Cleaning",
    title: "Full Home Cleaning",
    description: "Professional deep cleaning for your entire home including kitchen, bathrooms and furniture surfaces.",
    price: 449,
    rating: 4.8,
    reviews: "42k",
    duration: "3 hrs",
    availableDays: "Mon - Sun",
    timing: "8:00 AM - 6:00 PM",
    category: "cleaning",
    experience: [
      "Eco friendly cleaning chemicals",
      "Trained cleaning professionals",
      "Modern cleaning machines",
      "Safe for kids & pets",
    ],
    image: img1,
    images: [img1, img1, img1],
  },
  {
    id: 2,
    name: "AC Service & Repair",
    title: "AC Service & Repair",
    description: "Complete AC cleaning and gas pressure check to ensure optimal cooling and longer appliance life.",
    price: 898,
    rating: 4.8,
    reviews: "31k",
    duration: "45 mins",
    availableDays: "Mon - Sun",
    timing: "8:00 AM - 8:00 PM",
    category: "appliance",
    experience: [
      "Certified AC technicians",
      "High pressure jet cleaning",
      "Gas pressure inspection",
      "90 day service warranty",
    ],
    image: img2,
    images: [img2, img2, img2],
  },
  {
    id: 3,
    name: "Haircut for Men",
    title: "Haircut for Men",
    description: "Professional men's haircut with expert styling and finishing.",
    price: 259,
    rating: 4.87,
    reviews: "25k",
    duration: "30 mins",
    availableDays: "Mon - Sun",
    timing: "10:00 AM - 8:00 PM",
    category: "salon",
    experience: [
      "Expert male stylists",
      "Premium hair products",
      "Latest haircut trends",
      "Personalized styling",
    ],
    image: img3,
    images: [img3, img3, img3],
  },
  {
    id: 4,
    name: "Haircut for Women",
    title: "Haircut for Women",
    description: "Professional women's haircut with expert cuts and styling.",
    price: 450,
    rating: 4.77,
    reviews: "28k",
    duration: "45 mins",
    availableDays: "Mon - Sun",
    timing: "10:00 AM - 8:00 PM",
    category: "salon",
    experience: [
      "Expert female stylists",
      "Premium hair products",
      "Trending cuts & styles",
      "Professional finishing",
    ],
    image: img4,
    images: [img4, img4, img4],
  },
  {
    id: 5,
    name: "Electrician Visit",
    title: "Electrician Visit",
    description: "Professional electrician service for fixing wiring issues, switches, fans, lights and appliances.",
    price: 250,
    rating: 4.73,
    reviews: "22k",
    duration: "30 mins",
    availableDays: "Mon - Sat",
    timing: "9:00 AM - 7:00 PM",
    category: "electrical",
    experience: [
      "Certified electricians",
      "Quick fault detection",
      "Safe wiring practices",
      "Affordable service charges",
    ],
    image: img5,
    images: [img5, img5, img5],
  },

  // TOP LOVED SERVICES
  {
    id: 6,
    name: "Bathroom Deep Cleaning",
    title: "Bathroom Deep Cleaning",
    description: "Professional deep cleaning of bathroom including tiles, fixtures and sanitization.",
    price: 499,
    rating: 4.9,
    reviews: "35k",
    duration: "1.5 hrs",
    availableDays: "Mon - Sun",
    timing: "8:00 AM - 7:00 PM",
    category: "cleaning",
    experience: [
      "Deep sanitization",
      "Stain removal",
      "Fixture polishing",
      "Eco-friendly products",
    ],
    image: img6,
    images: [img6, img6, img6],
  },
  {
    id: 7,
    name: "AC Gas Refill",
    title: "AC Gas Refill",
    description: "AC refrigerant gas refill and pressure check for optimal cooling performance.",
    price: 1299,
    rating: 4.8,
    reviews: "18k",
    duration: "1 hr",
    availableDays: "Mon - Sun",
    timing: "9:00 AM - 7:00 PM",
    category: "appliance",
    experience: [
      "Original AC gas",
      "Pressure testing",
      "Leak detection",
      "Warranty coverage",
    ],
    image: img7,
    images: [img7, img7, img7],
  },
  {
    id: 8,
    name: "Beard Styling",
    title: "Beard Styling",
    description: "Expert beard trimming, shaping and styling for a polished look.",
    price: 199,
    rating: 4.7,
    reviews: "15k",
    duration: "30 mins",
    availableDays: "Mon - Sun",
    timing: "10:00 AM - 8:00 PM",
    category: "salon",
    experience: [
      "Expert beard stylists",
      "Premium grooming products",
      "Latest beard trends",
      "Personalized shaping",
    ],
    image: img8,
    images: [img8, img8, img8],
  },
  {
    id: 9,
    name: "Salon at Home",
    title: "Salon at Home",
    description: "Complete salon services at your home - haircut, styling and treatments.",
    price: 599,
    rating: 4.8,
    reviews: "20k",
    duration: "2 hrs",
    availableDays: "Mon - Sun",
    timing: "10:00 AM - 7:00 PM",
    category: "salon",
    experience: [
      "Professional stylists",
      "Premium products",
      "Convenient home service",
      "Customized treatments",
    ],
    image: img9,
    images: [img9, img9, img9],
  },
  {
    id: 10,
    name: "Switch & Socket Repair",
    title: "Switch & Socket Repair",
    description: "Electrical switch and socket repair, replacement and installation.",
    price: 149,
    rating: 4.6,
    reviews: "12k",
    duration: "30 mins",
    availableDays: "Mon - Sat",
    timing: "9:00 AM - 6:00 PM",
    category: "electrical",
    experience: [
      "Certified technicians",
      "Quality switches",
      "Safe installation",
      "Quick service",
    ],
    image: img10,
    images: [img10, img10, img10],
  },

  // POPULAR HOME SERVICES
  {
    id: 11,
    name: "Sofa & Carpet Cleaning",
    title: "Sofa & Carpet Cleaning",
    description: "Professional deep cleaning of sofas, carpets and upholstered furniture.",
    price: 699,
    rating: 4.9,
    reviews: "32k",
    duration: "2 hrs",
    availableDays: "Mon - Sun",
    timing: "8:00 AM - 6:00 PM",
    category: "cleaning",
    experience: [
      "Professional equipment",
      "Stain removal",
      "Fabric care",
      "Odor elimination",
    ],
    image: img11,
    images: [img11, img11, img11],
  },
  {
    id: 12,
    name: "Washing Machine Repair",
    title: "Washing Machine Repair",
    description: "Complete inspection and repair of washing machine including motor, drum and water leakage issues.",
    price: 399,
    rating: 4.8,
    reviews: "18k",
    duration: "1 hr",
    availableDays: "Mon - Sun",
    timing: "9:00 AM - 7:00 PM",
    category: "appliance",
    experience: [
      "Expert washing machine technicians",
      "Repair for all brands",
      "Quick diagnosis & repair",
      "30 day repair warranty",
    ],
    image: img12,
    images: [img12, img12, img12],
  },
  {
    id: 13,
    name: "Hair Spa at Home",
    title: "Hair Spa at Home",
    description: "Relaxing and rejuvenating hair spa treatment in the comfort of your home.",
    price: 799,
    rating: 4.7,
    reviews: "14k",
    duration: "1.5 hrs",
    availableDays: "Mon - Sun",
    timing: "10:00 AM - 7:00 PM",
    category: "salon",
    experience: [
      "Premium hair products",
      "Professional therapists",
      "Relaxing treatment",
      "Hair nourishment",
    ],
    image: img13,
    images: [img13, img13, img13],
  },
  {
    id: 14,
    name: "Fan Installation",
    title: "Fan Installation",
    description: "Installation of ceiling and pedestal fans with electrical safety checks.",
    price: 249,
    rating: 4.6,
    reviews: "11k",
    duration: "45 mins",
    availableDays: "Mon - Sat",
    timing: "9:00 AM - 6:00 PM",
    category: "electrical",
    experience: [
      "Expert installation",
      "Safety checks",
      "Quality fans",
      "Warranty coverage",
    ],
    image: img14,
    images: [img14, img14, img14],
  },
  {
    id: 15,
    name: "Kitchen Deep Cleaning",
    title: "Kitchen Deep Cleaning",
    description: "Professional deep cleaning of kitchen including appliances and surfaces.",
    price: 999,
    rating: 4.8,
    reviews: "24k",
    duration: "2 hrs",
    availableDays: "Mon - Sun",
    timing: "8:00 AM - 6:00 PM",
    category: "cleaning",
    experience: [
      "Appliance cleaning",
      "Grease removal",
      "Cabinet polishing",
      "Eco-friendly products",
    ],
    image: img15,
    images: [img15, img15, img15],
  },

  // WOMEN SALON SERVICES
  {
    id: 16,
    name: "Women Haircut & Styling",
    title: "Women Haircut & Styling",
    description: "Professional women's haircut with expert styling and color treatments.",
    price: 499,
    rating: 4.9,
    reviews: "26k",
    duration: "1 hr",
    availableDays: "Mon - Sun",
    timing: "10:00 AM - 8:00 PM",
    category: "salon",
    experience: [
      "Expert stylists",
      "Premium products",
      "Trending styles",
      "Color treatments",
    ],
    image: img16,
    images: [img16, img16, img16],
  },
  {
    id: 17,
    name: "Facial & Clean-up",
    title: "Facial & Clean-up",
    description: "Professional facial and skin cleanup for glowing and clean skin.",
    price: 699,
    rating: 4.8,
    reviews: "19k",
    duration: "1 hr",
    availableDays: "Mon - Sun",
    timing: "10:00 AM - 8:00 PM",
    category: "salon",
    experience: [
      "Professional beauticians",
      "Premium skincare",
      "Deep cleansing",
      "Skin brightening",
    ],
    image: img17,
    images: [img17, img17, img17],
  },
  {
    id: 18,
    name: "Waxing & Threading",
    title: "Waxing & Threading",
    description: "Professional waxing and threading services for hair removal.",
    price: 399,
    rating: 4.7,
    reviews: "17k",
    duration: "45 mins",
    availableDays: "Mon - Sun",
    timing: "10:00 AM - 8:00 PM",
    category: "salon",
    experience: [
      "Expert technicians",
      "Painless procedures",
      "Aftercare products",
      "Long-lasting results",
    ],
    image: img18,
    images: [img18, img18, img18],
  },
  {
    id: 19,
    name: "Hair Spa & Treatment",
    title: "Hair Spa & Treatment",
    description: "Premium hair spa and treatment services for healthy and shiny hair.",
    price: 999,
    rating: 4.8,
    reviews: "21k",
    duration: "1.5 hrs",
    availableDays: "Mon - Sun",
    timing: "10:00 AM - 7:00 PM",
    category: "salon",
    experience: [
      "Professional therapists",
      "Premium treatments",
      "Hair nourishment",
      "Long-term benefits",
    ],
    image: img19,
    images: [img19, img19, img19],
  },
  {
    id: 20,
    name: "Bridal Beauty Package",
    title: "Bridal Beauty Package",
    description: "Complete bridal beauty package including makeup, hairdo and skin treatment.",
    price: 2499,
    rating: 4.9,
    reviews: "9k",
    duration: "3 hrs",
    availableDays: "Mon - Sun",
    timing: "8:00 AM - 8:00 PM",
    category: "salon",
    experience: [
      "Expert bridal makeup",
      "Hairstyling",
      "Skin treatment",
      "Professional coordination",
    ],
    image: img20,
    images: [img20, img20, img20],
  },

  // MEN SALON SERVICES
  {
    id: 21,
    name: "Haircut for Men",
    title: "Haircut for Men",
    description: "Professional men's haircut with expert fade and styling.",
    price: 259,
    rating: 4.8,
    reviews: "25k",
    duration: "30 mins",
    availableDays: "Mon - Sun",
    timing: "10:00 AM - 8:00 PM",
    category: "salon",
    experience: [
      "Expert male stylists",
      "Premium products",
      "Trendy cuts",
      "Personalized service",
    ],
    image: img21,
    images: [img21, img21, img21],
  },
  {
    id: 22,
    name: "Beard Trim & Styling",
    title: "Beard Trim & Styling",
    description: "Professional beard trimming, shaping and styling with grooming products.",
    price: 199,
    rating: 4.7,
    reviews: "16k",
    duration: "30 mins",
    availableDays: "Mon - Sun",
    timing: "10:00 AM - 8:00 PM",
    category: "salon",
    experience: [
      "Expert barbers",
      "Premium beard care",
      "Latest trends",
      "Personalized shaping",
    ],
    image: img22,
    images: [img22, img22, img22],
  },
  {
    id: 23,
    name: "Hair & Scalp Treatment",
    title: "Hair & Scalp Treatment",
    description: "Professional hair and scalp treatment for healthy hair growth.",
    price: 699,
    rating: 4.8,
    reviews: "13k",
    duration: "1 hr",
    availableDays: "Mon - Sun",
    timing: "10:00 AM - 7:00 PM",
    category: "salon",
    experience: [
      "Scalp analysis",
      "Professional treatment",
      "Hair strengthening",
      "Customized solutions",
    ],
    image: img23,
    images: [img23, img23, img23],
  },
  {
    id: 24,
    name: "Facial for Men",
    title: "Facial for Men",
    description: "Professional facial and grooming treatment specially designed for men.",
    price: 599,
    rating: 4.6,
    reviews: "10k",
    duration: "1 hr",
    availableDays: "Mon - Sun",
    timing: "10:00 AM - 8:00 PM",
    category: "salon",
    experience: [
      "Professional beauticians",
      "Men's skincare",
      "Deep cleansing",
      "Grooming products",
    ],
    image: img24,
    images: [img24, img24, img24],
  },
  {
    id: 25,
    name: "Complete Grooming Package",
    title: "Complete Grooming Package",
    description: "Complete grooming package including haircut, beard trim, and facial.",
    price: 1299,
    rating: 4.9,
    reviews: "12k",
    duration: "2 hrs",
    availableDays: "Mon - Sun",
    timing: "10:00 AM - 8:00 PM",
    category: "salon",
    experience: [
      "Comprehensive grooming",
      "Expert stylists",
      "Premium products",
      "Complete transformation",
    ],
    image: img25,
    images: [img25, img25, img25],
  },

  {
  id: 26,
  name: "Full Body Massage",
  title: "Full Body Massage",
  description: "Relaxing full body massage by trained professionals.",
  price: 799,
  rating: 4.7,
  reviews: "12k",
  duration: "60 mins",
  availableDays: "Mon - Sun",
  timing: "10:00 AM - 8:00 PM",
  category: "massage-men",
  experience: [
    "Professional therapists",
    "Relaxing oils",
    "Stress relief",
    "Comfortable setup"
  ],
  image: img8,
  images: [img8, img8, img8]
},

{
  id: 27,
  name: "Head & Shoulder Massage",
  title: "Head & Shoulder Massage",
  description: "Relaxing massage for head and shoulders.",
  price: 399,
  rating: 4.6,
  reviews: "8k",
  duration: "30 mins",
  availableDays: "Mon - Sun",
  timing: "10:00 AM - 8:00 PM",
  category: "massage-men",
  experience: [
    "Professional therapists",
    "Relaxing oils",
    "Stress relief"
  ],
  image: img9,
  images: [img9, img9, img9]
},

{
  id: 28,
  name: "Women Haircut & Styling",
  title: "Women Haircut & Styling",
  description: "Professional haircut and styling service by expert stylists.",
  price: 499,
  rating: 4.8,
  reviews: "21k",
  duration: "45 mins",
  availableDays: "Mon - Sun",
  timing: "10:00 AM - 8:00 PM",
  category: "salon-women",
  experience: [
    "Professional stylists",
    "Premium hair products",
    "Latest haircut trends",
    "Hygienic tools"
  ],
  image: img16,
  images: [img16, img16, img16]
},

{
  id: 29,
  name: "Facial & Clean-up",
  title: "Facial & Clean-up",
  description: "Professional facial treatment for glowing skin.",
  price: 699,
  rating: 4.7,
  reviews: "15k",
  duration: "60 mins",
  availableDays: "Mon - Sun",
  timing: "10:00 AM - 8:00 PM",
  category: "salon-women",
  experience: [
    "Skin analysis",
    "Deep cleansing",
    "Premium facial products",
    "Relaxing treatment"
  ],
  image: img17,
  images: [img17, img17, img17]
},

{
  id: 30,
  name: "Waxing & Threading",
  title: "Waxing & Threading",
  description: "Professional waxing and threading services.",
  price: 399,
  rating: 4.6,
  reviews: "12k",
  duration: "45 mins",
  availableDays: "Mon - Sun",
  timing: "10:00 AM - 8:00 PM",
  category: "salon-women",
  experience: [
    "Experienced beauticians",
    "Hygienic waxing products",
    "Quick and painless service",
    "Skin-friendly products"
  ],
  image: img18,
  images: [img18, img18, img18]
},

{
  id: 31,
  name: "Hair Spa Treatment",
  title: "Hair Spa Treatment",
  description: "Deep conditioning hair spa for smooth and healthy hair.",
  price: 999,
  rating: 4.9,
  reviews: "18k",
  duration: "75 mins",
  availableDays: "Mon - Sun",
  timing: "10:00 AM - 8:00 PM",
  category: "salon-women",
  experience: [
    "Premium hair spa products",
    "Relaxing head massage",
    "Hair nourishment",
    "Expert stylists"
  ],
  image: img19,
  images: [img19, img19, img19]
},

{
  id: 32,
  name: "AC General Service",
  title: "AC General Service",
  description: "Complete AC inspection, filter cleaning and cooling check for optimal performance.",
  price: 499,
  rating: 4.8,
  reviews: "29k",
  duration: "45 mins",
  availableDays: "Mon - Sun",
  timing: "9:00 AM - 8:00 PM",
  category: "ac",
  experience: [
    "Certified AC technicians",
    "Cooling performance check",
    "Filter cleaning",
    "30 day service warranty"
  ],
  image: img2,
  images: [img2, img2, img2]
},

{
  id: 33,
  name: "AC Deep Cleaning",
  title: "AC Deep Cleaning",
  description: "Deep jet cleaning of AC unit including condenser and cooling coils.",
  price: 799,
  rating: 4.9,
  reviews: "18k",
  duration: "60 mins",
  availableDays: "Mon - Sun",
  timing: "9:00 AM - 8:00 PM",
  category: "ac",
  experience: [
    "High pressure jet cleaning",
    "Dust and bacteria removal",
    "Improves cooling efficiency",
    "Professional technicians"
  ],
  image: img7,
  images: [img7, img7, img7]
},

{
  id: 34,
  name: "AC Gas Refill",
  title: "AC Gas Refill",
  description: "AC refrigerant gas refill with pressure testing and leak detection.",
  price: 1299,
  rating: 4.7,
  reviews: "15k",
  duration: "60 mins",
  availableDays: "Mon - Sun",
  timing: "9:00 AM - 7:00 PM",
  category: "ac",
  experience: [
    "Original AC gas",
    "Pressure testing",
    "Leak detection",
    "90 day warranty"
  ],
  image: img7,
  images: [img7, img7, img7]
},

{
  id: 35,
  name: "AC Installation",
  title: "AC Installation",
  description: "Professional AC installation service for split and window AC units.",
  price: 1499,
  rating: 4.8,
  reviews: "10k",
  duration: "2 hrs",
  availableDays: "Mon - Sat",
  timing: "9:00 AM - 6:00 PM",
  category: "ac",
  experience: [
    "Expert installation",
    "Safe wiring setup",
    "Performance testing",
    "Professional technicians"
  ],
  image: img2,
  images: [img2, img2, img2]
},

{
  id: 36,
  name: "AC Repair & Diagnosis",
  title: "AC Repair & Diagnosis",
  description: "Complete AC repair and issue diagnosis by certified professionals.",
  price: 399,
  rating: 4.6,
  reviews: "12k",
  duration: "45 mins",
  availableDays: "Mon - Sun",
  timing: "9:00 AM - 8:00 PM",
  category: "ac",
  experience: [
    "Quick fault detection",
    "Expert technicians",
    "Affordable repair charges",
    "Genuine spare parts"
  ],
  image: img2,
  images: [img2, img2, img2]
},

{
  id: 37,
  name: "Water Purifier Installation",
  title: "Water Purifier Installation",
  description: "Professional installation of RO, UV and water purifier systems.",
  price: 499,
  rating: 4.7,
  reviews: "9k",
  duration: "45 mins",
  availableDays: "Mon - Sun",
  timing: "9:00 AM - 7:00 PM",
  category: "water",
  experience: [
    "Expert technicians",
    "Safe installation",
    "All brands supported",
    "Leak testing included"
  ],
  image: img7,
  images: [img7, img7, img7]
},

{
  id: 38,
  name: "Water Purifier Service",
  title: "Water Purifier Service",
  description: "Complete cleaning and servicing of your water purifier.",
  price: 399,
  rating: 4.8,
  reviews: "7k",
  duration: "30 mins",
  availableDays: "Mon - Sun",
  timing: "9:00 AM - 7:00 PM",
  category: "water",
  experience: [
    "Filter cleaning",
    "Performance check",
    "Professional technicians",
    "Improves water quality"
  ],
  image: img7,
  images: [img7, img7, img7]
},

{
  id: 39,
  name: "RO Filter Replacement",
  title: "RO Filter Replacement",
  description: "Replacement of RO filters and membranes for clean drinking water.",
  price: 899,
  rating: 4.9,
  reviews: "5k",
  duration: "30 mins",
  availableDays: "Mon - Sun",
  timing: "9:00 AM - 7:00 PM",
  category: "water",
  experience: [
    "Original RO filters",
    "Improves purification",
    "Professional technicians",
    "Warranty support"
  ],
  image: img7,
  images: [img7, img7, img7]
},

{
  id: 40,
  name: "Water Purifier Repair",
  title: "Water Purifier Repair",
  description: "Diagnosis and repair of water purifier issues.",
  price: 299,
  rating: 4.6,
  reviews: "4k",
  duration: "30 mins",
  availableDays: "Mon - Sun",
  timing: "9:00 AM - 7:00 PM",
  category: "water",
  experience: [
    "Quick fault detection",
    "All brands supported",
    "Affordable repair charges",
    "Expert technicians"
  ],
  image: img7,
  images: [img7, img7, img7]
},

{
  id: 41,
  name: "Tile Grouting Service",
  title: "Tile Grouting Service",
  description: "Professional tile grouting to fill gaps and restore tile surfaces.",
  price: 799,
  rating: 4.7,
  reviews: "6k",
  duration: "2 hrs",
  availableDays: "Mon - Sat",
  timing: "9:00 AM - 6:00 PM",
  category: "tile",
  experience: [
    "Professional tile experts",
    "High quality grout material",
    "Long lasting finish",
    "Clean and precise work"
  ],
  image: img15,
  images: [img15, img15, img15]
},

{
  id: 42,
  name: "Bathroom Tile Regrouting",
  title: "Bathroom Tile Regrouting",
  description: "Remove old grout and apply fresh grout for bathroom tiles.",
  price: 999,
  rating: 4.8,
  reviews: "4k",
  duration: "3 hrs",
  availableDays: "Mon - Sat",
  timing: "9:00 AM - 6:00 PM",
  category: "tile",
  experience: [
    "Mold resistant grout",
    "Professional finish",
    "Improves bathroom hygiene",
    "Expert technicians"
  ],
  image: img15,
  images: [img15, img15, img15]
},

{
  id: 43,
  name: "Kitchen Tile Grouting",
  title: "Kitchen Tile Grouting",
  description: "Tile joint repair and grout filling for kitchen walls and floors.",
  price: 899,
  rating: 4.6,
  reviews: "3k",
  duration: "2 hrs",
  availableDays: "Mon - Sat",
  timing: "9:00 AM - 6:00 PM",
  category: "tile",
  experience: [
    "Professional tile repair",
    "Durable grout material",
    "Improves tile lifespan",
    "Quick service"
  ],
  image: img15,
  images: [img15, img15, img15]
},

{
  id: 44,
  name: "Floor Tile Gap Repair",
  title: "Floor Tile Gap Repair",
  description: "Fix tile gaps and damaged grout on floors.",
  price: 699,
  rating: 4.5,
  reviews: "2k",
  duration: "1.5 hrs",
  availableDays: "Mon - Sat",
  timing: "9:00 AM - 6:00 PM",
  category: "tile",
  experience: [
    "Expert tile repair",
    "Precision grouting",
    "Improves tile durability",
    "Affordable service"
  ],
  image: img15,
  images: [img15, img15, img15]
},

{
  id: 45,
  name: "Wall Painting (1 Room)",
  title: "Wall Painting (1 Room)",
  description: "Professional wall painting service for one room using premium quality paints.",
  price: 2499,
  rating: 4.8,
  reviews: "9k",
  duration: "5 hrs",
  availableDays: "Mon - Sat",
  timing: "9:00 AM - 6:00 PM",
  category: "painting",
  experience: [
    "Professional painters",
    "Premium wall paints",
    "Smooth finish",
    "Clean workspace after painting"
  ],
  image: img11,
  images: [img11, img11, img11]
},

{
  id: 46,
  name: "Full House Painting",
  title: "Full House Painting",
  description: "Complete interior wall painting service for your entire home.",
  price: 12999,
  rating: 4.9,
  reviews: "5k",
  duration: "2 days",
  availableDays: "Mon - Sat",
  timing: "9:00 AM - 6:00 PM",
  category: "painting",
  experience: [
    "Experienced painters",
    "Premium paint brands",
    "Modern painting equipment",
    "Professional finish"
  ],
  image: img11,
  images: [img11, img11, img11]
},

{
  id: 47,
  name: "Wall Putty & Primer",
  title: "Wall Putty & Primer",
  description: "Wall surface preparation using putty and primer before painting.",
  price: 1999,
  rating: 4.7,
  reviews: "4k",
  duration: "4 hrs",
  availableDays: "Mon - Sat",
  timing: "9:00 AM - 6:00 PM",
  category: "painting",
  experience: [
    "Surface crack repair",
    "Professional putty application",
    "Primer coating",
    "Improves paint durability"
  ],
  image: img11,
  images: [img11, img11, img11]
},

{
  id: 48,
  name: "Exterior Wall Painting",
  title: "Exterior Wall Painting",
  description: "Weather-resistant exterior wall painting for homes and buildings.",
  price: 8999,
  rating: 4.8,
  reviews: "3k",
  duration: "1 day",
  availableDays: "Mon - Sat",
  timing: "9:00 AM - 6:00 PM",
  category: "painting",
  experience: [
    "Weather resistant paints",
    "Professional exterior finish",
    "Long lasting protection",
    "Experienced painters"
  ],
  image: img11,
  images: [img11, img11, img11]
},

{
  id: 49,
  name: "Wallpaper Installation",
  title: "Wallpaper Installation",
  description: "Professional wallpaper installation for living rooms, bedrooms and offices.",
  price: 1999,
  rating: 4.8,
  reviews: "6k",
  duration: "3 hrs",
  availableDays: "Mon - Sat",
  timing: "9:00 AM - 6:00 PM",
  category: "wall",
  experience: [
    "Professional wallpaper installers",
    "Perfect alignment and finish",
    "Premium adhesive materials",
    "Clean installation service"
  ],
  image: img11,
  images: [img11, img11, img11]
},

{
  id: 50,
  name: "Wall Texture Design",
  title: "Wall Texture Design",
  description: "Decorative wall texture designs to give your walls a modern and stylish look.",
  price: 3499,
  rating: 4.9,
  reviews: "3k",
  duration: "4 hrs",
  availableDays: "Mon - Sat",
  timing: "9:00 AM - 6:00 PM",
  category: "wall",
  experience: [
    "Creative wall textures",
    "Modern interior designs",
    "Professional artists",
    "Long lasting finish"
  ],
  image: img11,
  images: [img11, img11, img11]
},

{
  id: 51,
  name: "3D Wall Panel Installation",
  title: "3D Wall Panel Installation",
  description: "Stylish 3D wall panels installation for living rooms and feature walls.",
  price: 4999,
  rating: 4.7,
  reviews: "2k",
  duration: "5 hrs",
  availableDays: "Mon - Sat",
  timing: "9:00 AM - 6:00 PM",
  category: "wall",
  experience: [
    "Premium 3D panels",
    "Modern interior design",
    "Professional installation",
    "Durable wall finish"
  ],
  image: img11,
  images: [img11, img11, img11]
},

{
  id: 52,
  name: "Wall Sticker Installation",
  title: "Wall Sticker Installation",
  description: "Decorative wall stickers and decals installation for bedrooms and kids rooms.",
  price: 899,
  rating: 4.6,
  reviews: "4k",
  duration: "1 hr",
  availableDays: "Mon - Sat",
  timing: "9:00 AM - 6:00 PM",
  category: "wall",
  experience: [
    "Creative wall stickers",
    "Perfect alignment",
    "Safe adhesive materials",
    "Quick installation"
  ],
  image: img11,
  images: [img11, img11, img11]
}

];