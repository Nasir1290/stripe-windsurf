import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY must be defined in environment variables');
}

export default {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY as string,
  },
};
