import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { analysisResult } = await request.json()

    if (!analysisResult) {
      return NextResponse.json({ error: "Missing analysis result" }, { status: 400 })
    }

    // Simulate fetching product recommendations based on analysis
    // In production, you would:
    // 1. Analyze the blood test results
    // 2. Query a product database or recommendation engine
    // 3. Use AI to match products to specific health needs
    // 4. Return personalized product recommendations

    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Mock product recommendations based on the analysis
    const products = [
      {
        id: "1",
        name: "Premium Vitamin D3 5000 IU",
        category: "Vitamins",
        description: "High-potency Vitamin D3 supplement to support bone health and immune function",
        price: "$24.99",
        image: "/vitamin-d-supplement.png",
        benefits: ["Supports bone and teeth health", "Boosts immune system", "Improves mood and energy levels"],
      },
      {
        id: "2",
        name: "Omega-3 Fish Oil Complex",
        category: "Heart Health",
        description: "Premium fish oil with EPA and DHA to support cardiovascular health",
        price: "$32.99",
        image: "/omega-3-fish-oil.png",
        benefits: [
          "Supports heart health",
          "Helps maintain healthy cholesterol levels",
          "Anti-inflammatory properties",
        ],
      },
      {
        id: "3",
        name: "Blood Sugar Support Formula",
        category: "Metabolic Health",
        description: "Natural blend of herbs and minerals to support healthy glucose metabolism",
        price: "$29.99",
        image: "/blood-sugar-supplement.jpg",
        benefits: [
          "Supports healthy blood sugar levels",
          "Contains chromium and cinnamon extract",
          "Promotes metabolic health",
        ],
      },
      {
        id: "4",
        name: "Complete Multivitamin",
        category: "General Health",
        description: "Comprehensive daily multivitamin with essential nutrients",
        price: "$19.99",
        image: "/multivitamin-pills.png",
        benefits: ["Fills nutritional gaps", "Supports overall health and wellness", "Easy one-a-day formula"],
      },
      {
        id: "5",
        name: "Cholesterol Management Complex",
        category: "Heart Health",
        description: "Plant sterols and red yeast rice to support healthy cholesterol levels",
        price: "$34.99",
        image: "/cholesterol-supplement.jpg",
        benefits: ["Supports healthy cholesterol levels", "Contains plant sterols", "Promotes cardiovascular wellness"],
      },
      {
        id: "6",
        name: "Iron Plus with Vitamin C",
        category: "Energy & Vitality",
        description: "Gentle iron supplement with Vitamin C for enhanced absorption",
        price: "$16.99",
        image: "/iron-supplement.jpg",
        benefits: [
          "Supports healthy iron levels",
          "Reduces fatigue and tiredness",
          "Enhanced with Vitamin C for better absorption",
        ],
      },
    ]

    return NextResponse.json({ products })
  } catch (error) {
    console.error("Error fetching recommendations:", error)
    return NextResponse.json({ error: "Failed to fetch recommendations" }, { status: 500 })
  }
}
