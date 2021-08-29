const express = require('express');
const { check, validationResult } = require('express-validator');
const ClientMessage = require('../../util/ClientMessage');
const UsersController = require('../../controllers/users.controller');

const router = express.Router();

router.get('/:id', async (req, res) => {
  const { id } = req.params;

  if (isNaN(id)) {
    return res.status(400).json(new ClientMessage(true, ['Invalid parameter']));
  }

  try {
    const user = await UsersController.read(id);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json(new ClientMessage(true, ['Not found']));
    }
  } catch (error) {
    res.status(500).json(new ClientMessage(true, [error.message]));
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  if (isNaN(id)) {
    return res.status(400).json(new ClientMessage(true, ['Invalid parameter']));
  }

  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json(new ClientMessage(true, ['Not found']));
    }

    const success = await UsersController.delete(id);
    if (success) {
      res.status(200).send();
    } else {
      res.status(500).json(new ClientMessage(true, ['Delete failed']));
    }
  } catch (error) {
    res.status(500).json(new ClientMessage(true, [error.message]));
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;

  if (isNaN(id)) {
    return res.status(400).json(new ClientMessage(true, ['Invalid parameter']));
  }

  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json(new ClientMessage(true, ['Not found']));
    }

    const { email, name, admin, enabled } = req.body;

    const updatedUser = await UsersController.update(id, {
      email,
      name,
      admin,
      enabled,
    });

    if (updatedUser) {
      res.status(200).json(updatedUser);
    } else {
      res.status(500).json(new ClientMessage(true, ['Update failed']));
    }
  } catch (error) {
    res.status(500).json(new ClientMessage(true, [error.message]));
  }
});

router.put(
  '/:id/password',
  [check('password', 'Password is required.').not().isEmpty().trim()],
  async (req, res) => {
    const { id } = req.params;
    const { password } = req.body;

    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        let messages = [];
        errors.errors.map((error) => {
          messages.push(error.msg);
        });
        return res.status(400).json(new ClientMessage(true, messages));
      }

      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json(new ClientMessage(true, ['Not found']));
      }

      const success = await UsersController.updatePassword(id, password);
      if (success) {
        res.status(200).send();
      } else {
        res.status(500).json(new ClientMessage(true, ['Update failed']));
      }
    } catch (error) {
      res.status(500).json(new ClientMessage(true, [error.message]));
    }
  },
);

// Create new user
router.post(
  '/',
  [
    check('email', 'Invalid email address.').isEmail().trim(),
    check('name', 'Name is required.').not().isEmpty().trim(),
    check('password', 'Password is required.').not().isEmpty().trim(),
  ],
  async (req, res) => {
    const { name, email, password, admin, enabled } = req.body;

    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        let messages = [];
        errors.errors.map((error) => {
          messages.push(error.msg);
        });
        return res.status(400).json(new ClientMessage(true, messages));
      }

      const exists = await UsersController.exists(email);
      if (exists) {
        return res
          .status(409)
          .json(
            new ClientMessage(true, [
              'A user already exists with this email address.',
            ]),
          );
      }

      const user = await UsersController.create({
        name,
        email,
        password,
        admin,
        enabled,
      });

      if (user) {
        res.status(200).json(user);
      } else {
        res.status(500).json(new ClientMessage(true, ['Create failed']));
      }
    } catch (error) {
      res.status(500).json(new ClientMessage(true, [error.message]));
    }
  },
);

/**
 * @swagger
 * /api/users:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Users
 *     produces:
 *       - application/json
 *     description: Get all users
 *     responses:
 *       200:
 *         description: All users.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *
 */
router.get('/', async (req, res) => {
  try {
    const users = await UsersController.users();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json(new ClientMessage(true, [error.message]));
  }
});

module.exports = router;
