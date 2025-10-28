"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  AlertCircle,
  CheckCircle,
  ShoppingCart,
  Loader2,
  Pill,
  Heart,
  Apple,
  Dumbbell,
  Brain,
  Moon,
  AlertTriangle,
} from "lucide-react"
import type { AnalysisResult, ProductRecommendation } from "./blood-report-analyzer"

type ReportResultsProps = {
  analysisResult: AnalysisResult
  products: ProductRecommendation[]
  isLoadingProducts: boolean
  onReset: () => void
}

export function ReportResults({ analysisResult, products, isLoadingProducts, onReset }: ReportResultsProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Analysis Results</h2>
          <p className="text-muted-foreground mt-1">
            Patient: {analysisResult.userMetadata.fullName} | Age: {analysisResult.userMetadata.age}
          </p>
          <p className="text-sm text-muted-foreground">Health Goal: {analysisResult.userMetadata.healthGoal}</p>
        </div>
        <Button variant="outline" onClick={onReset}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          New Analysis
        </Button>
      </div>

      {/* Summary Card */}
      <Card className="border-border bg-card p-6">
        <div className="flex items-center gap-2 mb-3">
          <Heart className="h-5 w-5 text-primary" />
          <h3 className="text-xl font-semibold text-foreground">Summary</h3>
        </div>
        <p className="text-muted-foreground leading-relaxed">{analysisResult.summary}</p>
      </Card>

      {/* Key Findings */}
      {analysisResult.keyFindings.length > 0 && (
        <Card className="border-border bg-card p-6">
          <h3 className="text-xl font-semibold text-foreground mb-4">Blood Test Results</h3>
          <div className="space-y-3">
            {analysisResult.keyFindings.map((finding, index) => (
              <div
                key={index}
                className="flex items-start justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-medium text-foreground capitalize">
                      {finding.test_name.replace(/_/g, " ")}
                    </span>
                    <Badge
                      variant={finding.status === "normal" ? "default" : "destructive"}
                      className={
                        finding.status === "normal"
                          ? "bg-accent text-accent-foreground"
                          : finding.status === "high"
                            ? "bg-destructive/20 text-destructive"
                            : "bg-warning/20 text-warning"
                      }
                    >
                      {finding.status === "normal" ? (
                        <CheckCircle className="mr-1 h-3 w-3" />
                      ) : (
                        <AlertCircle className="mr-1 h-3 w-3" />
                      )}
                      {finding.status.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{finding.description}</p>
                </div>
                <div className="text-right ml-4">
                  <p className="text-lg font-semibold text-foreground">{finding.value}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Abnormal Findings */}
      {analysisResult.abnormalFindings.length > 0 && (
        <Card className="border-border bg-card p-6 border-destructive/20">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <h3 className="text-xl font-semibold text-foreground">Areas of Concern</h3>
          </div>
          <div className="space-y-4">
            {analysisResult.abnormalFindings.map((finding, index) => (
              <div key={index} className="p-4 rounded-lg bg-destructive/5 border border-destructive/20">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-foreground capitalize">{finding.test_name.replace(/_/g, " ")}</h4>
                  <span className="text-sm font-medium text-destructive">{finding.current_value}</span>
                </div>
                <p className="text-sm text-muted-foreground mb-1">
                  <span className="font-medium">Normal Range:</span> {finding.reference_range}
                </p>
                <p className="text-sm text-muted-foreground">{finding.significance}</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Recommended Supplements */}
      {analysisResult.recommendedSupplements.length > 0 && (
        <Card className="border-border bg-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <Pill className="h-5 w-5 text-primary" />
            <h3 className="text-xl font-semibold text-foreground">Recommended Supplements</h3>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {analysisResult.recommendedSupplements.map((supplement, index) => (
              <div key={index} className="p-4 rounded-lg bg-muted/50 border border-border">
                <h4 className="font-semibold text-foreground mb-1">{supplement.name}</h4>
                <p className="text-sm text-primary font-medium mb-2">{supplement.dosage}</p>
                <p className="text-sm text-muted-foreground">{supplement.rationale}</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Lifestyle Recommendations */}
      <Card className="border-border bg-card p-6">
        <h3 className="text-xl font-semibold text-foreground mb-4">Lifestyle Recommendations</h3>
        <div className="grid gap-6 md:grid-cols-2">
          {/* Diet */}
          {analysisResult.lifestyleRecommendations.diet && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Apple className="h-5 w-5 text-accent" />
                <h4 className="font-semibold text-foreground">{analysisResult.lifestyleRecommendations.diet.title}</h4>
              </div>
              {analysisResult.lifestyleRecommendations.diet.items && (
                <ul className="space-y-2">
                  {analysisResult.lifestyleRecommendations.diet.items.map((item, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {/* Exercise */}
          {analysisResult.lifestyleRecommendations.exercise && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Dumbbell className="h-5 w-5 text-accent" />
                <h4 className="font-semibold text-foreground">
                  {analysisResult.lifestyleRecommendations.exercise.title}
                </h4>
              </div>
              {analysisResult.lifestyleRecommendations.exercise.items && (
                <ul className="space-y-2">
                  {analysisResult.lifestyleRecommendations.exercise.items.map((item, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {/* Stress Management */}
          {analysisResult.lifestyleRecommendations.stress_management && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-accent" />
                <h4 className="font-semibold text-foreground">
                  {analysisResult.lifestyleRecommendations.stress_management.title}
                </h4>
              </div>
              {analysisResult.lifestyleRecommendations.stress_management.description && (
                <p className="text-sm text-muted-foreground">
                  {analysisResult.lifestyleRecommendations.stress_management.description}
                </p>
              )}
            </div>
          )}

          {/* Sleep */}
          {analysisResult.lifestyleRecommendations.sleep && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Moon className="h-5 w-5 text-accent" />
                <h4 className="font-semibold text-foreground">{analysisResult.lifestyleRecommendations.sleep.title}</h4>
              </div>
              {analysisResult.lifestyleRecommendations.sleep.items && (
                <ul className="space-y-2">
                  {analysisResult.lifestyleRecommendations.sleep.items.map((item, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </Card>

      {/* Disclaimer */}
      <Card className="border-border bg-muted/30 p-4">
        <p className="text-sm text-muted-foreground italic">{analysisResult.disclaimer}</p>
      </Card>

      {/* Product Recommendations */}
      <Card className="border-border bg-card p-6">
        <h3 className="text-xl font-semibold text-foreground mb-4">Recommended Products</h3>
        {isLoadingProducts ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-3 text-muted-foreground">Loading recommendations...</span>
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((product) => (
              <div
                key={product.id}
                className="border border-border rounded-lg p-4 hover:shadow-md transition-shadow bg-background"
              >
                <div className="aspect-square bg-muted rounded-lg mb-3 overflow-hidden">
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <Badge variant="secondary" className="mb-2">
                  {product.category}
                </Badge>
                <h4 className="font-semibold text-foreground mb-1">{product.name}</h4>
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{product.description}</p>
                <ul className="text-xs text-muted-foreground mb-3 space-y-1">
                  {product.benefits.slice(0, 2).map((benefit, idx) => (
                    <li key={idx} className="flex items-start gap-1">
                      <CheckCircle className="h-3 w-3 text-accent mt-0.5 flex-shrink-0" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-primary">{product.price}</span>
                  <Button size="sm">
                    <ShoppingCart className="mr-1 h-3 w-3" />
                    Add to Cart
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-8">No product recommendations available.</p>
        )}
      </Card>
    </div>
  )
}
