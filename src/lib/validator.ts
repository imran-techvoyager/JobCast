export const validatePhoneNumber = (phone: string) => 
  /^\+91[6-9]\d{9}$/.test(phone);

export const validateCategory = (category: string): category is 'frontend' | 'backend' => 
  ['frontend', 'backend'].includes(category);

export const validateRequest = async (req: Request) => {
  if (!req.headers.get('content-type')?.includes('application/json')) {
    console.log("hii");
    return { valid: false, error: 'Invalid content type' };
  }
  
  try {
    await req.json();
    return { valid: true };
  } catch {
    return { valid: false, error: 'Invalid JSON' };
  }
};