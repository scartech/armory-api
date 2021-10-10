const { DashboardService } = require('../services/');
const ClientMessage = require('../utils/ClientMessage');

/**
 * Handles HTTP requests for the dashboard.
 */
class DashboardController {
  /**
   * Gets dashboard data for the logged in user.
   *
   * @param {*} req
   * @param {*} res
   * @returns
   */
  static async data(req, res) {
    try {
      const data = await DashboardService.data(req.user.id);
      if (data) {
        res.status(200).json(data);
      } else {
        res.status(404).json(new ClientMessage(true, ['Not found']));
      }
    } catch (error) {
      res.status(500).json(new ClientMessage(true, [error.message]));
    }
  }
}

module.exports = DashboardController;
