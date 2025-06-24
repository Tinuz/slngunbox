import { createThirdwebClient } from "thirdweb";

// Replace this with your client ID string
// refer to https://portal.thirdweb.com/typescript/v5/client on how to get a client ID
const clientId = process.env.NEXT_PUBLIC_TEMPLATE_CLIENT_ID || process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID;

if (!clientId) {
  // During development, use a placeholder to prevent build errors
  // In production, make sure to set the environment variable
  console.warn("No Thirdweb client ID provided. Using placeholder for development.");
}

export const client = createThirdwebClient({
  clientId: clientId || "placeholder-client-id-for-development",
});
