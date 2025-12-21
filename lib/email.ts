import { Resend } from "resend";
import { siteConfig } from "./siteConfig";

const resend = new Resend(process.env.RESEND_API_KEY);

interface ContactEmailData {
  name: string;
  email: string;
  phone?: string;
  message: string;
  type: string;
  vehicleTitle?: string;
}

const typeLabels: Record<string, string> = {
  general: "General Inquiry",
  vehicle_inquiry: "Vehicle Inquiry",
  financing: "Financing Request",
  consignment: "Consignment Request",
  sell_your_car: "Sell Your Car",
};

export async function sendContactNotification(data: ContactEmailData) {
  const typeLabel = typeLabels[data.type] || data.type;

  const subject = data.vehicleTitle
    ? `New ${typeLabel}: ${data.vehicleTitle}`
    : `New ${typeLabel} from ${data.name}`;

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #1a1a1a; padding: 20px; text-align: center;">
        <h1 style="color: #d4af37; margin: 0;">${siteConfig.name}</h1>
      </div>

      <div style="padding: 30px; background-color: #f8f8f8;">
        <h2 style="color: #1a1a1a; margin-top: 0;">New ${typeLabel}</h2>

        ${data.vehicleTitle ? `
          <div style="background-color: #fff; padding: 15px; border-left: 4px solid #d4af37; margin-bottom: 20px;">
            <strong>Vehicle:</strong> ${data.vehicleTitle}
          </div>
        ` : ""}

        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #ddd; width: 100px;"><strong>Name:</strong></td>
            <td style="padding: 10px 0; border-bottom: 1px solid #ddd;">${data.name}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #ddd;"><strong>Email:</strong></td>
            <td style="padding: 10px 0; border-bottom: 1px solid #ddd;">
              <a href="mailto:${data.email}" style="color: #d4af37;">${data.email}</a>
            </td>
          </tr>
          ${data.phone ? `
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #ddd;"><strong>Phone:</strong></td>
              <td style="padding: 10px 0; border-bottom: 1px solid #ddd;">
                <a href="tel:${data.phone}" style="color: #d4af37;">${data.phone}</a>
              </td>
            </tr>
          ` : ""}
        </table>

        <div style="margin-top: 20px;">
          <strong>Message:</strong>
          <div style="background-color: #fff; padding: 15px; margin-top: 10px; border-radius: 4px;">
            ${data.message.replace(/\n/g, "<br>")}
          </div>
        </div>
      </div>

      <div style="background-color: #1a1a1a; padding: 15px; text-align: center;">
        <p style="color: #888; margin: 0; font-size: 12px;">
          This email was sent from the ${siteConfig.name} website contact form.
        </p>
      </div>
    </div>
  `;

  try {
    const { error } = await resend.emails.send({
      from: "El Paseo Auto <onboarding@resend.dev>",
      to: process.env.CONTACT_EMAIL || siteConfig.email,
      replyTo: data.email,
      subject,
      html: htmlContent,
    });

    if (error) {
      console.error("Failed to send email:", error);
      return { success: false, error };
    }

    return { success: true };
  } catch (error) {
    console.error("Failed to send email:", error);
    return { success: false, error };
  }
}
