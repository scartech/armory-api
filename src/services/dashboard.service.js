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

      const totalGunCost = guns.reduce(
        (accumulator, current) =>
          accumulator + parseFloat(current.purchasePrice),
        0,
      );

      const totalAmmoCost = ammo.reduce(
        (accumulator, current) =>
          accumulator + parseFloat(current.purchasePrice),
        0,
      );

      const rifleCount = guns.filter((x) => x.type === 'Rifle').length;
      const pistolCount = guns.filter((x) => x.type === 'Pistol').length;
      const shotgunCount = guns.filter((x) => x.type === 'Shotgun').length;

      return {
        gunCount: guns.length,
        rifleCount,
        pistolCount,
        shotgunCount,
        ammoCount: ammo.length,
        totalRoundCount: ammo.reduce(
          (accumulator, current) => accumulator + current.roundCount,
          0,
        ),
        totalGunCost,
        totalAmmoCost,
        totalInvestment: totalGunCost + totalAmmoCost,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}

module.exports = DashboardService;
