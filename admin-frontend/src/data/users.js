// Users Data with Indian Names
const indianNames = [
  "Rohan", "Sneha", "Ganesh", "Kavya", "Karthik", "Asha", "Darshan", "Lakshmi", "Prakash", "Shruthi",
  "Harish", "Nandini", "Rahul", "Shobha", "Vivek", "Ramya", "Sagar", "Pooja", "Mahesh", "Rekha",
  "Nikhil", "Anusha", "Vinay", "Divya", "Pradeep", "Aishwarya", "Ajay", "Bhavana", "Tejas", "Deepa",
  "Suraj", "Shilpa", "Kiran", "Sandhya", "Rohit", "Meena", "Manoj", "Kavitha", "Sandeep", "Geetha",
  "Varun", "Radhika", "Ramesh", "Swathi", "Vijay", "Chaitra", "Santosh", "Madhuri", "Umesh", "Sahana",
  "Abhishek", "Rashmi", "Arun", "Megha", "Akash", "Neha", "Deepak", "Nisha", "Harsha", "Padmini",
  "Naveen", "Jayashree", "Sachin", "Sudha", "Sameer", "Padma", "Akshay", "Bhavya", "Yash", "Vaishnavi",
  "Shreyas", "Archana", "Darshith", "Namitha", "Rithesh", "Aditi", "Aryan", "Keerthi", "Kishore", "Hema",
  "Mahendra", "Lalitha", "Rakesh", "Renuka", "Pavan", "Revathi", "Shivanand", "Komala", "Jayaram", "Kusuma",
  "Dayanand", "Sumathi", "Vishal", "Pavithra", "Lokesh", "Manasa", "Gopal", "Harini", "Narayan", "Raksha",
  "Pranav", "Ananya", "Aditya", "Shreya", "Keshav", "Sunitha", "Ajith", "Reshma", "Raghav", "Vidya",
  "Mohan", "Yamuna", "Shankar", "Kalpana", "Madhav", "Leela", "Anand", "Mohini", "Jagadish", "Nalini",
  "Venkatesh", "Savitha", "Nagesh", "Prema", "Manjunath", "Sushma", "Girish", "Sumana", "Satish", "Sujatha",
  "Dinesh", "Indira", "Naresh", "Savitri", "Lokanath", "Shanta", "Sharan", "Sudeshna", "Raghunath", "Chitra",
  "Krishna", "Gauri", "Balakrishna", "Kamala", "Devraj", "Varsha", "Uday", "Bhargavi", "Rajendra", "Amrutha",
  "Chandrashekhar", "Sangeetha", "Sudhir", "Malathi", "Bhaskar", "Sunanda", "Shridhar", "Apeksha", "Padmanabha", "Deepika",
  "Vithal", "Manjula", "Jagannath", "Shanthi", "Devdas", "Nirmala", "Prithviraj", "Anjali", "Raghuram", "Kavya Rani",
  "Gautham", "Rakhi", "Abhay", "Shashikala", "Pruthvi", "Usha", "Tarun", "Sangeeta", "Roshan", "Bhavana Rani",
  "Tejaswini", "Hariprasad", "Jayalakshmi", "Nithin", "Rohini", "Kaveri", "Sagarika", "Loknath", "Sharmila", "Vinitha",
  "Devika", "Raghu", "Sushila", "Yashaswini", "Mahabala", "Aarti", "Krupa", "Pankaj", "Priya", "Riya"
];

const lastNames = [
  "Sharma", "Patel", "Singh", "Gupta", "Verma", "Kumar", "Rao", "Nair",
  "Reddy", "Mishra", "Chopra", "Bhat", "Iyer", "Menon", "Kapoor", "Malik",
  "Khan", "Ahmed", "Hassan", "Desai", "Jain", "Agarwal", "Bhatnagar", "Sinha",
  "Yadav", "Saxena", "Trivedi", "Pandey", "Dwivedi", "Chakraborty", "Banerjee",
  "Mukherjee", "Roy", "Das", "Ghosh", "Bose", "Dey", "Chatterjee"
];

const cities = [
  "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai", "Kolkata",
  "Pune", "Ahmedabad", "Jaipur", "Lucknow", "Kanpur", "Nagpur",
  "Indore", "Thane", "Bhopal", "Visakhapatnam", "Pimpri-Chinchwad",
  "Patna", "Vadodara", "Ghaziabad", "Ludhiana", "Agra", "Nashik"
];

const domains = ['gmail.com', 'yahoo.com', 'outlook.com', 'email.com', 'fixora.com'];

// Helper functions
const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];

const getRandomEmail = (firstName, lastName) => {
  const baseEmail = `${firstName.toLowerCase().replace(/\s+/g, '')}.${lastName.toLowerCase()}`;
  const domain = getRandomElement(domains);
  const randomNum = Math.floor(Math.random() * 9999);
  return randomNum > 0 ? `${baseEmail}${randomNum}@${domain}` : `${baseEmail}@${domain}`;
};

const getRandomPhone = () => {
  const prefix = ['98', '97', '96', '95', '94'];
  const selectedPrefix = getRandomElement(prefix);
  const remainingDigits = Math.floor(Math.random() * 100000000).toString().padStart(8, '0');
  return selectedPrefix + remainingDigits;
};

const getRandomDate = (startYear = 2024, endYear = 2026) => {
  const start = new Date(startYear, 0, 1);
  const end = new Date(endYear, 11, 31);
  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return date.toISOString().split('T')[0];
};

// Generate 85 users using provided names
export const users = [];

for (let i = 1; i <= 85; i++) {
  const firstName = indianNames[(i - 1) % indianNames.length];
  const lastName = getRandomElement(lastNames);
  
  const isProvider = Math.random() > 0.75;
  const status = (() => {
    const rand = Math.random();
    if (rand < 0.85) return 'active';
    if (rand < 0.95) return 'blocked';
    return 'pending';
  })();

  users.push({
    id: `USR${String(i).padStart(4, '0')}`,
    name: `${firstName} ${lastName}`,
    gender: Math.random() > 0.5 ? 'Male' : 'Female',
    email: getRandomEmail(firstName, lastName),
    phone: getRandomPhone(),
    city: getRandomElement(cities),
    role: isProvider ? 'service_provider' : 'user',
    status: status,
    joinedDate: getRandomDate(2023, 2026),
    bookings: Math.floor(Math.random() * 50),
    rating: (Math.random() * 5).toFixed(1)
  });
}

export default users;
