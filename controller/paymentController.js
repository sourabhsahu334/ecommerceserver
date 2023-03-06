

const stripe = require("stripe")("sk_test_51MRym5SG72b7TahCD7KqdvOtKn66Ko2UAFiCBBmrEAeMHruva0BkZ616bDlbxusckmFYVGRDWdl9PKZrUhHK1bwu00KCMnki5b");

exports.processPayment = (async (req, res, next) => {
  try {
    const myPayment = await stripe.paymentIntents.create({
      amount: req.body.amount,
      currency: "inr",
      metadata: {
        company: "Ecommerce",
      },
    });

  
    res
      .status(200)
      .json({ success: true, client_secret: myPayment.client_secret });
  } catch (err) {
    console.log(err.message)
    res.json({message:err.message});
  }
});

exports.sendStripeApiKey = (async (req, res, next) => {
  try {
    res.status(200).json({ stripeApiKey:"pk_test_51MRym5SG72b7TahCPFNthDtjtVXpd5RoBVYxKwlCO9eNbfwYFOwQVEJMYjQLAlbtm37XlUBmnBLWN5kutNlGmW0G00Rp9AC1IZ"});
  } catch (err) {
    console.log(err.message);
    res.json({error :err.message})
  }
});
