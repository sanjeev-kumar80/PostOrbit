
const Post = require("../models/Post");
const SocialAccount = require("../models/SocialAccount");

const getDashboardOverview = async (req, res) => {
  try {
    const userId = req.user._id;

    const [
      totalPosts,
      publishedPosts,
      scheduledPosts,
      draftPosts,
      connectedAccounts,
      recentPosts,
    ] = await Promise.all([
      Post.countDocuments({ user: userId }),
      Post.countDocuments({ user: userId, status: "published" }),
      Post.countDocuments({ user: userId, status: "scheduled" }),
      Post.countDocuments({ user: userId, status: "draft" }),
      SocialAccount.countDocuments({
        user: userId,
        isActive: true,
      }),
      Post.find({ user: userId })
        .select("content platforms status scheduledAt publishedAt createdAt")
        .sort({ createdAt: -1 })
        .limit(5)
        .lean(),
    ]);

    return res.status(200).json({
      success: true,
      message: "Dashboard data fetched successfully",
      data: {
        user: {
          id: req.user._id,
          name: req.user.name,
          email: req.user.email,
          role: req.user.role,
        },
        stats: {
          totalPosts,
          publishedPosts,
          scheduledPosts,
          draftPosts,
          connectedAccounts,
        },
        recentPosts,
      },
    });
  } catch (error) {
    console.error("Dashboard Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard data",
    });
  }
};

module.exports = { getDashboardOverview };
