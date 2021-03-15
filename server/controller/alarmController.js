const admin = require("firebase-admin");
const firebaseConfig = require("../config/firebase.json");
const util = require("../modules/util");
const statusCode = require("../modules/statusCode");
const resMessage = require("../modules/responseMessage");

const alarm = {

  alarm: async (req, res) => {

    try {
      if (!admin.apps.length) {
        admin.initializeApp({
          credential: admin.credential.cert(firebaseConfig),
          //databaseURL: "https://maru-40810.firebaseio.com",
        });
      }
      var options = {
        priority: "high",
        timeToLive: 60 * 60 * 24 * 2,
      };

      var payload = {
        notification: {
          title: "연애고수는 누구?",
          body: "영민이형",
        },
      };
      
      const result = [
        "eB2sWawMQ_2-A8thR2eNyd:APA91bHtaT1fFkqYnmWepU52NL7HT5MIkAfZR-2bHiNc240z6YH5AnI-FdKLU-Ox_fT4RQpSSdIex1vFCK9CLgKdvoEvbXfbDrxxGNvUgbi1w_0D51hYot1cyfv_sGiOvwWKYijoLihT",
      ]

      admin
        .messaging()
        .sendToDevice(result, payload, options)
        .then(function (response) {
          console.log("성공 메세지!" + response);
          res
            .status(statusCode.OK)
            .send(util.success(statusCode.OK, resMessage.SUCCESS_ALARM));
          return;
        })
        .catch(function (error) {
          console.log("보내기 실패 : ", error);
          res
            .status(statusCode.DB_ERROR)
            .send(
              util.fail(statusCode.DB_ERROR, resMessage.INTERNAL_SERVER_ERROR)
            );
          return;
        });
    } catch (err) {
      res
        .status(statusCode.DB_ERROR)
        .send(util.fail(statusCode.DB_ERROR, resMessage.INTERNAL_SERVER_ERROR));
      return;
    }
  },
};

module.exports = alarm;
