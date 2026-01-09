const { User, Alert } = require('../models');

/**
 * Simulate sending SMS to a phone number
 * @param {string} phone - Phone number
 * @param {string} message - Message content
 */
const sendSMS = async (phone, message) => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 100));

  console.log('─'.repeat(50));
  console.log(`📱 SMS SENT`);
  console.log(`   To: ${phone}`);
  console.log(`   Message: ${message}`);
  console.log('─'.repeat(50));

  return { success: true, phone };
};

/**
 * Send notifications to all emergency contacts of a user
 * @param {string} userId - User ID
 * @param {string} alertId - Alert ID
 */
const sendNotifications = async (userId, alertId) => {
  try {
    // Fetch user with emergency contacts
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Fetch alert details
    const alert = await Alert.findById(alertId);
    if (!alert) {
      throw new Error('Alert not found');
    }

    const { latitude, longitude } = alert.location;
    const mapsLink = `https://maps.google.com/?q=${latitude},${longitude}`;

    console.log('\n🚨 EMERGENCY ALERT TRIGGERED 🚨');
    console.log(`User: ${user.name} (${user.phone})`);
    console.log(`Location: ${mapsLink}`);
    console.log(`Time: ${alert.triggeredAt.toISOString()}`);

    if (!user.emergencyContacts || user.emergencyContacts.length === 0) {
      console.log('⚠️ No emergency contacts configured');
      return { success: true, notified: 0 };
    }

    const results = [];

    // Send SMS to each emergency contact
    for (const contact of user.emergencyContacts) {
      const message = `🚨 EMERGENCY! ${user.name} needs help! Location: ${mapsLink}`;

      const result = await sendSMS(contact.phone, message);
      results.push({
        name: contact.name,
        phone: contact.phone,
        ...result,
      });
    }

    console.log(`\n✅ Notified ${results.length} emergency contacts\n`);

    return {
      success: true,
      notified: results.length,
      contacts: results,
    };
  } catch (error) {
    console.error('❌ Notification Error:', error.message);
    throw error;
  }
};

module.exports = {
  sendSMS,
  sendNotifications,
};
