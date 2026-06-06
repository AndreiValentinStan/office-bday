import { Client } from "ssh2";
import { env } from "./envManager";
import { emailData as emailDataValidator } from "../validators/emailData";

const { MAIL_CL_IP, MAIL_PORT, MAIL_USER, MAIL_PASS } = env;

/*
 * Sends an email through an ssh connection using mutt on remote end
 * @param {Object} emailData             - email configuration data
 * @param {String} emailData.to          - recipient's email address
 * @param {String} emailData.subject     - email subject
 * @param {String} emailData.body        - email content
 */
export function sendEmail(emailData) {
  const { body, subject, to } = emailDataValidator.parse(emailData);

  const sshConn = new Client();

  sshConn
    .on("ready", () => {
      const muttCommand = `echo "${body}" | mutt -F ./muttrc.ce -s "${subject}" "${to}"`;
      console.log("Executing commnad for sending email from remote");

      sshConn.exec(muttCommand, (err, stream) => {
        if (err) {
          console.log("Error in sending email: ", err);
          return sshConn.end();
        }

        stream.on("close", (code) => {
          if (code === "0") console.log("Email sended succesfully! [OK]");
          else console.log("Error in sending email with code: ", code);
          return sshConn.end();
        });

        stream.on("data", (data) => {
          console.log("Response of remote server: ", data);
        });

        stream.on("error", (err) => {
          console.log("Server error: ", err);
        });
      });
    })
    .connect({
      host: MAIL_CL_IP,
      port: MAIL_PORT,
      username: MAIL_USER,
      password: MAIL_PASS,
    });
}
