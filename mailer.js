const SMTPServer = require("smtp-server").SMTPServer;

const server = new SMTPServer({
  secure: false,
  authMethods: ["PLAIN", "LOGIN", "CRAM-MD5"],

  onAuth(auth, session, callback) {
    let username = "testuser";
    let password = "testpass";

    // check username and password
    if (
      auth.username === username &&
      (auth.method === "CRAM-MD5"
        ? auth.validatePassword(password) // if cram-md5, validate challenge response
        : auth.password === password) // for other methods match plaintext passwords
    ) {
      return callback(null, {
        user: "userdata", // value could be an user id, or an user object etc. This value can be accessed from session.user afterwards
      });
    }

    return callback(new Error("Authentication failed"));
  },
  onData(stream, session, callback) {
    let data = "";
    stream.on("data", (chunk) => {
      data += chunk;
    });
    stream.on("end", () => {
      console.log(data);
      callback(null, "Message received");
    });
  },
  onClose(session) {
    console.log("Connection closed");
  },
  onConnect(session, callback) {
    console.log("Connected");
    callback();
  },
});
server.listen(587, () => {
  console.log("SMTP server listening on port 587");
});
