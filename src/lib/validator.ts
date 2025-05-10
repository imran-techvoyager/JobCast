// lib/validators.ts
import { NextRequest } from "next/server";

// Phone number validation
export const validatePhoneNumber = (phone: string) => 
  /^\+91[6-9]\d{9}$/.test(phone);

// Request validation
export const validateRequest = async (req: NextRequest) => {
  // Check content type
  if (!req.headers.get('content-type')?.includes('application/json')) {
    return { success: false, error: "Invalid content type" };
  }

  try {
    // Verify request body exists
    const body = await req.json();
    if (!body || typeof body !== 'object') {
      return { success: false, error: "Invalid request body" };
    }

    return { success: true };
  } catch (err) {
    return { success: false, error: "Malformed JSON request" };
  }
};

// User validation
export const validateUserCategory = (category: string) => 
  ["frontend", "backend"].includes(category);