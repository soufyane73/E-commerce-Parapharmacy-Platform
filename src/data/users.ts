export interface User {
  id: string;
  email: string;
  password?: string;
  name: string;
  type: "b2c" | "b2b";
  phone?: string;
  address?: string;
  city?: string;
  // B2B specific
  companyName?: string;
  taxId?: string;
  licenseNumber?: string;
}

// Mock users data for demo purposes
export const mockUsers: User[] = [
  {
    id: "user-001",
    email: "sophia.martin@email.com",
    password: "SophiaPass123!",
    name: "Sophia Martin",
    type: "b2c",
    phone: "+212 6 12 34 56 78",
    address: "Avenue Mohammed V, Appartement 5B",
    city: "Casablanca",
  },
  {
    id: "user-002",
    email: "ahmed.khalil@email.com",
    password: "AhmedPass456!",
    name: "Ahmed Khalil",
    type: "b2c",
    phone: "+212 6 98 76 54 32",
    address: "Rue Ghallab, Quartier Hivernage",
    city: "Marrakech",
  },
  {
    id: "user-003",
    email: "pharmacy-alfarabi@example.ma",
    password: "FarAbi2024!",
    name: "Pharmacie Al Farabi",
    type: "b2b",
    phone: "+212 5 22 11 22 33",
    address: "Rue de la Liberté, Centre Commercial Marzane",
    city: "Fez",
    companyName: "Pharmacie Al Farabi SARL",
    taxId: "000000000000001",
    licenseNumber: "PH-FEZ-0001",
  },
  {
    id: "user-004",
    email: "pharma-wellness@pro.ma",
    password: "WellnessAdmin99!",
    name: "Pharma Wellness Plus",
    type: "b2b",
    phone: "+212 5 37 66 77 88",
    address: "Boulevard Zakia Bennani, Immeuble Zaina",
    city: "Rabat",
    companyName: "Pharma Wellness Plus Maroc",
    taxId: "000000000000002",
    licenseNumber: "PH-RBT-0002",
  },
  {
    id: "user-005",
    email: "laetitia.bernard@email.com",
    password: "LaetitiaPass789!",
    name: "Laetitia Bernard",
    type: "b2c",
    phone: "+212 6 55 44 33 22",
    address: "Quartier Gauthier, Villa 42",
    city: "Casablanca",
  },
  {
    id: "user-006",
    email: "clinic-beaumont@pro.ma",
    password: "BeaumontClinic24!",
    name: "Clinic Beaumont",
    type: "b2b",
    phone: "+212 5 23 55 66 77",
    address: "Rue Imam Malik, Bloc A, Aptitude Clinic",
    city: "Tangier",
    companyName: "Clinic Beaumont Medical Services",
    taxId: "000000000000003",
    licenseNumber: "PH-TNG-0003",
  },
];

// Helper function to find user by email
export function findUserByEmail(
  email: string,
): User | undefined {
  return mockUsers.find(
    (user) => user.email.toLowerCase() === email.toLowerCase(),
  );
}

// Helper function to validate user credentials
export function validateCredentials(
  email: string,
  password: string,
): User | null {
  const user = findUserByEmail(email);
  if (user && user.password === password) {
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword as User;
  }
  return null;
}

// Helper function to find user by ID
export function findUserById(id: string): User | undefined {
  return mockUsers.find((user) => user.id === id);
}

// Helper function to get all B2C users
export function getB2CUsers(): User[] {
  return mockUsers.filter((user) => user.type === "b2c");
}

// Helper function to get all B2B users
export function getB2BUsers(): User[] {
  return mockUsers.filter((user) => user.type === "b2b");
}