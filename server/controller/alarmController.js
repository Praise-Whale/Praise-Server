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
      });

      var payload = {
        data: {
          title: "오늘의 칭찬이 도착했어요!",
          body: "지금 바로 오늘의 칭찬을 확인하고, 실천해보세요!",
        },
      };

      const result = [
        "esNo5JuEQWChTk5nY_82Pv:APA91bEax18zQk8SvtFAseLOKCurhpexGjTErryme5GySS7Dw-MhsIJM_EoGE9jgNw7Gve_eJ5bjy9ez0QM42QHL6P_VQjZ6X4t4FoMkpqRWq05O2faCsYjkeJmiH74rih_m-q2oBGDM"  
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
