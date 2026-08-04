import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const MERCHANT_ID = Deno.env.get("ZARINPAL_MERCHANT_ID") ?? "";
const SANDBOX = Deno.env.get("ZARINPAL_SANDBOX") === "true";
const ZARINPAL_API = SANDBOX
  ? "https://sandbox.zarinpal.com/pg/v4"
  : "https://api.zarinpal.com/pg/v4";
const ZARINPAL_GATEWAY = SANDBOX
  ? "https://sandbox.zarinpal.com/pg/StartPay"
  : "https://www.zarinpal.com/pg/StartPay";

function jsonResponse(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const url = new URL(req.url);
    const action = url.searchParams.get("action") ?? "create";

    // ── Create payment ──────────────────────────────────────────
    if (action === "create") {
      const body = await req.json();
      const { orderId } = body as { orderId: string };

      if (!orderId) {
        return jsonResponse({ error: "Missing orderId" }, 400);
      }

      // Fetch the order
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .select("*")
        .eq("id", orderId)
        .maybeSingle();

      if (orderError || !order) {
        return jsonResponse({ error: "Order not found" }, 404);
      }

      if (order.status === "paid") {
        return jsonResponse({ error: "Order already paid" }, 400);
      }

      const amount = order.total_amount;
      const callbackUrl = `${url.origin}/#payment/success/{authority}`;
      const description = `RUF Cabinetry Order #${order.id.slice(0, 8)}`;

      const zarinpalRes = await fetch(`${ZARINPAL_API}/payment/request.json`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          merchant_id: MERCHANT_ID,
          amount,
          description,
          callback_url: callbackUrl,
        }),
      });

      const zarinpalData = await zarinpalRes.json();

      if (!zarinpalData?.data || zarinpalData.data.code !== 100) {
        return jsonResponse(
          { error: "Failed to create payment", detail: zarinpalData },
          400
        );
      }

      const authority = zarinpalData.data.authority;

      // Save authority to order
      await supabase
        .from("orders")
        .update({ authority, updated_at: new Date().toISOString() })
        .eq("id", orderId);

      const gatewayUrl = `${ZARINPAL_GATEWAY}/${authority}`;

      return jsonResponse({ gatewayUrl, authority });
    }

    // ── Verify payment ──────────────────────────────────────────
    if (action === "verify") {
      const body = await req.json();
      const { authority, orderId } = body as { authority: string; orderId: string };

      if (!authority || !orderId) {
        return jsonResponse({ error: "Missing authority or orderId" }, 400);
      }

      const { data: order, error: orderError } = await supabase
        .from("orders")
        .select("*")
        .eq("id", orderId)
        .maybeSingle();

      if (orderError || !order) {
        return jsonResponse({ error: "Order not found" }, 404);
      }

      const verifyRes = await fetch(`${ZARINPAL_API}/payment/verify.json`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          merchant_id: MERCHANT_ID,
          amount: order.total_amount,
          authority,
        }),
      });

      const verifyData = await verifyRes.json();

      // code 100 = success, code 101 = already verified
      if (verifyData?.data && (verifyData.data.code === 100 || verifyData.data.code === 101)) {
        const refId = String(verifyData.data.ref_id ?? "");

        await supabase
          .from("orders")
          .update({
            status: "paid",
            ref_id: refId,
            authority,
            updated_at: new Date().toISOString(),
          })
          .eq("id", orderId);

        // Reduce stock for each order item
        const { data: items } = await supabase
          .from("order_items")
          .select("product_id, quantity")
          .eq("order_id", orderId);

        if (items) {
          for (const item of items) {
            await supabase.rpc("decrement_stock", {
              p_product_id: item.product_id,
              p_quantity: item.quantity,
            }).then(() => {});
          }
        }

        return jsonResponse({ success: true, refId });
      }

      // Payment failed
      await supabase
        .from("orders")
        .update({
          status: "failed",
          authority,
          updated_at: new Date().toISOString(),
        })
        .eq("id", orderId);

      return jsonResponse({ success: false, detail: verifyData }, 400);
    }

    return jsonResponse({ error: "Unknown action" }, 400);
  } catch (err) {
    return jsonResponse({ error: err.message }, 500);
  }
});
