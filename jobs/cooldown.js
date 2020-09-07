var cron = require("node-cron");
const Team = require("../models/Team");

module.exports = cron.schedule(
  "* * * * *",
  () => {
    Team.find({}, function (err, docs) {
      docs.forEach((element) => {
        if (element.attackCooldown > 0) {
          Team.updateOne(
            { email: element.email },
            {
              $inc: {
                attackCooldown: -1,
              },
            },
            { multi: true },
            attcoolcallback
          );
          function attcoolcallback(err, num) {
            if (err) {
              console.log(err);
            }
          }
        }
        if (element.defenseCooldown > 0) {
          Team.updateOne(
            { email: element.email },
            {
              $inc: {
                defenseCooldown: -1,
              },
            },
            { multi: true },
            defcoolcallback
          );
          function defcoolcallback(err, num) {
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
