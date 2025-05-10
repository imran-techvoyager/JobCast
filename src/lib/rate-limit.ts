import { RateLimiterMemory } from 'rate-limiter-flexible';

export const rateLimit = (options = { 
  points: 5, 
  duration: 60, 
  blockDuration: 300 
}) => {
  const rateLimiter = new RateLimiterMemory({
    points: options.points,
    duration: options.duration,
    blockDuration: options.blockDuration,
  });

  return {
    check: async (limit: number, key: string) => {
      try {
        await rateLimiter.consume(key, limit);
        return { success: true };
      } catch (err) {
        return { success: false };
      }
    },
  };
};