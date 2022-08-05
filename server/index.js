const express = require("express");
const cors = require("cors");

require("dotenv").config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const messagingServiceSid = process.env.TWILIO_MESSAGING_SERVICE_ID;
const client = require("twilio")(accountSid, authToken);

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const authRoutes = require("./routes/auth");

app.get("/", (req, res) => {
  res.status(200).send("hello world!");
});

app.post("/", (req, res) => {
  const { message, user: sender, type, members } = req.body;
  if (type === "message.new") {
    members
      .filter((member) => member.user_id !== sender.id)
      .forEach(({ user }) => {
        if (!user.online) {
          client.messages
            .create({
              body: `You have a new message from ${message.user.fullName} - ${message.text}`,
              messagingServiceSid: messagingServiceSid,
              to: user.phoneNumber,
            })
            .then(() => console.log("message sent"))
            .catch((err) => console.log(err));
        }
      });
    return res.status(200).send("not a new message request");
  }
  return res.status(200).send("message send");
});

app.use("/auth", authRoutes);

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
