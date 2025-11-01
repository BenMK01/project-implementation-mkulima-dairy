import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Star, Truck } from "lucide-react";

const FeedMarketplace = () => {
  const feedProducts = [
    {
      id: 1,
      name: "Premium Dairy Meal",
      supplier: "Unga Feeds Kenya",
      price: "KSh 3,200",
      unit: "per 70kg bag",
      rating: 4.8,
      location: "Nairobi",
      image: "/api/placeholder/300/200",
      inStock: true,
      delivery: "Free delivery",
      protein: "18%",
      type: "Concentrate"
    },
    {
      id: 2,
      name: "Napier Grass Bales",
      supplier: "Nyeri Farmers Co-op",
      price: "KSh 800",
      unit: "per 50kg bale",
      rating: 4.6,
      location: "Nyeri",
      image: "/api/placeholder/300/200",
      inStock: true,
      delivery: "Same day delivery",
      protein: "12%",
      type: "Forage"
    },
    {
      id: 3,
      name: "Lucerne Hay Premium",
      supplier: "Eldoret Agro Supplies",
      price: "KSh 1,500",
      unit: "per 40kg bale",
      rating: 4.9,
      location: "Eldoret",
      image: "/api/placeholder/300/200",
      inStock: false,
      delivery: "2-3 days",
      protein: "20%",
      type: "Forage"
    },
    {
      id: 4,
      name: "Maize Germ Meal",
      supplier: "Kitale Grain Processors",
      price: "KSh 2,800",
      unit: "per 90kg bag",
      rating: 4.5,
      location: "Kitale",
      image: "/api/placeholder/300/200",
      inStock: true,
      delivery: "Free delivery",
      protein: "16%",
      type: "Supplement"
    }
  ];

  return (
    <section className="py-16 bg-background" id="marketplace">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Feed Marketplace
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Browse quality animal feeds from trusted suppliers across Kenya
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-8 justify-center">
          <Button variant="default" size="sm">All Feeds</Button>
          <Button variant="outline" size="sm">Concentrates</Button>
          <Button variant="outline" size="sm">Forages</Button>
          <Button variant="outline" size="sm">Supplements</Button>
          <Button variant="outline" size="sm">Minerals</Button>
        </div>

        {/* Products Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {feedProducts.map((product) => (
            <Card key={product.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="p-4">
                <div className="aspect-video bg-muted rounded-lg mb-4 flex items-center justify-center">
                  <span className="text-muted-foreground">Feed Image</span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Badge variant={product.inStock ? "default" : "secondary"}>
                      {product.inStock ? "In Stock" : "Out of Stock"}
                    </Badge>
                    <Badge variant="outline">{product.type}</Badge>
                  </div>
                  <CardTitle className="text-lg">{product.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{product.supplier}</p>
                </div>
              </CardHeader>
              
              <CardContent className="p-4 pt-0">
                <div className="space-y-3">
                  {/* Price */}
                  <div>
                    <span className="text-2xl font-bold text-primary">{product.price}</span>
                    <span className="text-sm text-muted-foreground ml-2">{product.unit}</span>
                  </div>

                  {/* Rating & Location */}
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 fill-accent text-accent" />
                      <span className="font-medium">{product.rating}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{product.location}</span>
                    </div>
                  </div>

                  {/* Protein & Delivery */}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Protein: <span className="font-medium">{product.protein}</span></span>
                    <div className="flex items-center space-x-1 text-success">
                      <Truck className="h-4 w-4" />
                      <span className="text-xs">{product.delivery}</span>
                    </div>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="p-4 pt-0">
                <Button 
                  className="w-full" 
                  disabled={!product.inStock}
                  variant={product.inStock ? "default" : "secondary"}
                >
                  {product.inStock ? "Add to Cart" : "Notify When Available"}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            Load More Products
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeedMarketplace;