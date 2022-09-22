const express = require("express");
const router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

router.get("/", async (req, res) => {
  res.send("test");
});

// CREATE A STRIPE CUSTOMER
router.post("/stripe-customer", async (req, res) => {
  const { name, email } = req.body;

  try {
    // res.send("tyring");
    const customer = await stripe.customers.create({
      name,
      email,
    });
    res.json(customer);
  } catch (error) {
    console.log(error);
    res.json(error);
  }
});

// CREATE A CONNECTED ACCOUNT
router.post("/connected-account", async (req, res) => {
  const { email } = req.body;

  try {
    const account = await stripe.accounts.create({
      type: "express",
      country: "GB",
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
      business_type: "individual",
      business_profile: {
        url: "rktutors.co.uk",
        mcc: 8299,
      },
      individual: {},
    });

    console.log("successfully created account");
    res.json(account);
  } catch (error) {
    console.log(error);
    res.json(error);
  }
});

// CREATE ONBOARDING LINK FOR CONNECTED ACCOUNT
router.post("/onboarding/:accountId", async (req, res) => {
  const accountId = req.params.accountId;

  try {
    const accountLink = await stripe.accountLinks.create({
      account: accountId,
      refresh_url: `${process.env.FRONTEND_URL}/stripe-connect-status-check`,
      return_url: `${process.env.FRONTEND_URL}/stripe-connect-status-check`,
      type: "account_onboarding",
    });

    res.json(accountLink);
  } catch (error) {
    res.json(error);
    console.log(error);
  }
});

// RETRIEVE A CONNECTED ACCOUNT
router.get("/connected-account/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const account = await stripe.accounts.retrieve(id);
    res.json(account);
  } catch (error) {
    console.log(error);
    res.json(error);
  }
});

// CREATE DASHBOARD LOGIN LINK

router.post("/login-link/:accountId", async (req, res) => {
  const accountId = req.params.accountId;
  try {
    const loginLink = await stripe.accounts.createLoginLink(accountId);
    res.json(loginLink);
  } catch (error) {
    console.log(error);
    res.json(error);
  }
});

// List payment methods
router.post("/payment-methods", async (req, res) => {
  // customer is customer id
  const { customer } = req.body;
  // console.log("received");
  // console.log(customer);

  try {
    const paymentMethods = await stripe.paymentMethods.list({
      customer,
      type: "card",
    });

    res.json(paymentMethods);
  } catch (error) {
    console.log(error);
    res.json(error);
  }
});

// Detach payment method from customer
router.post("/detach-payment-method", async (req, res) => {
  const { paymentMethodId } = req.body;

  try {
    const removedPaymentMethod = await stripe.paymentMethods.detach(
      paymentMethodId
    );
    res.json({ removedPaymentMethod, message: "removed payment method" });
  } catch (error) {
    res.json(error);
  }
});

//  Create Set Up Intent
router.post("/setup-intent", async (req, res) => {
  const { customerId } = req.body;

  try {
    const setupIntent = await stripe.setupIntents.create({
      payment_method_types: ["card"],
      customer: customerId,
    });

    // returns a client secret
    res.json(setupIntent);
  } catch (error) {
    res.json(error);
  }
});

// Create payment from student to tutor
router.post("/accept-payment", async (req, res) => {
  const { paymentMethodId, stripeCustomerId, connectedAccountId, price } =
    req.body;

  let platformFee = 300;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: price * 100,
      currency: "gbp",
      customer: stripeCustomerId,
      payment_method: paymentMethodId,
      off_session: true,
      confirm: true,
      // connect stuff
      application_fee_amount: platformFee,
      transfer_data: {
        destination: connectedAccountId,
      },
    });

    res.json({ success: true, paymentIntent });
  } catch (error) {
    console.log(error);
    res.json(error);
  }
});

router.post("/refund", async (req, res) => {
  const { payment_intent } = req.body;

  console.log("payment intent", payment_intent);

  try {
    const refund = await stripe.refunds.create({
      payment_intent,
      reverse_transfer: true,
      refund_application_fee: true,
    });

    res.json({ success: true, refund });
  } catch (error) {
    res.json(error);
  }
});

// TODO: GET PAYMENT INTENT
// router.get("/pi/:id", async (req, res) => {
//   let { id } = req.params;

//   try {
//     const paymentIntent = await stripe.paymentIntents.retrieve(id);
//     res.json(paymentIntent);
//   } catch (error) {
//     res.json(error);
//   }
// });

module.exports = router;
