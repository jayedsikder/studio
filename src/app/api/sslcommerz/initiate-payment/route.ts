
import { NextRequest, NextResponse } from 'next/server';
import SSLCommerzPayment from 'sslcommerz-lts';

// It's crucial to use environment variables for sensitive information and configurations
const store_id = process.env.SSLCOMMERZ_STORE_ID;
const store_passwd = process.env.SSLCOMMERZ_STORE_PASSWORD;
const is_live = process.env.NODE_ENV === 'production'; // Use NODE_ENV to determine live/sandbox
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

export async function POST(req: NextRequest) {
  // Strict check for essential environment variables first
  const missingVars = [];
  if (!store_id) missingVars.push('SSLCOMMERZ_STORE_ID');
  if (!store_passwd) missingVars.push('SSLCOMMERZ_STORE_PASSWORD');
  if (!baseUrl) missingVars.push('NEXT_PUBLIC_BASE_URL');

  if (missingVars.length > 0) {
    const errorMsg = 'Payment gateway server configuration error. Admin check required.';
    const detailsMsg = `The following environment variables are missing or not loaded: ${missingVars.join(', ')}. Please check your .env file and restart the server.`;
    console.error(`ERROR: ${errorMsg} ${detailsMsg}`);
    return NextResponse.json({ success: false, error: errorMsg, details: detailsMsg }, { status: 500 });
  }

  try {
    const { items, totalPrice, customerInfo } = await req.json();

    if (!items || !totalPrice || !customerInfo) {
        console.error('ERROR: Missing items, totalPrice, or customerInfo in request body');
        return NextResponse.json({ success: false, error: 'Invalid order data received.', details: 'Required order information is missing.' }, { status: 400 });
    }
    if (totalPrice <= 0) {
      console.error('ERROR: Total price must be greater than 0.');
      return NextResponse.json({ success: false, error: 'Invalid total price.', details: 'Total price must be a positive value.' }, { status: 400 });
    }


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
      ipn_url: `${baseUrl}/api/sslcommerz/ipn`, // Ensure this path is correct and publicly accessible
      shipping_method: 'No', // For digital goods, 'No' or 'Digital'. For physical, 'Courier'.
      product_name: items.map((item: { name: string; }) => item.name).join(', ') || 'E-commerce Product(s)',
      product_category: 'Digital Goods', // Be more specific if possible, e.g., 'Software', 'Ebook'
      product_profile: 'general',
      cus_name: customerInfo.fullName,
      cus_email: customerInfo.email,
      cus_add1: customerInfo.address,
      cus_city: customerInfo.city,
      cus_postcode: customerInfo.postalCode,
      cus_country: 'Bangladesh', // Or make this dynamic if supporting other countries
      cus_phone: customerInfo.phone || '01000000000', // Ensure phone is collected or use a valid placeholder if truly optional by SSLCommerz
      
      // Optional: Shipping information if different from customer info and for physical goods
      // ship_name: customerInfo.fullName, 
      // ship_add1: customerInfo.address,  
      // ship_city: customerInfo.city,
      // ship_postcode: customerInfo.postalCode,
      // ship_country: 'Bangladesh',
      
      // Optional parameters for more detailed product info if needed by SSLCommerz
      // num_of_item: items.length,
      // emi_option: 0, // 0 for no EMI, 1 for EMI enabled

      // You can add value_a, value_b, value_c, value_d for custom parameters if needed
      // value_a: 'ref001_A', 
      // value_b: 'ref002_B',
      // value_c: 'ref003_C',
      // value_d: 'ref004_D'
    };

    console.log('Initiating SSLCommerz payment with data:', JSON.stringify(data, null, 2));

    const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);

    try {
      const apiResponse = await sslcz.init(data);
      console.log('SSLCommerz init API Full Response:', JSON.stringify(apiResponse, null, 2));

      if (apiResponse?.status === 'SUCCESS' && apiResponse?.GatewayPageURL) {
        return NextResponse.json({ GatewayPageURL: apiResponse.GatewayPageURL }, { status: 200 });
      } else {
        const reason = apiResponse?.failedreason || 'Unknown error from SSLCommerz. Check server logs for full API response.';
        console.error('SSLCommerz init failed or missing GatewayPageURL. Reason:', reason, 'Full Response:', apiResponse);
        return NextResponse.json({ success: false, error: 'Failed to get payment URL from SSLCommerz.', details: reason }, { status: 500 });
      }

    } catch (apiError: any) { 
      console.error('Exception during SSLCommerz init API call:', apiError);
      const details = apiError?.message || (typeof apiError === 'string' ? apiError : 'The SSLCommerz library threw an unexpected error. Check server logs.');
      return NextResponse.json({ success: false, error: 'Error calling SSLCommerz payment library.', details }, { status: 500 });
    }

  } catch (error: any) { 
    console.error('Error processing initiate-payment request:', error);
    const details = error?.message || 'An unexpected error occurred processing the payment request.';
    // Avoid sending detailed internal error messages to client if not necessary for security
    return NextResponse.json({ success: false, error: 'Failed to initiate payment due to server error.', details: "Internal server error." }, { status: 500 });
  }
}

