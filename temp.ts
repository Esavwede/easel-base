import { Resend } from "resend"

const resend = new Resend("re_icfuSAUt_MgerPaPcr5UaS6tbHNGXvQVW")

resend.emails.send({
  from: "onboarding@resend.dev",
  to: "ogaga@ogaga.tech",
  subject: "Hello World",
  html: "<p>Congrats on sending your <strong>first email</strong>!</p>",
})
