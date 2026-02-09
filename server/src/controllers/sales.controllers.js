import { Sale } from "../models/sales.models.js"
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";

const createSale = async (req, res, next) => {
  try {
    const { amountSold, salesCount } = req.body;

    if (!amountSold || !salesCount) {
      throw new ApiError(400, "All fields are required");
    }

    const authUser = await User.findOne({ _id: req.user._id });

    if (!authUser) throw new ApiError(404, "User not found");

    const sale = await Sale.create({
      agent: authUser._id, 
      amountSold,
      salesCount,
    });

    res.status(201).json({ sale, message: "Sale recorded successfully" });
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};

const getLeaderboard = async (_, res, next) => {
  try {
    // Aggregate sales per agent
    const data = await Sale.aggregate([
      {
        $group: {
          _id: "$agent", // agent's ObjectId
          totalSales: { $sum: "$amountSold" },
          totalDeals: { $sum: "$salesCount" },
        },
      },
      { $sort: { totalSales: -1 } }, // sort descending
      {
        $lookup: {
          from: "users", // MongoDB collection name
          localField: "_id",
          foreignField: "_id",
          as: "agent",
        },
      },
      { $unwind: "$agent" },
      {
        $project: {
          _id: 0,
          agentName: "$agent.name",
          totalSales: 1,
          totalDeals: 1,
        },
      },
    ]);

    // Ranking with tie handling
    let leaderboard = [];
    let rank = 0;
    let prevSales = null;
    let sameRankCount = 0;

    data.forEach((item, index) => {
      if (prevSales === null) {
        // First item
        rank = 1;
        sameRankCount = 1;
      } else if (item.totalSales === prevSales) {
        // Same total sales as previous, share the same rank
        sameRankCount++;
      } else {
        // Lower total sales, move rank forward
        rank += sameRankCount;
        sameRankCount = 1;
      }

      prevSales = item.totalSales;
      leaderboard.push({ rank, ...item });
    });

    res.json({ leaderboard });
  } catch (err) {
    console.log(err.message)
    next(err);
  }
};


export { createSale, getLeaderboard }
