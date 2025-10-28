import { type NextRequest, NextResponse } from "next/server"

// Disable SSL certificate verification for self-signed certificates
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"

// Handle CORS preflight requests
export async function OPTIONS(request: NextRequest) {
  return new Response(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization, x-api-key",
      "Access-Control-Max-Age": "86400",
    },
  })
}

export async function POST(request: NextRequest) {
  try {
    const LANGFLOW_URL = process.env.LANGFLOW_URL || "http://localhost:7860"
    const LANGFLOW_API_KEY = process.env.LANGFLOW_API_KEY || ""

    console.log("[v0] Proxy: Received request")
    console.log("[v0] Proxy: Langflow URL:", LANGFLOW_URL)
    console.log("[v0] Proxy: API Key present:", !!LANGFLOW_API_KEY)

    const isLocalhost = LANGFLOW_URL.includes("localhost") || LANGFLOW_URL.includes("127.0.0.1")
    const isProduction = process.env.VERCEL_ENV === "production" || process.env.VERCEL_ENV === "preview"

    if (isLocalhost && isProduction) {
      return NextResponse.json(
        {
          error:
            "Cannot access localhost Langflow from deployed environment. Please deploy Langflow to a publicly accessible URL and update LANGFLOW_URL environment variable.",
        },
        { status: 400 },
      )
    }

    // Get the action from query params
    const { searchParams } = new URL(request.url)
    const action = searchParams.get("action") // 'upload' or 'analyze'
    const flowId = searchParams.get("flowId")

    if (!flowId) {
      return NextResponse.json({ error: "Flow ID is required" }, { 
        status: 400,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization, x-api-key",
        }
      })
    }

    if (action === "upload") {
      // Forward file upload to Langflow
      const formData = await request.formData()
      console.log("[v0] Proxy: Uploading file to Langflow...")
      console.log("[v0] Proxy: Upload URL:", `${LANGFLOW_URL}/api/v1/upload/${flowId}`)

      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 30000) // 30 second timeout

      try {
        const uploadResponse = await fetch(`${LANGFLOW_URL}/api/v1/upload/${flowId}`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${LANGFLOW_API_KEY}`,
            "x-api-key": LANGFLOW_API_KEY,
          },
          body: formData,
          signal: controller.signal,
        })

        clearTimeout(timeoutId)

        const responseText = await uploadResponse.text()
        console.log("[v0] Proxy: Upload response status:", uploadResponse.status)
        console.log("[v0] Proxy: Upload response:", responseText.substring(0, 200))

        if (!uploadResponse.ok) {
          console.error("[v0] Proxy: Upload failed:", responseText)
          return NextResponse.json({ error: `Upload failed: ${responseText}` }, { 
          status: uploadResponse.status,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization, x-api-key",
          }
        })
        }

        const data = JSON.parse(responseText)
        return NextResponse.json(data, {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization, x-api-key",
          }
        })
      } catch (fetchError) {
        clearTimeout(timeoutId)
        if (fetchError instanceof Error) {
          if (fetchError.name === "AbortError") {
            console.error("[v0] Proxy: Upload timeout")
            return NextResponse.json(
              { error: "Upload timeout: Langflow server took too long to respond" },
              { 
                status: 504,
                headers: {
                  "Access-Control-Allow-Origin": "*",
                  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
                  "Access-Control-Allow-Headers": "Content-Type, Authorization, x-api-key",
                }
              },
            )
          }
          console.error("[v0] Proxy: Upload fetch error:", fetchError.message)
          return NextResponse.json(
            {
              error: `Failed to connect to Langflow: ${fetchError.message}. Please ensure Langflow is running at ${LANGFLOW_URL}`,
            },
            { 
              status: 503,
              headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type, Authorization, x-api-key",
              }
            },
          )
        }
        throw fetchError
      }
    } else if (action === "analyze") {
      // Forward analysis request to Langflow
      const body = await request.json()
      console.log("[v0] Proxy: Running analysis...")
      console.log("[v0] Proxy: Analysis URL:", `${LANGFLOW_URL}/api/v1/run/${flowId}`)
      console.log("[v0] Proxy: Analysis payload:", JSON.stringify(body, null, 2))

      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 60000) // 60 second timeout for analysis

      try {
        const analysisResponse = await fetch(`${LANGFLOW_URL}/api/v1/run/${flowId}?stream=false`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${LANGFLOW_API_KEY}`,
            "x-api-key": LANGFLOW_API_KEY, // Add x-api-key header as well
          },
          body: JSON.stringify(body),
          signal: controller.signal,
        })

        clearTimeout(timeoutId)

        const responseText = await analysisResponse.text()
        console.log("[v0] Proxy: Analysis response status:", analysisResponse.status)
        console.log("[v0] Proxy: Analysis response:", responseText.substring(0, 200))

        if (!analysisResponse.ok) {
          console.error("[v0] Proxy: Analysis failed:", responseText)
          return NextResponse.json({ error: `Analysis failed: ${responseText}` }, { 
          status: analysisResponse.status,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization, x-api-key",
          }
        })
        }

        const data = JSON.parse(responseText)
        return NextResponse.json(data, {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization, x-api-key",
          }
        })
      } catch (fetchError) {
        clearTimeout(timeoutId)
        if (fetchError instanceof Error) {
          if (fetchError.name === "AbortError") {
            console.error("[v0] Proxy: Analysis timeout")
            return NextResponse.json(
              { error: "Analysis timeout: Langflow server took too long to respond" },
              { 
                status: 504,
                headers: {
                  "Access-Control-Allow-Origin": "*",
                  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
                  "Access-Control-Allow-Headers": "Content-Type, Authorization, x-api-key",
                }
              },
            )
          }
          console.error("[v0] Proxy: Analysis fetch error:", fetchError.message)
          return NextResponse.json(
            {
              error: `Failed to connect to Langflow: ${fetchError.message}. Please ensure Langflow is running at ${LANGFLOW_URL}`,
            },
            { 
              status: 503,
              headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type, Authorization, x-api-key",
              }
            },
          )
        }
        throw fetchError
      }
    } else {
      return NextResponse.json({ error: "Invalid action. Use 'upload' or 'analyze'" }, { 
        status: 400,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization, x-api-key",
        }
      })
    }
  } catch (error) {
    console.error("[v0] Proxy: Error:", error)
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    return NextResponse.json({ error: `Proxy error: ${errorMessage}` }, { 
      status: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization, x-api-key",
      }
    })
  }
}
