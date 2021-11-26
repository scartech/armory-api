const { Op } = require('sequelize');
const AmmoInventoryService = require('./ammoinventory.service');
const AmmoService = require('./ammo.service');
const GunService = require('./gun.service');
const HistoryService = require('./history.service');
const AccessoryService = require('./accessory.service');
const { Ammo, Gun } = require('../models');

/**
 * Service class for Ammo CRUD ops.
 */
class DashboardService {
  static async data(userId) {
    try {
      let inventories = await AmmoInventoryService.all(userId);
      inventories = inventories ? inventories : [];
      const ammoBreakdown = {};
      const gunBreakdown = {};

      inventories.forEach((inventory) => {
        if (inventory.caliber in ammoBreakdown) {
          ammoBreakdown[inventory.caliber] += inventory.count;
        } else {
          ammoBreakdown[inventory.caliber] = inventory.count;
        }
      });

      let ammo = await AmmoService.ammo(userId);
      ammo = ammo ? ammo : [];

      let guns = await GunService.guns(userId);
      guns = guns ? guns : [];

      let rangeDays = await HistoryService.rangeDays(userId);
      rangeDays = rangeDays ? rangeDays : [];

      let accessories = await AccessoryService.all(userId);
      accessories = accessories ? accessories : [];

      guns
        .filter((x) => x.caliber)
        .forEach((gun) => {
          if (gun.caliber in gunBreakdown) {
            gunBreakdown[gun.caliber] += 1;
          } else {
            gunBreakdown[gun.caliber] = 1;
          }
        });

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

      const totalAccessoryCost = accessories.reduce(
        (accumulator, current) =>
          accumulator + parseFloat(current.purchasePrice),
        0,
      );

      const rifleCount = guns.filter((x) => x.type === 'Rifle').length;
      const pistolCount = guns.filter((x) => x.type === 'Pistol').length;
      const shotgunCount = guns.filter((x) => x.type === 'Shotgun').length;

      return {
        ammoBreakdown,
        gunBreakdown,
        gunCount: guns.length,
        rifleCount,
        pistolCount,
        shotgunCount,
        ammoPurchasesCount: ammo.length,
        accessoryCount: accessories.reduce(
          (accumulator, current) => accumulator + current.count,
          0,
        ),
        totalRoundsPurchased: ammo.reduce(
          (accumulator, current) => accumulator + current.roundCount,
          0,
        ),
        totalGunCost,
        totalAmmoCost,
        totalAccessoryCost,
        totalInvestment: totalGunCost + totalAmmoCost + totalAccessoryCost,
        totalAmmoUsed: rangeDays.reduce(
          (accumulator, current) => accumulator + current.ammoUsedCount,
          0,
        ),
        totalRoundsShot: rangeDays.reduce(
          (accumulator, current) => accumulator + current.roundsShotCount,
          0,
        ),
        totalAmmoInStock: inventories.reduce(
          (accumulator, current) => accumulator + current.count,
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
