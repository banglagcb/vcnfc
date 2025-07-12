export default function ReturnPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Return Policy</h1>
          <div className="bg-white rounded-lg shadow-sm p-8 space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4">1. Return Eligibility</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                We want you to be completely satisfied with your SHAREINFO purchase. However, due to the custom nature
                of our NFC business cards, different return policies apply to different products:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>
                  <strong>Custom/Personalized Cards:</strong> Cannot be returned unless defective or damaged
                </li>
                <li>
                  <strong>Standard Template Cards:</strong> May be returned within 30 days if unused
                </li>
                <li>
                  <strong>Accessories:</strong> May be returned within 30 days in original condition
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">2. Return Process</h2>
              <p className="text-gray-600 leading-relaxed mb-4">To initiate a return, please follow these steps:</p>
              <ol className="list-decimal list-inside text-gray-600 space-y-2">
                <li>Contact our customer service team at support@shareinfobd.com within 30 days of delivery</li>
                <li>Provide your order number and reason for return</li>
                <li>Wait for return authorization and instructions</li>
                <li>Package items securely in original packaging</li>
                <li>Ship items back using provided return label</li>
              </ol>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">3. Refund Policy</h2>
              <p className="text-gray-600 leading-relaxed">
                Refunds will be processed within 5-7 business days after we receive and inspect the returned items.
                Refunds will be issued to the original payment method. Shipping costs are non-refundable unless the
                return is due to our error or a defective product.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">4. Defective or Damaged Items</h2>
              <p className="text-gray-600 leading-relaxed">
                If you receive a defective or damaged item, please contact us immediately. We will provide a prepaid
                return label and either replace the item or provide a full refund, including shipping costs.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">5. Non-Returnable Items</h2>
              <p className="text-gray-600 leading-relaxed mb-4">The following items cannot be returned:</p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Custom-designed NFC cards with personalized information</li>
                <li>Digital products and services</li>
                <li>Items damaged by misuse or normal wear</li>
                <li>Items returned after 30 days</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">6. Exchanges</h2>
              <p className="text-gray-600 leading-relaxed">
                We currently do not offer direct exchanges. If you need a different product, please return the original
                item for a refund and place a new order for the desired item.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">7. Contact Information</h2>
              <p className="text-gray-600 leading-relaxed">
                For questions about returns or to initiate a return, please contact us:
              </p>
              <ul className="list-none text-gray-600 space-y-1 mt-2">
                <li>Email: support@shareinfobd.com</li>
                <li>Phone: +880 1723128440</li>
                <li>Address: Box Culvert Road, Panthopath, Dhaka, Bangladesh</li>
              </ul>
            </section>

            <div className="border-t pt-6 mt-8">
              <p className="text-sm text-gray-500">Last updated: January 1, 2024</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
