const { Op } = require('sequelize');
const { Ammo, Gun } = require('../models');

/**
 * Service class for Ammo CRUD ops.
 */
class DashboardService {
  static async data(userId) {
    try {
      let ammo = await Ammo.findAll({
        where: {
          userId: {
            [Op.eq]: userId,
          },
        },
        order: [['purchaseDate', 'DESC']],
      });
      ammo = ammo ? ammo : [];

      let guns = await Gun.findAll({
        where: {
          userId: {
            [Op.eq]: userId,
          },
        },
        order: [['name', 'ASC']],
      });
      guns = guns ? guns : [];

      return {
        gunCount: guns.length,
        ammoCount: ammo.length,
        totalRoundCount: ammo.reduce(
          (accumulator, current) => accumulator + current.roundCount,
          0,
        ),
        totalGunCost: guns.reduce(
          (accumulator, current) =>
            accumulator + parseFloat(current.purchasePrice),
          0,
        ),
        totalAmmoCost: ammo.reduce(
          (accumulator, current) =>
            accumulator + parseFloat(current.purchasePrice),
          0,
        ),
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}

module.exports = DashboardService;
