
const {
  getBufferAccount,
  getBufferChannels,
} = require("../services/bufferService");

const fetchBufferAccount = async (req, res) => {
  try {
    const data = await getBufferAccount();

    return res.status(200).json({
      success: true,
      data: data.account,
    });
  } catch (error) {
    console.error("Buffer Account Error:", error.message);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const fetchBufferChannels = async (req, res) => {
  try {
    const { organizationId } = req.params;

    if (!organizationId) {
      return res.status(400).json({
        success: false,
        message: "Organization ID is required",
      });
    }

    const data = await getBufferChannels(organizationId);

    return res.status(200).json({
      success: true,
      data: data.channels,
    });
  } catch (error) {
    console.error("Buffer Channels Error:", error.message);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  fetchBufferAccount,
  fetchBufferChannels,
};
