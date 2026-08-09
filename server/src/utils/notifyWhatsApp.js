export async function notifyWhatsApp(message) {
  const token = process.env.WHATSAPP_BUSINESS_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const recipientNumber = process.env.STORE_OWNER_WHATSAPP_NUMBER;

  if (!token || !phoneNumberId || !recipientNumber) {
    console.log('WhatsApp notification skipped because API credentials are missing.');
    return;
  }

  const response = await fetch(`https://graph.facebook.com/v20.0/${phoneNumberId}/messages`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      to: recipientNumber,
      type: 'text',
      text: { body: message },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`WhatsApp API error: ${errorText}`);
  }
}