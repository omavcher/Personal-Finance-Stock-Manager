const mongoose = require('mongoose');
const CreditCard = require('./models/creditCardSchema.js'); // Adjust the path if needed

// Connect to your MongoDB
mongoose.connect('mongodb://localhost:27017/planahead', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const creditCards = [
    {
      name: 'HDFC Regalia Credit Card',
      image: 'src/assets/cradit-cards/hdfcregalia.png',
      features: [
        'Earn 2 reward points for every Rs. 150 spent.',
        'Exclusive airport lounge access.',
        'Comprehensive insurance coverage.',
        'Global acceptance with contactless payments.',
      ],
      link: 'https://www.hdfcbank.com/personal/pay/cards/credit-cards/regalia-gold-credit-card'
    },
    {
      name: 'SBI Card Elite',
      image: 'src/assets/cradit-cards/sbielite.png',
          features: [
        '5% cashback on online purchases.',
        '2 complimentary airport lounge visits per quarter.',
        'Exclusive movie benefits and discounts.',
        'Premium membership offers.',
      ],
      link: 'https://www.sbicard.com/sprint/elite'
    },
    {
      name: 'ICICI Platinum Chip Card',
      image: 'src/assets/cradit-cards/icicplatinum.png',
      features: [
        'No annual fee for the first year.',
        '10% discount on dining bills at select restaurants.',
        'Earn reward points for every purchase.',
        '24/7 customer support and fraud protection.',
      ],
      link: 'https://campaigns.icicibank.com/credit-card/platinumCreditCard/index.html?utm_lms=affinity-siteplug-689293&pl=689293'
    },
    {
      name: 'Axis Bank Magnus Credit Card',
      image: 'src/assets/cradit-cards/axixmagnuscard.png',
      features: [
        'Exclusive concierge services.',
        '6% cashback on dining and grocery purchases.',
        'Complimentary membership for premium lounges.',
        'Special deals and discounts with Axis partners.',
      ],
      link: 'https://web.axisbank.co.in/DigitalChannel/WebForm/creditcard-applicationt.html?index6&axisreferralcode=magnuslisting&cta=cc-listing-magnus-apply-now'
    },
    {
      name: 'Swiggy HDFC Bank Credit Card',
      image: 'src/assets/cradit-cards/hdfcswiggy.png',
      features: [
        '5% Cashback on online spends across top brands. For list of eligible MCC.',
        '1% Cashback on other categories. For list of exclusions & capping.',
        'Complimentary Swiggy One Membership for 3 months on card activation as per latest RBI guidelines',
        '10% Cashback on Swiggy application (Food ordering, Instamart, Dineout & Genie).',
      ],
      link: 'https://applyonline.hdfcbank.com/cards/credit-cards.html?CHANNELSOURCE=SWCC&LGCode=MKTG&mc_id=website_organic_swiggy_CC_Cat_pg_apply_online&icid=website_organic_swiggy_CC_Cat_pg_apply_online#nbb'
    },
    {
      name: 'SBI Card PULSE',
      image: 'src/assets/cradit-cards/sbipulse.png',
      features: [
        'Noise ColorFit Pulse 2 Max Smartwatch worth Rs. 5,999 on payment of joining fees.',
        '12 Month Membership for FITPASS PRO and Netmeds First on payment of joining fee and card activation',
        '5X Reward Points on Chemist, Pharmacy, Dining and Movie Spends',
        'Big rewards, bigger savings.',
      ],
      link: 'https://www.sbicard.com/sprint/pulse'
    },{
      name: 'Freedom Credit Card',
      image: 'src/assets/cradit-cards/hdfcfreedom.png',
      features: [
        'The Best Card for Your Everyday Spends & Big Purchases.',
        'Festive Offer Until 30th Mar 25 ! Apply & Enjoy Lifetime Free Credit Card',
        '5arn 5X CashPoints on EMI spends at merchant locations',
        'Earn 1 CashPoint per every Rs.150 on other spends ( Excluding fuel, Wallets loads )',
      ],
      link: 'https://www.hdfcbank.com/personal/pay/cards/credit-cards/freedom-card-new'
    },{
      name: 'CASHBACK SBI Card',
      image: 'src/assets/cradit-cards/sbicashback.png',
      features: [
        '5% cashback on online spends.',
        '1% cashback on offline spends',
        'Card Cashback will be auto-credited to your SBI Card account within two days of your next statement generation.',
      ],
      link: 'https://www.sbicard.com/sprint/cashback'
    },
  ];

CreditCard.insertMany(creditCards)
  .then(() => {
    console.log('Credit cards added successfully!');
    mongoose.connection.close();
  })
  .catch((err) => {
    console.error('Error adding credit cards:', err);
    mongoose.connection.close();
  });
