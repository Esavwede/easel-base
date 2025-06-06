import { Resend } from "resend"
import logger from "../../../../../core/logging/logger"
import ApiError from "../../../../../shared/middleware/errors/api-error"

const resend = new Resend(process.env.RESEND_API_KEY)

export default async function sendWelcomeEmail(
  email: string,
  firstName: string,
) {
  logger.info("Sending welcome email")
  const { data, error } = await resend.emails.send({
    from: "onboarding@resend.dev",
    to: "ogagaoghene.esavwede@gmail.com",
    subject: "Hello World",
    html: `<p> Welcome ${firstName} !</p>`,
  })

  if (error) {
    logger.error(error, "error sending welcome email")
    throw new ApiError(500, "Server_Error", "Failed to send welcome email")
  }

  logger.info("Welcome email sent successfully", data)
}
