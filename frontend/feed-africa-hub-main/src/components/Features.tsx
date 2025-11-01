import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, Cloud, MapPin, Smartphone, TrendingUp, Users } from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: <Smartphone className="h-8 w-8" />,
      title: "USSD & SMS Access",
      description: "Access feed prices and recommendations via USSD (*123#) or SMS, no internet required.",
      badge: "No Internet Needed",
      color: "success"
    },
    {
      icon: <Brain className="h-8 w-8" />,
      title: "AI Feed Recommendations",
      description: "Machine learning algorithms provide personalized feeding plans based on your cow breed and location.",
      badge: "AI Powered",
      color: "primary"
    },
    {
      icon: <MapPin className="h-8 w-8" />,
      title: "Regional Feed Plans",
      description: "Location-specific recommendations considering local feed availability and climate conditions.",
      badge: "Location Based",
      color: "accent"
    },
    {
      icon: <Cloud className="h-8 w-8" />,
      title: "Weather Forecasting",
      description: "Predict forage availability and adjust feeding plans based on weather patterns and seasons.",
      badge: "Weather Insights",
      color: "warning"
    },
    {
      icon: <TrendingUp className="h-8 w-8" />,
      title: "Price Monitoring",
      description: "Real-time feed price tracking across Kenya to help you make informed purchasing decisions.",
      badge: "Price Alerts",
      color: "success"
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Farmer Community",
      description: "Connect with other dairy farmers, share experiences, and learn best practices.",
      badge: "Community",
      color: "accent"
    }
  ];

  const colorVariants = {
    primary: "text-primary bg-primary/10",
    success: "text-success bg-success/10", 
    accent: "text-accent bg-accent/10",
    warning: "text-warning bg-warning/10"
  };

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Comprehensive Dairy Farming Solutions
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            From AI-powered recommendations to USSD access, we've got every farmer covered
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-16 h-16 rounded-xl flex items-center justify-center ${colorVariants[feature.color as keyof typeof colorVariants]}`}>
                    {feature.icon}
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {feature.badge}
                  </Badge>
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-16 bg-muted/30 rounded-2xl p-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <h3 className="text-3xl md:text-4xl font-bold text-primary">500+</h3>
              <p className="text-muted-foreground mt-2">Active Farmers</p>
            </div>
            <div>
              <h3 className="text-3xl md:text-4xl font-bold text-success">47</h3>
              <p className="text-muted-foreground mt-2">Counties Covered</p>
            </div>
            <div>
              <h3 className="text-3xl md:text-4xl font-bold text-accent">1,200+</h3>
              <p className="text-muted-foreground mt-2">Feed Products</p>
            </div>
            <div>
              <h3 className="text-3xl md:text-4xl font-bold text-warning">95%</h3>
              <p className="text-muted-foreground mt-2">Satisfaction Rate</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;