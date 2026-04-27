import { useLocation } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { motion } from 'framer-motion';

const ShippingPolicyContent = () => (
  <div className="space-y-8">
    <section>
      <p>
        EVERSOL INDIA abides that no additional and extra charges are not applied when you do pay for shipping the items at your preferred location. We at EVERSOL INDIA do not apply any hidden charges such as sales tax, and octroi, which needs to be paid by the buyers and sellers during the purchase of the products. You are required to pay only the amount mentioned along with the product that anyone can see on our website. The price enumerated on the item is the final amount that you need to pay.
      </p>
    </section>

    <section>
      <h3 className="text-xl font-bold text-foreground mb-4">How shipping completes by eversol.in?</h3>
      <p>
        EVERSOL INDIA does ship the ordered consignments by the help of ground couriers and own logistic facilities whether it's a single product or bulk quantities. However, there are some other goods dispatched with the help of speed post.
      </p>
    </section>

    <section>
      <h3 className="text-xl font-bold text-foreground mb-4">How many days to deliver the product?</h3>
      <p>
        It requires 3-4 Business Days to deliver the product at your location once it is dispatched from EVERSOL INDIA. On the other hand, it may need 2 more days to deliver the product if your area does not come in a Metro City.
      </p>
    </section>

    <section>
      <h3 className="text-xl font-bold text-foreground mb-4">How to track my order?</h3>
      <p>
        You will receive an email provided with a link to track the status of your ordered item immediately, while you buy any product from eversol.in. The tracking status includes the exact place of the item (where it's exactly) so that buyers can get an idea about estimated days of delivery, which he or she can receive the item.
      </p>
      <p className="mt-4 italic">
        Did you know that you can track the status of your order by getting an E-mail?
      </p>
    </section>

    <section>
      <h3 className="text-xl font-bold text-foreground mb-4">No shipping of items at my location, why?</h3>
      <p>
        eversol.in generally provides the shipping of items to almost all the locations of Bangalore, Karnataka. But sometimes it may fail to ship a product at few locations because of either non-availability of courier services at those particular places, or there may be any legal restrictions of shipping a particular item. For this reason, EVERSOL INDIA suggests the buyers to first check it's status online whether the required products are eligible for shipping to your location or not.
      </p>
    </section>

    <section>
      <h3 className="text-xl font-bold text-foreground mb-4">No COD at my area, why?</h3>
      <p>
        The availability of COD (Cash on Delivery) depends on the facility of the courier partner service in your area to accept cash as payment at the time of delivery. In case COD is not available at our location, eversol.in will not allow you to purchase the product through COD and leave a message saying, COD not available in your area. Instead, eversol.in will suggest you pay using a different mode of payment methods like online transactions.
      </p>
    </section>
  </div>
);

const PaymentPolicyContent = () => (
  <div className="space-y-8">
    <section>
      <h3 className="text-xl font-bold text-foreground mb-4">How do I pay for purchasing products from eversol.in?</h3>
      <p>
        eversol.in offers multiple payment options and also provides the highest level of security while performing the online transaction. You may use the varied mode of payment alternatives such as internet banking, Maestro debit /credit cards, Visa, MasterCard, AMEX, wallet payment, and cash on delivery modes of payment for purchasing the items.
      </p>
      <p className="mt-4">
        For the payments using credit cards/debit cards, you need to enter your card number, expiry date, the CVV number, and the name on the card. After entering all these details, you need to enter your password by which you will be able to make your payment for the selected item through the bank's secure page.
      </p>
      <p className="mt-4">
        You can trust our reliable payment gateway partners as they use secure encryption technology to keep your transaction details confidential at all time and therefore your details will never get compromised with any unauthorized servers. All these payment techniques are managed through secure and trusted gateways by all leading banks, hence, ensuring the security of information.
      </p>
      <p className="mt-4">
        There are no additional charges applied in addition to the purchase of EVERSOL INDIA products. The customer has to pay only the amount, which is displayed along with the product. We also provide the free delivery facility of the item.
      </p>
    </section>

    <section>
      <h3 className="text-xl font-bold text-foreground mb-4">COD (Cash on Delivery) facility</h3>
      <p>
        Purchasers or buyers can opt Cash on Delivery (COD) mode of payment, where they pay for the item through cash once after collecting / installation the product. In this case, the customer does not have to pay online. EVERSOL INDIA provides several payment options for COD facility - card Swapping, link payment, and internet banking.
      </p>
      <p className="mt-4">
        At first, customers need to check if COD is available at their location or not when they want to avail of this facility. EVERSOL INDIA usually provides COD for all locations, but then it might not be available due to the inability of courier service at a few locations. And, if you fail to pay cash for the product, you have no right to collect it by any fraud means. However, COD is available for a minimum specified amount only.
      </p>
    </section>

    <section>
      <h3 className="text-xl font-bold text-foreground mb-4">No COD in my area, and why?</h3>
      <p>
        The availability of COD (Cash on Delivery) depends on the accessibility of the courier partner service in your area to accept cash as payment at the time of delivery. In case COD is not available at our location, eversol.in will not allow you to purchase the product through the mode of COD and leave a message by saying, COD not available in your area.
      </p>
    </section>

    <section>
      <h3 className="text-xl font-bold text-foreground mb-4">No COD option for my product, and why?</h3>
      <p>
        The COD option for any of the products ordered from eversol.in is acceptable if the price of that cart value is up to 25k. But if the selected products exceed (from 25k), EVERSOL INDIA will ask you to pay a partial payment (25%) in advance and remaining after the delivery of the product at your doorstep. EVERSOL INDIA will even suggest you pay using different modes of payment methods like Online Transactions, Debit Card and Credit Card (VISA, MASTER, etc.)
      </p>
    </section>

    <section>
      <h3 className="text-xl font-bold text-foreground mb-4">Payment process interrupted, what to do?</h3>
      <p>
        If by chance there is a failure in the link while doing online transaction, then do not panic. You can check your balance if the amount is deducted from your account, which means the order has been placed. But in case it stills shows order is not placed yet, you can contact us . Our support team feels happy to solve your issues!
      </p>
    </section>

    <section>
      <h3 className="text-xl font-bold text-foreground mb-4">Steps taken by eversol.in for card frauds?</h3>
      <p>
        eversol.in is very much aware of card fraud. Therefore, it along with the trusted online partners endlessly monitor suspicious activity and fraud transactions to get away from card frauds. Any suspicious activity comes in the notice that is not allowed for transactions in any manner. In case, eversol.in is not able to rule out the chance of fraud category, the transaction kept on hold, and not allowed with the further process until proper identification not revealed.
      </p>
    </section>
  </div>
);

const PrivacyPolicyContent = () => (
  <div className="space-y-8">
    <section>
      <p>
        eversol.in understands that you do care for your personal information provided, and you need to know how it is used or shared; we appreciate your trust with us to look after that sensibly. We work to keep your information safe or secure because your privacy is important to us.
      </p>
      <p className="mt-4">
        We at eversol.in would like to inform you our site asks to provide all your personal information before availing your preferred product and services from us. We use your data to help sellers in handling orders, delivering the ordered gamut & services, processing payment options, communicating with you about placed orders & promotional offers, recommending best products and services as per your requirements, displaying content such as wishlists & customer reviews and maintaining your accounts with us to provide you with our new projects. Therefore you are requested to read the privacy policy carefully before using the site either to buy any product or for your other business needs.
      </p>
      <p className="mt-4">
        The feedback we receive from the valued customers helps us to identify the problem and improve their shopping experience at eversol.in. Moreover, we also use your private info to improve our platform, prevent against any fraud or abuses of our website and support third parties to carry out all the technical, logistical and several other utilities on our behalf.
      </p>
    </section>

    <section>
      <h3 className="text-xl font-bold text-foreground mb-4">Personal Information Collected</h3>
      <p>
        Personal information collected from the users is required for us to identify the customers and retain them with us for the future. The assortment of customers' personal detail such as name, contact number, email address, postal address, and payment modes are used to provide products & services as per their specifications provided. In addition to these, we do collect your details through the use of third-party platforms such as social media facilities, and business services. This means, we also can get some of the information about your details like username, profile picture, friend list, and activity profile while you access our services through social media platforms.
      </p>
      <p className="mt-4">
        Gathering of personal information of any user is helpful to improve our services to meet the maximum customer satisfaction while they shop with us. However, you have the choice not to reveal certain info, but you might not be availing of the benefits of several features provided by us.
      </p>
    </section>

    <section>
      <h3 className="text-xl font-bold text-foreground mb-4">Cookies</h3>
      <p>
        eversol.in uses temporary cookies to store certain data for further reference. Cookies generally store the data (usually not personal) that is used by us, including our service providers for technical administration of the website, and research & development. Cookies are alphanumeric, and we transfer cookies to your computer's hard drive through your web browser to enable our systems to recognize your browser details.
      </p>
      <p className="mt-4">
        Cookies are used to customize the site for visitors and show ads related to that page. This data is used for serving advertisements, which in turn, may be used by the third parties to recognize unique cookies on your browser. We make sure not to store any personal identity in the cookies.
      </p>
    </section>

    <section>
      <h3 className="text-xl font-bold text-foreground mb-4">Sharing of Personal Data</h3>
      <p>
        eversol.in shares and disclose certain personal data to third-party services who are working on behalf of us. The work of third parties may include delivery of products, fulfilling your request, sending emails, and whether products' selling status (already sold out or yet to be sold). We ensure the third parties are authorized and responsible to keep your information secured, and not allowing any unauthorized services to access them.
      </p>
      <p className="mt-4">
        We share a few other details like device location and network carriers when you access our services. We ensure that the bank account number, credit card number, and password of the mail id will not be accessed by any advertisers and marketers.
      </p>
    </section>

    <section className="pt-6 border-t">
      <p className="italic text-sm">
        ***We have the right to do any modification or alteration for the privacy policy anytime. But do not worry, any changes occur to this policy will be posted.
      </p>
    </section>
  </div>
);

const CancellationPolicyContent = () => (
  <div className="space-y-8">
    <section>
      <p>
        Please read the refund & cancellation procedure of our site carefully before placing your order with eversol.in.
      </p>
    </section>

    <section>
      <h3 className="text-xl font-bold text-foreground mb-4">What is the return policy in eversol.in?</h3>
      <p>
        When you order at eversol.in, it provides 100% genuine products and takes utmost care of the customer's desire for the same and releases the fresh product in excellent condition. However, while receiving the product if it is found damaged or defective or not in the same condition as per its specifications or not delivered as per your order then you have the right to return the item.
      </p>
      <p className="mt-4">
        Our Return Policy provides you the opportunity to have a replacement of the product or get refund value for the product in a maximum of 7 working days. All these replacements and refunds will be agreed to give the customers only after the product reaches back to EVERSOL INDIA warehouse.
      </p>
    </section>

    <section>
      <h3 className="text-xl font-bold text-foreground mb-4">What is the cancellation guiding principle?</h3>
      <p>
        eversol.in make sure that the correct product is delivered to the exact location. In case you have received the product and found it is not the same you ordered, then you can ask for a refund or replacement of the same. Even, we will refund the complete amount of the order in case the ordered item is not delivered to your location.
      </p>
    </section>

    <section>
      <h3 className="text-xl font-bold text-foreground mb-4">How can you cancel your order?</h3>
      <p>
        At EVERSOL INDIA, order once booked is delivered by default. But in the case that you feel your product to be canceled and find that the package is open or tampered; or else, you do not like the product, which is not installed then email us .
      </p>
      <p className="mt-4">
        Once you request for cancellation of the particular product, it will wait for the same to be received by eversol.in; if the selected item along with the packaging is complete, then it will initiate a refund amount. As soon as a refund is initiated, you will be notified with an email saying that your amount is refunded. It might take a few days (7 working days) for the banks to process your refunds.
      </p>
    </section>

    <section>
      <h3 className="text-xl font-bold text-foreground mb-4">What are the guidelines for Return Policy?</h3>
      <p>
        There are certain procedures that EVERSOL INDIA conforms when it comes to returning policy of any product:
      </p>
      <ul className="list-disc pl-6 mt-4 space-y-2">
        <li>Items must be unused/uninstalled when returned and with original packing, tags, invoices, and bills.</li>
        <li>You may place a request for replacement or refund from eversol.in if the wrong product delivered to you.</li>
        <li>Replacement is available only for the exact product notified by you; exchange facility not possible with other items.</li>
        <li>Returns not accepted if anything is missing from the package or the product is unavailable in the same condition when delivered.</li>
        <li>Only the gift items will not be replaced, but in the case, while purchasing a product, and you have got a gift then you can return that along with the product returned.</li>
        <li>We do not accept return policy for products of specific categories.</li>
      </ul>
    </section>

    <section className="pt-6 border-t">
      <p className="italic text-sm">
        ***We have the right to change the refund & cancellation policy anytime. But you don't worry, any changes to this policy will be posted.
      </p>
    </section>
  </div>
);

const TermsAndConditionsContent = () => (
  <div className="space-y-8">
    <section>
      <p>
        Welcome to www.eversol.in, which is owned and operated by Varistor Technologies Private Limited with its registered office . You can access our Site from a computer or mobile phone. These Terms of Usage govern your conduct and your practice of our site, regardless of the means of access.
      </p>
      <p className="mt-4">
        You may also use our all Solar Products wherein you can book any preferred item as per any brand provided by our leading brand partners and these Terms of Use also govern your use of the Interactive and Solar Services.
      </p>
      <p className="mt-4">
        The Site is only to be used by you for personal and commercial (B2C & B2B) use and information. Your use of the products and services of the Site shall be ruled by these Terms and Conditions ("Terms of Use") along with the Privacy Policy, Refund and Return Policy, Shipping Policy, and Cancellation, as amended from time to time.
      </p>
      <p className="mt-4">
        The Terms & Conditions (T&C) include several provisions, and those do apply to all our products and website. Please read them carefully. We also recommend that you save General Terms and Conditions so that you can consult them at a later time.
      </p>
    </section>

    <section>
      <ul className="list-disc pl-6 mt-4 space-y-2">
        <li>Order processing time may take few more days than the standard period.</li>
        <li>COD (Cash on Delivery) order may take maximum 4 to 5 days.</li>
        <li>We offer secure online payment mode options such as NEFT, RTGS and IMPS to process your order.</li>
        <li>Once order get dispatched and especially product get installed, return request cannot be considered.</li>
        <li>One buyer can avail one time discount during the sale period.</li>
        <li>EMI available only on Solar Power System.</li>
        <li>EMI facility available.</li>
        <li>The entire range of products deliver in India as per the products availability.</li>
        <li>Herewith you are agreeing to not having any objection on any environmental benefits such as carbon credits, environments benefits during the entire period of the Products lifecycle and EVERSOL INDIA will have the full rights to claims such benefits. However, EVERSOL INDIA may liquidate the benefits among customers via discount, vouchers.</li>
      </ul>
      <p className="mt-4">
        EVERSOL INDIA may modify the Terms & Conditions of Use of the Website at any time and without any prior notification. You can regularly review and access the latest version of our Terms & Conditions on the Site. At the exact time, the modified Terms & Conditions of our site is not acceptable, you can discontinue using the Service. However, if you continue to use the Service, you shall be considered to have agreed to abide by the modified Terms & Conditions of Use of the Site.
      </p>
    </section>

    <section>
      <h3 className="text-xl font-bold text-foreground mb-4">No Cost EMI</h3>
      <p>
        This particular page detail is a limited period Offer provided by our EVERSOL INDIA Marketplace Platform. Please read these terms and conditions (T&C) carefully before availing of the discounted deals on the required products. It is essential to understand that by availing of the Offer and using our Platform, you agree to be bound by these terms and conditions. And, if you refuse to accept these terms and conditions, you will not be able to get the offers provided under our Platform.
      </p>
      <ul className="list-decimal pl-6 mt-4 space-y-2">
        <li>To avail of the discounted offer on eversol.in, you hereby confirm to register with ZestMoney ("Mandate to Register"), applicable for Website and Android; obtain a loan amount based on your earning status with 0% interest.</li>
        <li>No cost equated installment ("No Cost EMI") purchases up to three months can be made by you using a credit limit only issued by ZestMoney Merchant Partner. However, No Cost EMI is not available on purchases made using other payment methods such as, debit & credit cards or net banking or cash on delivery, or any other payment method.</li>
        <li>EVERSOL INDIA No Cost EMI facility supports you in converting the cost of your purchase into interest-free EMIs with "No Hidden Charges" involved.</li>
        <li>You can shop varied categories of solar products with Instant Approval, using "Card Less EMI" only at eversol.in.</li>
        <li>"Buy Now, Pay Later" offers provided by EVERSOL INDIA are point-of-sale installment loans that allow you to make more purchases and pay for them at a future date, limited over three months.</li>
      </ul>
    </section>
  </div>
);

const policyContent: Record<string, { title: string; content?: string; component?: React.ReactNode }> = {
  '/shipping-policy': {
    title: 'Shipping Policy',
    component: <ShippingPolicyContent />
  },
  '/payment-policy': {
    title: 'Payment Policy',
    component: <PaymentPolicyContent />
  },
  '/privacy': {
    title: 'Privacy Policy',
    component: <PrivacyPolicyContent />
  },
  '/cancellation-policy': {
    title: 'Cancellation and Returns Policy',
    component: <CancellationPolicyContent />
  },
  '/terms': {
    title: 'Terms and Conditions',
    component: <TermsAndConditionsContent />
  }
};

const PolicyPage = () => {
  const location = useLocation();
  const policy = policyContent[location.pathname] || {
    title: 'Legal Policy',
    content: 'This page contains legal information regarding EVERSOL INDIA services.'
  };

  return (
    <Layout>
      <div className="pt-32 pb-16 min-h-[60vh]">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-heading font-bold text-foreground mb-8 border-b pb-4">
              {policy.title}
            </h1>
            <div className="prose prose-lg max-w-none text-muted-foreground leading-relaxed">
              {policy.component ? policy.component : <p>{policy.content}</p>}
              <p className="mt-12 pt-8 border-t">
                For detailed information, please contact our support team at{' '}
                <a href="mailto:info@eversol.in" className="text-solar font-medium hover:underline">
                  info@eversol.in
                </a>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default PolicyPage;
