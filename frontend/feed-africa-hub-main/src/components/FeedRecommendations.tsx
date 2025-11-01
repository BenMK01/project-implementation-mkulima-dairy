import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Brain, Calculator, MapPin, Zap } from "lucide-react";

const FeedRecommendations = () => {
  return (
    <section className="py-16 bg-muted/30" id="recommendations">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            AI-Powered Feed Recommendations
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Get personalized feeding plans based on your cow breed, location, and farming goals
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Input Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Brain className="h-5 w-5 text-primary" />
                <span>Farm Details</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cows">Number of Cows</Label>
                  <Input id="cows" placeholder="e.g., 15" type="number" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="breed">Cow Breed</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select breed" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="holstein">Holstein Friesian</SelectItem>
                      <SelectItem value="jersey">Jersey</SelectItem>
                      <SelectItem value="guernsey">Guernsey</SelectItem>
                      <SelectItem value="ayrshire">Ayrshire</SelectItem>
                      <SelectItem value="cross">Cross Breed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Farm Location</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select county" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="nairobi">Nairobi</SelectItem>
                    <SelectItem value="kiambu">Kiambu</SelectItem>
                    <SelectItem value="nyeri">Nyeri</SelectItem>
                    <SelectItem value="meru">Meru</SelectItem>
                    <SelectItem value="nakuru">Nakuru</SelectItem>
                    <SelectItem value="eldoret">Uasin Gishu</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="production">Average Daily Milk (Liters)</Label>
                <Input id="production" placeholder="e.g., 200" type="number" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="budget">Monthly Feed Budget (KSh)</Label>
                <Input id="budget" placeholder="e.g., 50000" type="number" />
              </div>

              <Button className="w-full" size="lg">
                <Calculator className="mr-2 h-5 w-5" />
                Generate Feed Plan
              </Button>
            </CardContent>
          </Card>

          {/* Sample Recommendation */}
          <div className="space-y-6">
            <Card className="border-primary/20 bg-primary/5">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-primary">
                  <Zap className="h-5 w-5" />
                  <span>Recommended Feed Plan</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="bg-background p-4 rounded-lg">
                    <h4 className="font-semibold text-primary">Daily Intake</h4>
                    <p className="text-2xl font-bold">45kg</p>
                    <p className="text-sm text-muted-foreground">per cow</p>
                  </div>
                  <div className="bg-background p-4 rounded-lg">
                    <h4 className="font-semibold text-success">Monthly Cost</h4>
                    <p className="text-2xl font-bold">KSh 4,200</p>
                    <p className="text-sm text-muted-foreground">per cow</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold">Feed Composition:</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span>Napier Grass</span>
                      <Badge className="bg-success/10 text-success">30kg/day</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Dairy Meal (18% protein)</span>
                      <Badge className="bg-primary/10 text-primary">8kg/day</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Maize Silage</span>
                      <Badge className="bg-accent/10 text-accent">5kg/day</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Mineral Supplement</span>
                      <Badge className="bg-warning/10 text-warning">100g/day</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Regional Insights */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5 text-accent" />
                  <span>Regional Insights - Nyeri County</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Local Napier Grass Availability</span>
                    <Badge variant="default">High</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Average Feed Cost</span>
                    <span className="font-medium">15% below national avg</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Best Feeding Season</span>
                    <span className="font-medium">March - June</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

const Badge = ({ children, className, variant = "default" }: { 
  children: React.ReactNode; 
  className?: string; 
  variant?: "default" | "outline" 
}) => {
  const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
  const variants = {
    default: "bg-primary/10 text-primary",
    outline: "border border-border text-foreground"
  };
  
  return (
    <span className={`${baseClasses} ${variants[variant]} ${className || ""}`}>
      {children}
    </span>
  );
};

export default FeedRecommendations;