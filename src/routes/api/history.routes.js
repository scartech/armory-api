const express = require('express');
const { HistoryController } = require('../../controllers');

const router = express.Router();

/**
 * GET /api/history/{gunId}/{id}
 * @tags History
 * @summary Gets a single history event by ID
 * @security BearerAuth
 * @param {integer} gunId.path - Gun ID
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
 * @return {ClientMessage} 404 - The gun was not found
 * @return {ClientMessage} 500 - A server error occurred
 */
router.get('/:gunId/:id', HistoryController.read);

/**
 * DELETE /api/history/{gunId}/{id}
 * @tags History
 * @summary Deletes a history event
 * @security BearerAuth
 * @param {integer} gunId.path - Gun ID
 * @param {integer} id.path - History ID
 * @return 200 - success
 * @return 401 - Invalid or missing JWT
 * @return {ClientMessage} 400 - Invalid ID
 * @return {ClientMessage} 404 - The gun was not found
 * @return {ClientMessage} 500 - A server error occurred
 */
router.delete('/:gunId/:id', HistoryController.delete);

/**
 * PUT /api/history/{gunId}/{id}
 * @tags History
 * @summary Updates a history event
 * @security BearerAuth
 * @param {integer} gunId.path - Gun ID
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
 * @return {ClientMessage} 404 - The gun or history was not found
 * @return {ClientMessage} 500 - A server error occurred
 */
router.put('/:gunId/:id', HistoryController.update);

/**
 * POST /api/history/{gunId}
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
router.post('/:gunId', HistoryController.create);

/**
 * GET /api/history/{gunId}
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
router.get('/:gunId', HistoryController.all);

module.exports = router;