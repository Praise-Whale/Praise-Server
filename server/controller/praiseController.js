const statusCode = require('../modules/statusCode');
const responseMessage = require('../modules/responseMessage');
const util = require('../modules/util');
const { praiseTarget } = require('../models/index');

module.exports = {
  praiseTarget: async (req, res) => {
    const userIdx = req.userIdx;

    const praiseUsers = await praiseTarget.findAll({
      attributes: ['name'],
      limit: 3,
      where: {
        userId: userIdx
      } 
    });

    res.status(statusCode.OK).send(util.success(statusCode.OK, responseMessage.LATELY_PRAISE_USER, praiseUsers));
    return;

  }
}