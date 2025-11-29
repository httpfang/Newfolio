/**
 * Email Service
 * Handles sending emails via Web3Forms API
 */

export interface ContactFormData {
  firstName: string;
  lastName: string;
  service: string;
  email: string;
  description: string;
}

export interface EmailResponse {
  success: boolean;
  message: string;
}

/**
 * Sends an email using Web3Forms API
 * @param formData - The contact form data
 * @returns Promise with success status and message
 */
export async function sendContactEmail(
  formData: ContactFormData
): Promise<EmailResponse> {
  const accessKey =
    import.meta.env.VITE_WEB3FORMS_ACCESS_KEY || "YOUR_ACCESS_KEY_HERE";

  // Validate access key
  if (!accessKey || accessKey === "YOUR_ACCESS_KEY_HERE") {
    return {
      success: false,
      message:
        "Email service not configured. Please set up your Web3Forms access key.",
    };
  }

  // Note: Form validation is handled in the Contact component
  // This service assumes valid data is passed

  try {
    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        access_key: accessKey,
        subject: `New Contact Form Submission - ${
          formData.service || "General Inquiry"
        }`,
        from_name:
          `${formData.firstName} ${formData.lastName}`.trim() ||
          "Portfolio Visitor",
        email: formData.email,
        message: `
Service: ${formData.service || "Not specified"}
Email: ${formData.email}
Name: ${formData.firstName} ${formData.lastName}

Project Description:
${formData.description}
        `.trim(),
      }),
    });

    const result = await response.json();

    if (result.success) {
      return {
        success: true,
        message: "Thank you! Your message has been sent successfully.",
      };
    } else {
      return {
        success: false,
        message: result.message || "Failed to send message. Please try again.",
      };
    }
  } catch (error) {
    console.error("Email sending error:", error);
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again later.",
    };
  }
}

