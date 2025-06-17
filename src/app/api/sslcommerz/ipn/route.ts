
import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios'; 

// CRITICAL: These MUST be set in your environment variables.
const STORE_ID = process.env.SSLCOMMERZ_STORE_ID;
const STORE_PASSWORD = process.env.SSLCOMMERZ_STORE_PASSWORD;
const IS_LIVE = process.env.NODE_ENV === 'production'; 

// Determine the correct validation API URL based on the environment
const VALIDATION_API_URL = IS_LIVE
  ? 'https://securepay.sslcommerz.com/validator/api/validationserverAPI.php'
  : 'https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php';


export async function POST(req: NextRequest) {
  if (!STORE_ID || !STORE_PASSWORD) {
    console.error('CRITICAL SSLCOMMERZ IPN ERROR: STORE_ID or STORE_PASSWORD not configured in environment variables.');
    // Do not provide detailed error to SSLCommerz, just indicate server error.
    return NextResponse.json({ success: false, error: 'IPN Configuration Error on Server.' }, { status: 500 });
  }

  try {
    const data = await req.json(); 
    console.log('SSLCommerz IPN received - Raw Data:', data);

    // Basic check for essential IPN fields from SSLCommerz
    // Note: SSLCommerz might send form-urlencoded data for IPN. Adjust if req.json() fails.
    // If it's form-urlencoded, you might need: const data = Object.fromEntries(await req.formData());
    // For now, assuming JSON as per some SSLCommerz docs. If issues, check Content-Type of IPN request.
    const { tran_id, val_id, status, amount, currency, bank_tran_id, card_type, card_brand, store_amount } = data;

    if (!tran_id || !val_id || !status ) { // Amount and currency will be validated against API response
        console.error('IPN data missing mandatory fields (tran_id, val_id, status):', data);
        return NextResponse.json({ success: false, error: 'Missing mandatory IPN data fields from SSLCommerz' }, { status: 400 });
    }

    console.log(`Validating IPN for Transaction ID: ${tran_id} with Validation ID: ${val_id}`);

    try {
        const validationResponse = await axios.get(VALIDATION_API_URL, {
            params: {
                val_id: val_id,
                store_id: STORE_ID,
                store_passwd: STORE_PASSWORD,
                format: 'json' 
            }
        });

        const validationData = validationResponse.data;
        console.log('SSLCommerz Validation API Response:', JSON.stringify(validationData, null, 2));

        if (validationData.APIConnect !== 'DONE') {
            console.error('Validation API connection failed:', validationData.APIConnect, 'Full Response:', validationData);
             return NextResponse.json({ success: false, error: 'Validation API connection failed' }, { status: 500 });
        }

        // --- Core Validation Checks ---
        // 1. Transaction ID from IPN (data.tran_id) must match Validation API's tran_id (validationData.tran_id)
        if (data.tran_id !== validationData.tran_id) {
            console.error(`IPN tran_id (${data.tran_id}) does not match Validation API tran_id (${validationData.tran_id}). Potential tampering.`);
            return NextResponse.json({ success: false, error: 'Transaction ID mismatch during validation.' }, { status: 400 });
        }
        
        // 2. Status from Validation API is the source of truth
        const validatedStatus = validationData.status;
        const validatedAmount = parseFloat(validationData.amount); 
        const validatedCurrency = validationData.currency;
        const validatedStoreAmount = parseFloat(validationData.store_amount); // Amount after SSLCommerz fees

        // --- Database / Order Logic (Placeholders) ---
        // TODO: Fetch your order from your database using tran_id (which is validationData.tran_id)
        // const order = await findOrderInYourDB(validationData.tran_id);
        // if (!order) {
        //     console.error(`Order not found in DB for validated transaction ID: ${validationData.tran_id}`);
        //     // Decide if this should be a 404 or 500. SSLCommerz might retry on 500.
        //     // If order genuinely not found, maybe a 200 to stop retries but log as major issue.
        //     return NextResponse.json({ success: true, message: 'IPN for unknown transaction processed to stop retries.' }, { status: 200 });
        // }

        // TODO: Compare validatedAmount and validatedCurrency with order.totalAmount and order.currency from your DB.
        // if (validatedAmount !== order.totalAmount || validatedCurrency !== order.currency) {
        //     console.error(`Amount/Currency mismatch for tran_id ${validationData.tran_id}. IPN: ${validatedAmount} ${validatedCurrency}, Order: ${order.totalAmount} ${order.currency}. Potential tampering.`);
        //     return NextResponse.json({ success: false, error: 'Amount or currency mismatch.' }, { status: 400 });
        // }
        
        // Check if order is already processed to prevent duplicate processing
        // if (order.status === 'paid' && (validatedStatus === 'VALID' || validatedStatus === 'VALIDATED')) {
        //    console.log(`Order ${validationData.tran_id} already marked as paid. Skipping update.`);
        //    return NextResponse.json({ success: true, message: 'IPN received, order already processed.' }, { status: 200 });
        // }


        // --- Update Order Status Based on Validated Status ---
        switch (validatedStatus) {
          case 'VALID':
          case 'VALIDATED':
            console.log(`Payment SUCCESSFUL and VALIDATED for tran_id: ${validationData.tran_id}. Amount: ${validatedAmount} ${validatedCurrency}.`);
            // TODO: Update your database: mark order as paid.
            // Record details like validationData.bank_tran_id, validationData.card_type, validationData.store_amount etc.
            // await updateOrderStatusInYourDB(order.id, 'paid', validationData);
            // TODO: Send confirmation email to customer.
            // TODO: Fulfill order (e.g., grant access to digital product).
            break;
          case 'PENDING':
             console.log(`Payment PENDING for tran_id: ${validationData.tran_id}.`);
             // TODO: Update order status to 'pending' or similar in your DB.
             // await updateOrderStatusInYourDB(order.id, 'pending', validationData);
             break;
          case 'FAILED':
             console.log(`Payment FAILED for tran_id: ${validationData.tran_id}. Reason (if any): ${validationData.error || 'No reason provided.'}`);
             // TODO: Update order status to 'failed' in your DB.
             // await updateOrderStatusInYourDB(order.id, 'failed', validationData);
             break;
          case 'CANCELLED':
            console.log(`Payment CANCELLED for tran_id: ${validationData.tran_id}.`);
            // TODO: Update order status to 'cancelled' in your DB.
            // await updateOrderStatusInYourDB(order.id, 'cancelled', validationData);
            break;
          case 'EXPIRED':
             console.log(`Payment Session EXPIRED for tran_id: ${validationData.tran_id}.`);
             // TODO: Update order status to 'expired' or 'failed' in your DB.
             // await updateOrderStatusInYourDB(order.id, 'expired', validationData);
             break;
          case 'UNATTEMPTED':
             console.log(`Payment UNATTEMPTED for tran_id: ${validationData.tran_id}.`);
             // TODO: Update order status to 'failed' or similar in your DB.
             // await updateOrderStatusInYourDB(order.id, 'failed', validationData);
             break;
          default:
            console.warn(`Order ${validationData.tran_id} has an UNHANDLED validated status from SSLCommerz: ${validatedStatus}`);
            // TODO: Potentially update order to an 'unknown_error' status.
            // await updateOrderStatusInYourDB(order.id, 'unknown_ssl_status', { sslcommerz_status: validatedStatus });
            break;
        }

        // SSLCommerz expects a 200 OK to confirm IPN receipt and processing.
        return NextResponse.json({ success: true, message: 'IPN received and processed successfully.' }, { status: 200 });

    } catch (validationError: any) {
        console.error('Error during SSLCommerz Validation API call:', validationError?.response?.data || validationError?.message || validationError);
        // If validation API call fails, treat as processing error.
        // SSLCommerz might retry IPN on 500.
        return NextResponse.json({ success: false, error: 'Error validating transaction with SSLCommerz.' }, { status: 500 });
    }

  } catch (error: any) {
    console.error('Error processing SSLCommerz IPN raw request:', error);
    // This could be due to req.json() failing if SSLCommerz sends form-data
    // If you suspect this, log req.headers.get('content-type')
    // console.error('IPN Content-Type:', req.headers.get('content-type'));
    return NextResponse.json({ success: false, error: 'Failed to process IPN due to server error.' }, { status: 500 });
  }
}

// Optional: GET handler if SSLCommerz sends test requests via GET or for simple checks
// export async function GET(req: NextRequest) {
//   return NextResponse.json({ message: 'SSLCommerz IPN Listener is active. POST requests are expected for actual IPNs.' }, { status: 200 });
// }

