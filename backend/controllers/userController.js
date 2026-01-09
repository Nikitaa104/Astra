const { User } = require('../models');

/**
 * @desc    Get logged-in user profile
 * @route   GET /api/users/me
 * @access  Private
 */
const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update logged-in user profile
 * @route   PATCH /api/users/me
 * @access  Private
 */
const updateProfile = async (req, res, next) => {
  try {
    const { name, email, phone } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { name, email, phone },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Add emergency contact
 * @route   POST /api/users/me/contacts
 * @access  Private
 */
const addContact = async (req, res, next) => {
  try {
    const { name, phone } = req.body;

    if (!name || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Name and phone are required',
      });
    }

    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    user.emergencyContacts.push({ name, phone });
    await user.save();

    res.status(201).json({
      success: true,
      message: 'Emergency contact added',
      data: user.emergencyContacts,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Remove emergency contact
 * @route   DELETE /api/users/me/contacts/:contactId
 * @access  Private
 * 
 * @example
 * Request: DELETE /api/users/me/contacts/507f1f77bcf86cd799439011
 * Response: {
 *   "success": true,
 *   "message": "Emergency contact removed",
 *   "data": [...]
 * }
 */
const removeContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;

    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const contactIndex = user.emergencyContacts.findIndex(
      (c) => c._id.toString() === contactId
    );

    if (contactIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found',
      });
    }

    user.emergencyContacts.splice(contactIndex, 1);
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Emergency contact removed',
      data: user.emergencyContacts,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update emergency contact
 * @route   PATCH /api/users/me/contacts/:contactId
 * @access  Private
 * 
 * @example
 * Request: PATCH /api/users/me/contacts/507f1f77bcf86cd799439011
 * Body: { "name": "John Updated", "phone": "+1234567890" }
 * Response: {
 *   "success": true,
 *   "message": "Emergency contact updated",
 *   "data": [...]
 * }
 */
const updateContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const { name, phone } = req.body;

    // Authorization: Validate ownership
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const contact = user.emergencyContacts.id(contactId);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found',
      });
    }

    // Update fields if provided
    if (name) contact.name = name;
    if (phone) contact.phone = phone;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Emergency contact updated',
      data: user.emergencyContacts,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfile,
  updateProfile,
  addContact,
  removeContact,
  updateContact,
};
