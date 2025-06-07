import { NextRequest, NextResponse } from 'next/server';
import SSLCommerzPayment from 'sslcommerz-lts';

// It's recommended to use environment variables for sensitive information
const store_id = process.env.SSLCOMMERZ_STORE_ID || 'laiju6802257f41cec'; // Replace with environment variable
const store_passwd = process.env.SSLCOMMERZ_STORE_PASSWORD || 'laiju6802257f41cec@ssl'; // Replace with environment variable
const is_live = false; // Set to true for production

export async function POST(req: NextRequest) {
  try {
    const { items, totalPrice, customerInfo } = await req.json();

    // Generate a unique transaction ID (you might want to use a more robust method)
    const transactionId = `txn_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;

    // Prepare data for SSLCommerz session request
    const data = {
      total_amount: totalPrice.toFixed(2),
      currency: 'BDT', // Or your required currency
      tran_id: transactionId,
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/order-confirmation?status=success&tran_id=${transactionId}`, // TODO: Configure success URL
      fail_url: `${process.env.NEXT_PUBLIC_BASE_URL}/order-confirmation?status=fail&tran_id=${transactionId}`,     // TODO: Configure fail URL
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cart?status=cancel&tran_id=${transactionId}`,   // TODO: Configure cancel URL
      ipn_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/sslcommerz/ipn`, // Your IPN listener URL
      shipping_method: 'No',
      product_name: 'E-commerce Products', // General product name
      product_category: 'Electronic', // Example category
      product_profile: 'general',
      cus_name: customerInfo.fullName,
      cus_email: customerInfo.email,
      cus_add1: customerInfo.address,
      cus_city: customerInfo.city,
      cus_postcode: customerInfo.postalCode,
      cus_country: 'Bangladesh', // Or relevant country
      cus_phone: '1234567890', // TODO: Add phone number to checkout form and use here
      ship_name: customerInfo.fullName,
      ship_add1: customerInfo.address,
      ship_city: customerInfo.city,
      ship_postcode: customerInfo.postalCode,
      ship_country: 'Bangladesh', // Or relevant country
      // TODO: Add more customer and shipping info as required by SSLCommerz and your form
      // TODO: Include item details in the request if necessary for your integration
    };

    console.log('Initiating SSLCommerz payment with data:', data);

    const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);

    try {
      const apiResponse = await sslcz.init(data);

      if (apiResponse.GatewayPageURL) {
        console.log('SSLCommerz GatewayPageURL:', apiResponse.GatewayPageURL);
        // Return the redirect URL to the frontend
        return NextResponse.json({ GatewayPageURL: apiResponse.GatewayPageURL }, { status: 200 });
      } else {
        console.error('SSLCommerz API response missing GatewayPageURL:', apiResponse);
        return NextResponse.json({ success: false, error: 'Failed to get payment URL from SSLCommerz' }, { status: 500 });
      }

    } catch (apiError) {
      console.error('Error calling SSLCommerz init API:', apiError);
      return NextResponse.json({ success: false, error: 'Error initiating payment with SSLCommerz' }, { status: 500 });
    }

  } catch (error) {
    console.error('Error processing initiate-payment request:', error);
    return NextResponse.json({ success: false, error: 'Failed to initiate payment' }, { status: 500 });
  }
}
