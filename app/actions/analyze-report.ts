"use server"

export async function analyzeLangflowReport(formData: FormData) {
  try {
    const file = formData.get("file") as File
    const name = formData.get("name") as string
    const age = formData.get("age") as string
    const gender = formData.get("gender") as string

    if (!file || !name || !age || !gender) {
      return { error: "Missing required fields" }
    }

    const LANGFLOW_URL = process.env.LANGFLOW_URL
    const FLOW_ID = process.env.LANGFLOW_FLOW_ID
    const LANGFLOW_API_KEY = process.env.LANGFLOW_API_KEY

    if (!LANGFLOW_URL || !FLOW_ID || !LANGFLOW_API_KEY) {
      return {
        error:
          "Langflow configuration missing. Please set LANGFLOW_URL, LANGFLOW_FLOW_ID, and LANGFLOW_API_KEY environment variables.",
      }
    }

    console.log("[v0] Server: Starting Langflow analysis...")

    // Step 1: Upload PDF file to Langflow
    const fileBuffer = await file.arrayBuffer()
    const blob = new Blob([fileBuffer], { type: file.type })

    const uploadFormData = new FormData()
    uploadFormData.append("file", blob, file.name)

    const uploadResponse = await fetch(`${LANGFLOW_URL}/api/v1/upload/${FLOW_ID}`, {
      method: "POST",
      headers: {
        "x-api-key": LANGFLOW_API_KEY,
      },
      body: uploadFormData,
    })

    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text()
      console.error("[v0] Server: Upload failed:", errorText)
      return { error: `Upload failed: ${uploadResponse.statusText}` }
    }

    const uploadData = await uploadResponse.json()
    const filePath = uploadData.file_path
    console.log("[v0] Server: File uploaded successfully")

    // Step 2: Run analysis with the uploaded file
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
    })

    if (!analysisResponse.ok) {
      const errorData = await analysisResponse.json()
      console.error("[v0] Server: Analysis failed:", errorData)
      return { error: errorData.detail || "Analysis failed" }
    }

    const result = await analysisResponse.json()
    console.log("[v0] Server: Analysis completed successfully")

    // Extract the analysis text from Langflow response
    const analysisText = result.outputs[0].outputs[0].results.message.text

    return {
      success: true,
      data: {
        userMetadata: {
          fullName: name,
          age: age,
          gender: gender,
        },
        rawAnalysis: analysisText,
      },
    }
  } catch (error) {
    console.error("[v0] Server: Error analyzing report:", error)
    return {
      error: error instanceof Error ? error.message : "Failed to analyze report",
    }
  }
}
