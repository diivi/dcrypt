var cron = require("node-cron");
const Team = require("../models/Team");

module.exports  = cron.schedule(
  "* * * * *",
  () => {
    Team.find({}, function (err, docs) {
      docs.forEach((element) => {
        if (element.powerupTimer > 0) {
          Team.updateOne(
            { email: element.email },
            {
              $inc: {
                powerupTimer: -1,
              },
            },
            { multi: true },
            timercallback
          );
          function timercallback(err, num) {
            if (err) {
              console.log(err);
            }
          }
        } else {
          Team.updateOne(
            { email: element.email },
            {
              $set: {
                dpVisible: false,
                shield: false,
                multiplier: false,
              },
            },
            { multi: true },
            timeupcallback
          );
          function timeupcallback(err, num) {
            if (err) {
              console.log(err);
            }
          }
        }
      });
    });
  },
  {
    scheduled: true,
    timezone: "Asia/Kolkata",
  }
);
