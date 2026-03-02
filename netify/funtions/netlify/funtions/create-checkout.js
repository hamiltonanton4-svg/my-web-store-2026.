const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
  // Only allow POST requests (when someone clicks your button)
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Opalwave Shop Item',
            },
            unit_amount: 2000, // This is $20.00
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      // The pages Stripe sends people to after they pay or click back
      success_url: 'https://serene-lollipop-dc0c7b.netlify.app/success.html',
      cancel_url: 'https://serene-lollipop-dc0c7b.netlify.app/', 
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ id: session.id }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};