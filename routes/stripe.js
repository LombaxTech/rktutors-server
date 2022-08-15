const express = require("express");
const router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

router.get("/", async (req, res) => {
  res.send("test");
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
      refresh_url: "http://localhost:3000/stripe-connect-status-check",
      return_url: "http://localhost:3000/stripe-connect-status-check",
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

module.exports = router;
