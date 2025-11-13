import { lemonSqueezyApiInstance } from "@/utils/axios";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  // Helper endpoint to verify store configuration
  try {
    const response = await lemonSqueezyApiInstance.get("/stores");
    return NextResponse.json({ 
      message: "Purchase Product API is running",
      endpoint: "/api/purchaseProduct",
      method: "POST",
      stores: response.data?.data || [],
      currentStoreId: process.env.LEMON_SQUEEZY_STORE_ID,
    });
  } catch (error: any) {
    return NextResponse.json({ 
      message: "Purchase Product API is running",
      endpoint: "/api/purchaseProduct",
      method: "POST",
      error: "Could not fetch stores",
      currentStoreId: process.env.LEMON_SQUEEZY_STORE_ID,
    });
  }
}

export async function POST(req: NextRequest) {
  try {
    const reqData = await req.json();
    
    // Use default Pro plan variant ID if not provided
    // Note: This should be the numeric variant ID from Lemon Squeezy dashboard
    const variantId = reqData.variantId || reqData.productId || process.env.LEMON_SQUEEZY_PRO_PLAN_PRODUCT_ID || '1084942';

    if (!reqData.user_id) {
      return NextResponse.json(
        { message: "user_id is required" },
        { status: 400 }
      );
    }

    if (!process.env.LEMON_SQUEEZY_STORE_ID) {
      return NextResponse.json(
        { message: "Store ID not configured" },
        { status: 500 }
      );
    }

    // Success and cancel URLs for redirect after payment
    // Use localhost for local development, production URL for production
    const isDevelopment = process.env.NODE_ENV === 'development';
    const baseUrl = isDevelopment 
      ? 'http://localhost:3003'
      : (process.env.NEXT_PUBLIC_APP_URL || 'https://www.asmrbible.app');
    
    // Get return URL from request, or default to /bible
    const returnUrl = reqData.returnUrl || '/bible';
    const successUrl = `${baseUrl}/payment/success?returnUrl=${encodeURIComponent(returnUrl)}`;
    const cancelUrl = `${baseUrl}${returnUrl}`;

    const response = await lemonSqueezyApiInstance.post("/checkouts", {
      data: {
        type: "checkouts",
        attributes: {
          checkout_data: {
            custom: {
              user_id: reqData.user_id,
            },
          },
          product_options: {
            redirect_url: successUrl,
            receipt_button_text: "Continue to Bible Reading",
            receipt_link_url: successUrl,
          },
        },
        relationships: {
          store: {
            data: {
              type: "stores",
              id: process.env.LEMON_SQUEEZY_STORE_ID.toString(),
            },
          },
          variant: {
            data: {
              type: "variants",
              id: variantId.toString(),
            },
          },
        },
      },
    });

    // Log the full response for debugging
    console.log("Lemon Squeezy API Response:", JSON.stringify(response.data, null, 2));

    // Extract checkout URL from response
    const checkoutUrl = response.data?.data?.attributes?.url;
    
    if (!checkoutUrl) {
      console.error("No checkout URL in response:", response.data);
      return NextResponse.json(
        { 
          message: "No checkout URL received from Lemon Squeezy",
          response: response.data 
        },
        { status: 500 }
      );
    }

    console.log("Generated checkout URL:", checkoutUrl);
    
    // Verify the checkout URL matches the expected store subdomain
    // If the generated URL has a different subdomain, log a warning
    const expectedSubdomain = 'asmrtbible';
    if (checkoutUrl && !checkoutUrl.includes(expectedSubdomain)) {
      console.warn(`⚠️ Checkout URL subdomain mismatch! Expected: ${expectedSubdomain}, Got: ${checkoutUrl}`);
      console.warn('This might indicate the Store ID is incorrect. Please verify LEMON_SQUEEZY_STORE_ID matches the asmrtbible store.');
    }
    
    return NextResponse.json({ checkoutUrl });
  } catch (error: any) {
    console.error("Purchase product error:", error);
    console.error("Error details:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    return NextResponse.json(
      { 
        message: "An error occurred", 
        error: error.message,
        details: error.response?.data || "No additional details"
      },
      { status: 500 }
    );
  }
}

