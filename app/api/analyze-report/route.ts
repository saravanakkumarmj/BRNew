import { type NextRequest, NextResponse } from "next/server"

const LANGFLOW_URL = process.env.LANGFLOW_URL || "http://localhost:7860"
const FLOW_ID = process.env.LANGFLOW_FLOW_ID || "76e6bbab-83bc-4ea6-82e0-85b4fef653b9"
const LANGFLOW_API_KEY = process.env.LANGFLOW_API_KEY || "sk-4RptKLrC61goX_blYEH0oXFdrqJWMrZBMiKiGOmBG9M"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const name = formData.get("name") as string
    const age = formData.get("age") as string
    const gender = formData.get("gender") as string

    if (!file || !name || !age || !gender) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    console.log("[v0] Environment check:")
    console.log("[v0] LANGFLOW_URL:", LANGFLOW_URL)
    console.log("[v0] FLOW_ID:", FLOW_ID)
    console.log("[v0] API Key present:", !!LANGFLOW_API_KEY)

    if (!LANGFLOW_URL || !FLOW_ID || !LANGFLOW_API_KEY) {
      return NextResponse.json(
        { error: "Missing Langflow configuration. Please check environment variables." },
        { status: 500 },
      )
    }

    console.log("[v0] Uploading PDF to Langflow...")
    console.log("[v0] Upload URL:", `${LANGFLOW_URL}/api/v1/upload/${FLOW_ID}`)

    const fileBuffer = await file.arrayBuffer()
    const blob = new Blob([fileBuffer], { type: file.type })

    const uploadFormData = new FormData()
    uploadFormData.append("file", blob, file.name)

    const uploadController = new AbortController()
    const uploadTimeout = setTimeout(() => uploadController.abort(), 30000) // 30 second timeout

    try {
      const uploadResponse = await fetch(`${LANGFLOW_URL}/api/v1/upload/${FLOW_ID}`, {
        method: "POST",
        headers: {
          "x-api-key": LANGFLOW_API_KEY,
        },
        body: uploadFormData,
        signal: uploadController.signal,
      })

      clearTimeout(uploadTimeout)

      console.log("[v0] Upload response status:", uploadResponse.status)

      if (!uploadResponse.ok) {
        const errorText = await uploadResponse.text()
        console.error("[v0] Upload failed with status:", uploadResponse.status)
        console.error("[v0] Upload error response:", errorText)
        throw new Error(`Upload failed (${uploadResponse.status}): ${errorText.substring(0, 200)}`)
      }

      let uploadData
      try {
        uploadData = await uploadResponse.json()
      } catch (parseError) {
        const responseText = await uploadResponse.text()
        console.error("[v0] Failed to parse upload response as JSON:", responseText)
        throw new Error(`Invalid response from upload endpoint: ${responseText.substring(0, 200)}`)
      }

      const filePath = uploadData.file_path
      console.log("[v0] File uploaded successfully:", filePath)

      console.log("[v0] Running Langflow analysis...")
      console.log("[v0] Analysis URL:", `${LANGFLOW_URL}/api/v1/run/${FLOW_ID}`)

      const analysisController = new AbortController()
      const analysisTimeout = setTimeout(() => analysisController.abort(), 60000) // 60 second timeout

      const analysisResponse = await fetch(`${LANGFLOW_URL}/api/v1/run/${FLOW_ID}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": LANGFLOW_API_KEY,
        },
        body: JSON.stringify({
          tweaks: {
            "File-6kS21": {
              path: [filePath],
            },
          },
        }),
        signal: analysisController.signal,
      })

      clearTimeout(analysisTimeout)

      console.log("[v0] Analysis response status:", analysisResponse.status)

      if (!analysisResponse.ok) {
        const errorText = await analysisResponse.text()
        console.error("[v0] Analysis failed with status:", analysisResponse.status)
        console.error("[v0] Analysis error response:", errorText)

        // Try to parse as JSON for structured error
        try {
          const errorData = JSON.parse(errorText)
          throw new Error(errorData.detail || `Analysis failed (${analysisResponse.status})`)
        } catch {
          // If not JSON, use the text directly
          throw new Error(`Analysis failed (${analysisResponse.status}): ${errorText.substring(0, 200)}`)
        }
      }

      let result
      try {
        result = await analysisResponse.json()
      } catch (parseError) {
        const responseText = await analysisResponse.text()
        console.error("[v0] Failed to parse analysis response as JSON:", responseText)
        throw new Error(`Invalid response from analysis endpoint: ${responseText.substring(0, 200)}`)
      }

      console.log("[v0] Analysis completed successfully")
      console.log("[v0] Result structure:", JSON.stringify(result, null, 2))

      const analysisText = result.outputs[0].outputs[0].results.message.text

      // The analysis text should contain blood test results and recommendations
      const analysisResult = {
        userMetadata: {
          fullName: name,
          age: age,
          gender: gender,
        },
        rawAnalysis: analysisText,
        // Parse blood results from the analysis text if structured
        bloodResults: parseBloodResults(analysisText),
        summary: extractSummary(analysisText),
        recommendations: extractRecommendations(analysisText),
      }

      return NextResponse.json(analysisResult)
    } catch (fetchError) {
      if (fetchError instanceof Error) {
        if (fetchError.name === "AbortError") {
          console.error("[v0] Request timed out")
          throw new Error("Request timed out. Please try again.")
        }
        console.error("[v0] Fetch error:", fetchError.message)
        console.error("[v0] Error stack:", fetchError.stack)
        throw new Error(`Network error: ${fetchError.message}`)
      }
      throw fetchError
    }
  } catch (error) {
    console.error("[v0] Error analyzing report:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to analyze report",
        details: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 },
    )
  }
}

function parseBloodResults(analysisText: string) {
  // This is a simple parser - adjust based on your Langflow output format
  const results = []
  const lines = analysisText.split("\n")

  for (const line of lines) {
    // Look for patterns like "Hemoglobin: 13.5 g/dL (Normal: 13.5-17.5)"
    const match = line.match(/([A-Za-z\s]+):\s*([\d.]+)\s*([^$$]+)\s*\(([^)]+)$$/i)
    if (match) {
      const [, parameter, value, unit, range] = match
      results.push({
        parameter: parameter.trim(),
        value: value.trim(),
        unit: unit.trim(),
        normalRange: range.trim(),
        status: determineStatus(value, range),
      })
    }
  }

  return results
}

function determineStatus(value: string, range: string): "normal" | "high" | "low" {
  const numValue = Number.parseFloat(value)
  const rangeMatch = range.match(/([\d.]+)-([\d.]+)/)

  if (rangeMatch) {
    const [, min, max] = rangeMatch
    const minValue = Number.parseFloat(min)
    const maxValue = Number.parseFloat(max)

    if (numValue < minValue) return "low"
    if (numValue > maxValue) return "high"
  }

  return "normal"
}

function extractSummary(analysisText: string): string {
  // Look for summary section or use first paragraph
  const summaryMatch = analysisText.match(/summary:?\s*([^\n]+(?:\n(?!\n)[^\n]+)*)/i)
  if (summaryMatch) {
    return summaryMatch[1].trim()
  }

  // Return first substantial paragraph
  const paragraphs = analysisText.split("\n\n")
  return paragraphs[0] || "Analysis completed successfully."
}

function extractRecommendations(analysisText: string): string[] {
  const recommendations: string[] = []
  const lines = analysisText.split("\n")

  let inRecommendations = false
  for (const line of lines) {
    if (line.toLowerCase().includes("recommendation")) {
      inRecommendations = true
      continue
    }

    if (inRecommendations && line.trim()) {
      // Look for bullet points or numbered lists
      const cleaned = line.replace(/^[-*•\d.)\s]+/, "").trim()
      if (cleaned) {
        recommendations.push(cleaned)
      }
    }
  }

  return recommendations
}
