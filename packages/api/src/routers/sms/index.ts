// SMS API Configuration
const SMS_CONFIG = {
  apiUrl: "http://bulksmsbd.net/api/smsapi",
  apiKey: "hFLdNXGsoRZ8LwuVST59", // Set SMS_API_KEY in your .env file (e.g., hFLdNXGsoRZ8LwuVST59)
  senderId: "8809648905738", // OPTIONAL: Add your approved sender ID from BulkSMSBD (e.g., "YourCompany" or "8801XXX"). Leave empty to use default.
  balanceApiUrl: "http://bulksmsbd.net/api/getBalanceApi",
};

// Error code mappings
const SMS_ERROR_CODES: Record<string, string> = {
  "202": "SMS Submitted Successfully",
  "1001": "Invalid Number",
  "1002": "Sender ID not correct/Sender ID is disabled",
  "1003": "Please Required all fields/Contact Your System Administrator",
  "1005": "Internal Error",
  "1006": "Balance Validity Not Available",
  "1007": "Balance Insufficient",
  "1011": "User ID not found",
  "1012": "Masking SMS must be sent in Bengali",
  "1013": "Sender ID has not found Gateway by API key",
  "1014": "Sender Type Name not found using this sender by API key",
  "1015": "Sender ID has not found Any Valid Gateway by API key",
  "1016": "Sender Type Name Active Price Info not found by this sender ID",
  "1017": "Sender Type Name Price Info not found by this sender ID",
  "1018": "The Owner of this account is disabled",
  "1019": "The price of this account is disabled",
  "1020": "The parent of this account is not found",
  "1021": "The parent active price of this account is not found",
  "1031": "Your Account Not Verified, Please Contact Administrator",
  "1032": "IP Not whitelisted",
};

// Generate 6-digit OTP
export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Format phone number for Bangladesh (ensure 88 prefix)
export function formatPhoneNumber(phone: string): string {
  // Remove any spaces, dashes, or special characters
  let cleaned = phone.replace(/[\s-+()]/g, "");

  // If starts with 0, replace with 88
  if (cleaned.startsWith("0")) {
    cleaned = "88" + cleaned.substring(1);
  }

  // If doesn't start with 88, add it
  if (!cleaned.startsWith("88")) {
    cleaned = "88" + cleaned;
  }

  return cleaned;
}

// Send SMS via BulkSMSBD API
export async function sendSMS(phone: string, message: string): Promise<string> {
  console.log("=== SMS Sending Debug ===");
  console.log("Original phone:", phone);

  // Format phone number - ensure it starts with 880
  let formattedPhone = phone.replace(/[^\d]/g, ""); // Remove non-digits

  // Remove leading 0 if present
  if (formattedPhone.startsWith("0")) {
    formattedPhone = formattedPhone.substring(1);
  }

  // Add 880 prefix if not already present
  if (!formattedPhone.startsWith("880")) {
    formattedPhone = `880${formattedPhone}`;
  }

  console.log("Formatted phone:", formattedPhone);

  // URL encode the message
  const encodedMessage = encodeURIComponent(message);
  console.log("Message:", message);
  console.log("Encoded message:", encodedMessage);

  // Build URL - only include senderId if it's not empty
  let url = `${SMS_CONFIG.apiUrl}?api_key=${SMS_CONFIG.apiKey}&type=text&number=${formattedPhone}&message=${encodedMessage}`;

  if (SMS_CONFIG.senderId && SMS_CONFIG.senderId.trim() !== "") {
    url += `&senderid=${SMS_CONFIG.senderId}`;
  }

  console.log("API URL:", url);

  try {
    console.log("Sending request to BulkSMSBD...");
    const response = await fetch(url, {
      method: "GET",
    });

    console.log("Response status:", response.status);
    console.log("Response ok:", response.ok);

    const responseText = await response.text();
    console.log("Response text:", responseText);

    const code = responseText.trim();
    console.log("Response code:", code);

    // Check if SMS was sent successfully
    if (code === "202") {
      console.log("✅ SMS sent successfully!");
      return code;
    }
    return "success";
  } catch (error) {
    return "error";
  }
}

// Check SMS balance
async function checkBalance(): Promise<number> {
  const url = `${SMS_CONFIG.balanceApiUrl}?api_key=${SMS_CONFIG.apiKey}`;

  try {
    const response = await fetch(url, {
      method: "GET",
    });

    const balance = await response.text();
    return parseFloat(balance) || 0;
  } catch (error) {
    throw new Error("Failed to check SMS balance");
  }
}
