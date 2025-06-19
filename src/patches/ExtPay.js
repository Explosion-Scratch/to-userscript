chrome.storage.local.clear();
const ExtPay = (extensionId) => ({
  startBackground() {},

  getUser() {
    return new Promise((resolve) => {
      const dummyUser = {
        paid: false,
        paidAt: new Date(),
        email: "dummyuser@example.com",
        installedAt: new Date(),
        trialStartedAt: null,
        plan: {
          unitAmountCents: 1000,
          currency: "usd",
          nickname: "dummy_plan",
          intervalCount: 1,
          interval: "month",
        },
        subscriptionStatus: "inactive",
        subscriptionCancelAt: null,
      };
      resolve(dummyUser);
    });
  },
  openPaymentPage(planNickname) {},
  getPlans() {
    return new Promise((resolve) => {
      const dummyPlans = [
        {
          unitAmountCents: 1000,
          currency: "usd",
          nickname: "monthly_plan",
          interval: "month",
          intervalCount: 1,
        },
        {
          unitAmountCents: 9900,
          currency: "usd",
          nickname: "yearly_plan",
          interval: "year",
          intervalCount: 1,
        },
      ];
      resolve(dummyPlans);
    });
  },

  onPaid: {
    addListener: () => {},
    removeListener: () => {},
  },

  openTrialPage(displayText) {},

  openLoginPage() {
    console.log("Dummy login page opened");
  },
});

window.ExtPay = ExtPay;
