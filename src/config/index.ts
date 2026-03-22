// import dotenv from "dotenv";
// import path from "path";

// dotenv.config({ path: path.join(process.cwd(), ".env") });

// export default {
//   port: process.env.PORT || 5000,
//   database_url: process.env.MONGODB_URI,
//   bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS || 12,
//   jwt_secret: process.env.JWT_SECRET,
//   jwt_expires_in: process.env.JWT_EXPIRES_IN,
//   gemini_api_key: process.env.GEMINI_API_KEY,
// };

import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export default {
  // Server
  port: process.env.PORT || 5000,
  // Database
  database_url: process.env.MONGODB_URI,
  // Bcrypt
  bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS || 12,
  // JWT
  jwt_secret: process.env.JWT_SECRET,
  jwt_expires_in: process.env.JWT_EXPIRES_IN || "15m",
  jwt_refresh_secret: process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
  jwt_refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
  // URLs
  client_url: process.env.CLIENT_URL || "http://localhost:3000",
  server_url: process.env.SERVER_URL || "http://localhost:5000",
  // Google OAuth
  google_client_id: process.env.GOOGLE_CLIENT_ID,
  google_client_secret: process.env.GOOGLE_CLIENT_SECRET,
  // AI (optional)
  gemini_api_key: process.env.GEMINI_API_KEY,
};
