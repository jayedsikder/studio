
import { NextRequest, NextResponse } from 'next/server';
import SSLCommerzPayment from 'sslcommerz-lts';

// It's crucial to use environment variables for sensitive information and configurations
const store_id = process.env.SSLCOMMERZ_STORE_ID;
const store_passwd = process.env.SSLCOMMERZ_STORE_PASSWORD;
const is_live = process.env.NODE_ENV === 'production'; // Use NODE_ENV to determine live/sandbox
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

export async function POST(req: NextRequest) {
  if (!store_id || !store_passwd) {
    console.error("SSLCOMMERZ_STORE_ID or SSLCOMMERZ_STORE_PASSWORD not set in environment variables.");
    return NextResponse.json({ success: false, error: 'Payment gateway server configuration error. Admin check required.' }, { status: 500 });
  }
  if (!baseUrl) {
    console.error("NEXT_PUBLIC_BASE_URL is not set in environment variables. This is required for callback URLs.");
    return NextResponse.json({ success: false, error: 'Application base URL configuration error. Admin check required.' }, { status: 500 });
  }

  try {
    const { items, totalPrice, customerInfo } = await req.json();

    // Generate a unique transaction ID
    const transactionId = `txn_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;

    // Prepare data for SSLCommerz session request
    const data = {
      total_amount: totalPrice.toFixed(2),
      currency: 'BDT',
      tran_id: transactionId,
      success_url: `${baseUrl}/order-confirmation?status=success&tran_id=${transactionId}`,
      fail_url: `${baseUrl}/order-confirmation?status=fail&tran_id=${transactionId}`,
      cancel_url: `${baseUrl}/cart?status=cancel&tran_id=${transactionId}`,
      ipn_url: `${baseUrl}/api/sslcommerz/ipn`,
      shipping_method: 'No', // Example: 'Courier', 'Digital'
      product_name: items.map(item => item.name).join(', ') || 'E-commerce Product(s)',
      product_category: 'Digital Goods', // Be more specific if possible
      product_profile: 'general',
      cus_name: customerInfo.fullName,
      cus_email: customerInfo.email,
      cus_add1: customerInfo.address,
      cus_city: customerInfo.city,
      cus_postcode: customerInfo.postalCode,
      cus_country: 'Bangladesh', // Or make this dynamic
      cus_phone: customerInfo.phone || '01000000000', // Ensure phone is collected or use a valid placeholder
      ship_name: customerInfo.fullName, // Or specific shipping name
      ship_add1: customerInfo.address,  // Or specific shipping address
      ship_city: customerInfo.city,
      ship_postcode: customerInfo.postalCode,
      ship_country: 'Bangladesh',
      //multi_card_name: 'mastercard,visacard,amexcard', // Example: To allow specific cards
      //value_a: 'ref001_A', // Custom params if needed
      //value_b: 'ref002_B',
      //value_c: 'ref003_C',
      //value_d: 'ref004_D'
    };

    console.log('Initiating SSLCommerz payment with data:', JSON.stringify(data, null, 2));

    const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);

    try {
      const apiResponse = await sslcz.init(data);
      console.log('SSLCommerz init API Full Response:', apiResponse);

      if (apiResponse?.status === 'SUCCESS' && apiResponse?.GatewayPageURL) {
        return NextResponse.json({ GatewayPageURL: apiResponse.GatewayPageURL }, { status: 200 });
      } else {
        // Handle cases where status is FAILED or GatewayPageURL is missing
        const reason = apiResponse?.failedreason || 'Unknown error from SSLCommerz. Check server logs for full API response.';
        console.error('SSLCommerz init failed or missing GatewayPageURL. Reason:', reason, 'Full Response:', apiResponse);
        return NextResponse.json({ success: false, error: 'Failed to get payment URL from SSLCommerz.', details: reason }, { status: 500 });
      }

    } catch (apiError: any) { // Catch errors from the sslcz.init() call itself (e.g. library error, network issue before API call)
      console.error('Exception during SSLCommerz init API call:', apiError);
      const details = apiError?.message || (typeof apiError === 'string' ? apiError : 'The SSLCommerz library threw an unexpected error. Check server logs.');
      return NextResponse.json({ success: false, error: 'Error calling SSLCommerz payment library.', details }, { status: 500 });
    }

  } catch (error: any) { // Catch errors in request processing (e.g., JSON parsing)
    console.error('Error processing initiate-payment request:', error);
    const details = error?.message || 'An unexpected error occurred processing the payment request.';
    return NextResponse.json({ success: false, error: 'Failed to initiate payment due to server error.', details }, { status: 500 });
  }
}
