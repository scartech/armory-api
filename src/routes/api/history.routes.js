const express = require('express');
const { HistoryController } = require('../../controllers');

const router = express.Router();

/**
 * GET /api/history/rangedays
 * @tags History
 * @summary Gets all history range days
 * @security BearerAuth
 * @return {object} 200 - success
 * @example response - 200 - History
 * [{
 *   "id": 0,
 *   "name": "Target Practice at PSA",
 *   "type": "Range Day",
 *   "narrative": "Shot a lot of rounds",
 *   "roundCount": 300,
 *   "eventDate": "2021-08-30",
 *   "gunId": 1
 * }]
 * @return 401 - Invalid or missing JWT
 * @return {ClientMessage} 500 - A server error occurred
 */
router.get('/rangedays', HistoryController.rangeDays);

/**
 * POST /api/history/rangeday
 * @tags History
 * @summary Creates a new range day history event
 * @security BearerAuth
 * @param {object} request.body.required - Event info
 * @example request - New History Event
 * {
 *   "name": "Target Practice at PSA",
 *   "narrative": "Shot a lot of rounds",
 *   "roundCount": 300,
 *   "eventDate": "2021-08-30",
 *   "gunId": 1
 * }
 * @return {object} 201 - Created a new history event
 * @example response - 201 - Created History
 *  {
 *   "id": 0,
 *   "name": "Target Practice at PSA",
 *   "type": "Range Day",
 *   "narrative": "Shot a lot of rounds",
 *   "roundCount": 300,
 *   "eventDate": "2021-08-30",
 *   "gunId": 1
 * }
 * @return 401 - Invalid or missing JWT
 * @return {ClientMessage} 500 - A server error occurred
 */
router.post('/rangeday', HistoryController.createRangeDay);

/**
 * GET /api/history/{id}
 * @tags History
 * @summary Gets a single history event by ID
 * @security BearerAuth
 * @param {integer} id.path - History ID
 * @return {object} 200 - success
 * @example response - 200 - Existing History Event
 * {
 *   "id": 0,
 *   "name": "Target Practice at PSA",
 *   "type": "Range Day",
 *   "narrative": "Shot a lot of rounds",
 *   "roundCount": 300,
 *   "eventDate": "2021-08-30",
 *   "gunId": 1
 * }
 * @return 401 - Invalid or missing JWT
 * @return {ClientMessage} 400 - Invalid ID
 * @return {ClientMessage} 404 - The history was not found
 * @return {ClientMessage} 500 - A server error occurred
 */
router.get('/:id', HistoryController.read);

/**
 * DELETE /api/history/{id}
 * @tags History
 * @summary Deletes a history event
 * @security BearerAuth
 * @param {integer} id.path - History ID
 * @return 200 - success
 * @return 401 - Invalid or missing JWT
 * @return {ClientMessage} 400 - Invalid ID
 * @return {ClientMessage} 404 - The history was not found
 * @return {ClientMessage} 500 - A server error occurred
 */
router.delete('/:id', HistoryController.delete);

/**
 * PUT /api/history/{id}
 * @tags History
 * @summary Updates a history event
 * @security BearerAuth
 * @param {integer} id.path - History ID
 * @param {object} request.body.required - Event data
 * @example request - Existing History
 * {
 *   "id": 1,
 *   "name": "Target Practice at PSA",
 *   "type": "Range Day",
 *   "narrative": "Shot a lot of rounds",
 *   "roundCount": 300,
 *   "eventDate": "2021-08-30",
 *   "gunId": 1
 * }
 * @return {object} 200 - Updated an existing event
 * @example response - 200 - Updated History
 *  {
 *   "id": 0,
 *   "name": "Target Practice at PSA",
 *   "type": "Range Day",
 *   "narrative": "Shot a lot of rounds",
 *   "roundCount": 300,
 *   "eventDate": "2021-08-30",
 *   "gunId": 1
 * }
 * @return 401 - Invalid or missing JWT
 * @return {ClientMessage} 400 - Invalid ID
 * @return {ClientMessage} 404 - The history was not found
 * @return {ClientMessage} 500 - A server error occurred
 */
router.put('/:id', HistoryController.update);

/**
 * POST /api/history
 * @tags History
 * @summary Creates a new history event
 * @security BearerAuth
 * @param {object} request.body.required - Event info
 * @example request - New History Event
 * {
 *   "name": "Target Practice at PSA",
 *   "type": "Range Day",
 *   "narrative": "Shot a lot of rounds",
 *   "roundCount": 300,
 *   "eventDate": "2021-08-30",
 *   "gunId": 1
 * }
 * @return {object} 201 - Created a new history event
 * @example response - 201 - Created History
 *  {
 *   "id": 0,
 *   "name": "Target Practice at PSA",
 *   "type": "Range Day",
 *   "narrative": "Shot a lot of rounds",
 *   "roundCount": 300,
 *   "eventDate": "2021-08-30",
 *   "gunId": 1
 * }
 * @return 401 - Invalid or missing JWT
 * @return {ClientMessage} 500 - A server error occurred
 */
router.post('/', HistoryController.create);

/**
 * GET /api/history/gun/{id}
 * @tags History
 * @summary Gets all history events for a gun
 * @security BearerAuth
 * @return {object} 200 - success
 * @example response - 200 - History
 * [{
 *   "id": 0,
 *   "name": "Target Practice at PSA",
 *   "type": "Range Day",
 *   "narrative": "Shot a lot of rounds",
 *   "roundCount": 300,
 *   "eventDate": "2021-08-30",
 *   "gunId": 1
 * }]
 * @return 401 - Invalid or missing JWT
 * @return {ClientMessage} 500 - A server error occurred
 */
router.get('/gun/:id', HistoryController.gun);

/**
 * GET /api/history/inventory/{id}
 * @tags History
 * @summary Gets all history events for a ammo inventory
 * @security BearerAuth
 * @return {object} 200 - success
 * @example response - 200 - History
 * [{
 *   "id": 0,
 *   "name": "Target Practice at PSA",
 *   "type": "Range Day",
 *   "narrative": "Shot a lot of rounds",
 *   "roundCount": 300,
 *   "eventDate": "2021-08-30",
 *   "gunId": 1
 * }]
 * @return 401 - Invalid or missing JWT
 * @return {ClientMessage} 500 - A server error occurred
 */
router.get('/inventory/:id', HistoryController.inventory);

module.exports = router;
