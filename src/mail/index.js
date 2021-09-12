const { ImapFlow } = require("imapflow");
const dotenv = require("dotenv");

dotenv.config();

const config = {
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: true,
  logger: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
};

const getNewMail = async () => {
  const client = new ImapFlow(config);
  const allMail = [];

  // Wait until client connects and authorizes
  await client.connect();

  // Select and lock a mailbox. Throws if mailbox does not exist
  const lock = await client.getMailboxLock("INBOX");
  try {
    for await (const message of client.fetch(
      { unseen: true },
      {
        uid: true,
        flags: true,
        bodyStructure: true,
        envelope: true,
        internalDate: true,
        emailId: true,
        threadId: true,
        xGmLabels: true,
        headers: ["date", "subject"],
        bodyParts: ["text"]
      }
    )) {
      let body = "";
      for (const [, value] of message.bodyParts.entries()) {
        body += value.toString();
      }

      if (message.bodyStructure.encoding === "base64") {
        const buf = Buffer.from(body, "base64");

        let encoding = "latin1";
        if (message.bodyStructure.parameters.charset === "utf-8") {
          encoding = "utf8";
        }
        body = buf.toString(encoding);
      }

      allMail.push({ uid: message.uid, body });
    }
  } finally {
    // Make sure lock is released, otherwise next `getMailboxLock()` never returns
    lock.release();
  }

  // log out and close connection
  await client.logout();

  return allMail;
};

const setMailSeen = async (list) => {
  const client = new ImapFlow(config);

  await client.connect();

  const lock = await client.getMailboxLock("INBOX");
  try {
    // mark all unseen messages as seen (and keep other flags as is)
    if (list.length === 0) {
      await client.messageFlagsAdd("1:*", ["\\Seen"]);
    } else {
      await client.messageFlagsAdd(list, ["\\Seen"], { uid: true });
    }
  } finally {
    lock.release();
  }

  await client.logout();
};

module.exports = { getNewMail, setMailSeen };
