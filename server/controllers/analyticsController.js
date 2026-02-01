const Order = require('../models/Order');

// GET /api/analytics/top-sellers
exports.getTopSellers = async (req, res) => {
  try {
    const result = await Order.aggregate([
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.menuItem',
          totalQty: { $sum: '$items.quantity' }
        }
      },
      {
        $lookup: {
          from: 'menuitems',
          localField: '_id',
          foreignField: '_id',
          as: 'details'
        }
      },
      { $unwind: '$details' },
      { $sort: { totalQty: -1 } },
      { $limit: 5 },
      {
        $project: {
          _id: 0,
          menuItemId: '$_id',
          name: '$details.name',
          category: '$details.category',
          price: '$details.price',
          totalSold: '$totalQty'
        }
      }
    ]);

    res.json(result);
  } catch (error) {
    console.error('AGGREGATION ERROR:', error);
    res.status(500).json({ message: 'Failed to fetch top sellers' });
  }
};
