import { NextRequest, NextResponse } from 'next/server';
// No longer need crypto for hash validation if using Validation API
// import crypto from 'crypto';
import axios from 'axios'; // Import axios to make HTTP requests

// It's recommended to use environment variables for sensitive information
const STORE_ID = process.env.SSLCOMMERZ_STORE_ID || 'laiju6802257f41cec'; // Replace with environment variable
const STORE_PASSWORD = process.env.SSLCOMMERZ_STORE_PASSWORD || 'laiju6802257f41cec@ssl'; // Replace with environment variable
const IS_LIVE = process.env.NODE_ENV === 'production'; // Use live API in production

// Determine the correct validation API URL based on the environment
const VALIDATION_API_URL = IS_LIVE
  ? 'https://securepay.sslcommerz.com/validator/api/validationserverAPI.php'
  : 'https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php';


export async function POST(req: NextRequest) {
  try {
    const data = await req.json(); // Assuming SSLCommerz sends JSON

    console.log('SSLCommerz IPN received:', data);

    const { tran_id, val_id, status, amount, currency } = data;

    if (!tran_id || !val_id || !status || !amount || !currency) {
        console.error('IPN data missing mandatory fields');
        return NextResponse.json({ success: false, error: 'Missing mandatory IPN data' }, { status: 400 });
    }


    // --- IPN Validation Logic using Order Validation API ---
    console.log(`Validating Transaction ID: ${tran_id} with Validation ID: ${val_id}`);

    try {
        const validationResponse = await axios.get(VALIDATION_API_URL, {
            params: {
                val_id: val_id,
                store_id: STORE_ID,
                store_passwd: STORE_PASSWORD,
                format: 'json' // Requesting JSON format
            }
        });

        const validationData = validationResponse.data;

        console.log('SSLCommerz Validation API Response:', validationData);

        // Check API connection status
        if (validationData.APIConnect !== 'DONE') {
            console.error('Validation API connection failed:', validationData.APIConnect);
             // Depending on your strategy, you might want to retry or log this error
             // Returning 500 might cause SSLCommerz to retry IPN
             return NextResponse.json({ success: false, error: 'Validation API connection failed' }, { status: 500 });
        }

        // Check the transaction status from the validation API response
        const validatedStatus = validationData.status;
        const validatedAmount = parseFloat(validationData.amount); // Parse to number
        const validatedCurrency = validationData.currency;

        // IMPORTANT Security Checks:
        // 1. Verify the transaction ID matches the one in your database
        // 2. Verify the amount and currency match the order in your database
        // 3. Check the transaction status from the validation API response

        // TODO: Replace with your database logic to fetch the order by tran_id
        // const order = await findOrderByTransactionId(tran_id);
        // if (!order) {
        //     console.error(`Order not found for transaction ID: ${tran_id}`);
        //     return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 }); // Or a status that doesn't cause IPN retries if order not found
        // }

        // TODO: Implement rigorous amount and currency validation against your order data
        // if (validatedAmount !== order.totalAmount || validatedCurrency !== order.currency) {
        //     console.error(`Amount or currency mismatch for transaction ID: ${tran_id}`);
        //     // Log this potential fraud attempt
        //     return NextResponse.json({ success: false, error: 'Amount or currency mismatch' }, { status: 400 });
        // }


        // --- Order Status Update Logic based on Validated Status ---
        // Based on SSLCommerz documentation, 'VALID' and 'VALIDATED' mean successful payment.
        // You might also need to handle 'PENDING' if you want to track that state.
        switch (validatedStatus) {
          case 'VALID':
          case 'VALIDATED':
            // Payment successful and validated
            // TODO: Update your database: mark order as paid, record transaction details (bank_tran_id, card_type, etc.)
            // await updateOrderStatus(order.id, 'paid', validationData);
            console.log(`Order ${tran_id} successfully validated and marked as paid.`);
            break;
          case 'PENDING':
             // Transaction is still pending
             // TODO: Update your database: mark order as pending payment or similar.
             // This might require future checks or relying on a later IPN.
             console.log(`Order ${tran_id} status is pending.`);
             break;
          case 'FAILED':
          case 'CANCELLED':
          case 'EXPIRED':
          case 'UNATTEMPTED':
            // Payment failed or cancelled
            // TODO: Update your database: mark order as failed, cancelled, etc.
            // await updateOrderStatus(order.id, validatedStatus.toLowerCase());
            console.log(`Order ${tran_id} status is ${validatedStatus}.`);
            break;
          default:
            // Handle unknown or unhandled statuses
            console.warn(`Order ${tran_id} has unhandled validated status: ${validatedStatus}`);
            // Optionally update order status to reflect the unhandled state
             // await updateOrderStatus(order.id, 'unhandled_status', { sslcommerz_status: validatedStatus });
            break;
        }

        // --- End Order Status Update Logic ---

        // Send a success response back to SSLCommerz
        // SSLCommerz expects a 200 OK response to confirm IPN received and processed.
        return NextResponse.json({ success: true, message: 'IPN received and validated' }, { status: 200 });

    } catch (validationError) {
        console.error('Error calling SSLCommerz Validation API:', validationError);
        // If validation API call fails, treat as processing error.
        return NextResponse.json({ success: false, error: 'Error validating transaction with SSLCommerz' }, { status: 500 });
    }


  } catch (error) {
    console.error('Error processing SSLCommerz IPN:', error);
    // Send an error response back to SSLCommerz
    // Returning a non-200 status might cause SSLCommerz to retry the IPN.
    return NextResponse.json({ success: false, error: 'Failed to process IPN' }, { status: 500 });
  }
}

// You might also need a GET handler if SSLCommerz sends test requests via GET
// export async function GET(req: NextRequest) {
//   return NextResponse.json({ message: 'IPN listener is active' }, { status: 200 });
// }