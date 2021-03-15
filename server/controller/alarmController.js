const admin = require("firebase-admin");
const firebaseConfig = require("../config/firebase.json");
const util = require("../modules/util");
const statusCode = require("../modules/statusCode");
const resMessage = require("../modules/responseMessage");

const alarm = {
  alarm: async (req, res) => {
    try {
      admin.initializeApp({
        credential: admin.credential.cert(firebaseConfig),
        //databaseURL: "https://whale-6603f.firebaseio.com",
      });

      var payload = {
        data: {
          title: "오늘의 칭찬이 도착했어요!",
          body: "지금 바로 오늘의 칭찬을 확인하고, 실천해보세요!",
        },
      };

      const test = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWR4IjoxNDksImlhdCI6MTYxNTgxMjQ1OCwiZXhwIjoxNjE4NDA0NDU4LCJpc3MiOiJwcmFpc2UifQ.iUAhRGG-sUD_-Hyn6XZ7IuYv9RoHvfXhd9pkzVwhKyI"
      const result = [
        "f1f5Ti-yTkOwPI1xtcj92R:APA91bF53uesY1OufwWlFbjQo-6C2PIMrkMFW6rwyvcu3I3TlNlfBhHyOr2s-HPzKZ7oFKja_7IrQ1BTOv0KVX_dRrMOsL4zF-fDxvanhDJdtFg5GQqQbsmMS5Celo5W2dWMBUOu6nva"  
      ];

      admin
        .messaging()
        .sendToDevice(result, payload)
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
            .status(statusCode.INTERNAL_SERVER_ERROR)
            .send(
              util.fail(
                statusCode.INTERNAL_SERVER_ERROR,
                resMessage.INTERNAL_SERVER_ERROR
              )
            );
          return;
        });
    } catch (err) {
      res
        .status(statusCode.INTERNAL_SERVER_ERROR)
        .send(
          util.fail(
            statusCode.INTERNAL_SERVER_ERROR,
            resMessage.INTERNAL_SERVER_ERROR
          )
        );
      return;
    }
  },
};

module.exports = alarm;
