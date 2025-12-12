import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import api from "../api";

const Footer: React.FC = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<null | "idle" | "loading" | "success" | "error">(null);
  const [message, setMessage] = useState<string>("");

  const validateEmail = (value: string) => {
    // Simple email validation
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  };

  const saveLocalSubscriber = (value: string) => {
    try {
      const key = "newsletter_subscribers";
      const raw = localStorage.getItem(key);
      const list = raw ? (JSON.parse(raw) as string[]) : [];
      if (!list.includes(value)) {
        list.push(value);
        localStorage.setItem(key, JSON.stringify(list));
      }
      return true;
    } catch (err) {
      console.error("Failed to save subscriber locally", err);
      return false;
    }
  };

  const handleSubscribe = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setMessage("");
    if (!validateEmail(email.trim())) {
      setMessage("Please enter a valid email address.");
      setStatus("error");
      return;
    }
    setStatus("loading");
    try {
      // Try the backend endpoint first. If it doesn't exist we'll gracefully fallback.
      await api.post("/api/newsletter/subscribe/", { email: email.trim() });
      setStatus("success");
      setMessage("Thanks for subscribing! Check your inbox for confirmation.");
      setEmail("");
    } catch (err) {
      console.warn("Newsletter subscribe endpoint failed, falling back to local save.", err);
      const ok = saveLocalSubscriber(email.trim());
      if (ok) {
        setStatus("success");
        setMessage("Saved locally — subscription will be processed once backend is available.");
        setEmail("");
      } else {
        setStatus("error");
        setMessage("Subscription failed. Please try again later.");
      }
    }
  };

  return (
    <footer className="bg-foreground text-background py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-xl">M</span>
              </div>
              <span className="text-2xl font-bold">Mkulima Dairy Feeds</span>
            </div>
            <p className="text-background/80 leading-relaxed">
              Empowering dairy farmers across Kenya with affordable feed access, 
              AI-powered recommendations, and regional insights.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Mkulima on Facebook"
              >
                <Button variant="ghost" size="icon" className="text-background hover:text-primary">
                  <Facebook className="h-5 w-5" />
                </Button>
              </a>

              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Mkulima on Twitter"
              >
                <Button variant="ghost" size="icon" className="text-background hover:text-primary">
                  <Twitter className="h-5 w-5" />
                </Button>
              </a>

              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Mkulima on Instagram"
              >
                <Button variant="ghost" size="icon" className="text-background hover:text-primary">
                  <Instagram className="h-5 w-5" />
                </Button>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <div className="space-y-2">
              <Link to="/feed-marketplace" className="block text-background/80 hover:text-primary transition-colors">
                Feed Marketplace
              </Link>
              <Link to="/feed-recommendations" className="block text-background/80 hover:text-primary transition-colors">
                Feed Recommendations
              </Link>
              <Link to="/forecasts" className="block text-background/80 hover:text-primary transition-colors">
                Weather Forecasts
              </Link>
            </div>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Support</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-background/80">
                <Phone className="h-4 w-4" />
                <a href="tel:*123*456#" className="hover:underline">USSD: *123*456#</a>
              </div>
              <div className="flex items-center space-x-2 text-background/80">
                <Mail className="h-4 w-4" />
                <a href="sms:40404" className="hover:underline">SMS: 40404</a>
              </div>
              <div className="flex items-center space-x-2 text-background/80">
                <Mail className="h-4 w-4" />
                <a href="mailto:support@mdairy.co.ke" className="hover:underline">support@mdairy.co.ke</a>
              </div>
              <div className="flex items-center space-x-2 text-background/80">
                <MapPin className="h-4 w-4" />
                <span>Nairobi, Kenya</span>
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Stay Updated</h3>
            <p className="text-background/80 text-sm">
              Get weekly updates on feed prices, weather forecasts, and farming tips.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="space-y-2">
                <label htmlFor="newsletter-email" className="sr-only">Email</label>
                <Input
                  id="newsletter-email"
                  name="newsletter-email"
                  placeholder="Enter your email"
                  className="bg-background/10 border-background/20 text-background placeholder:text-background/60"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="flex space-x-2">
                <Button type="submit" className="w-full" disabled={status === "loading"}>
                  {status === "loading" ? "Subscribing..." : "Subscribe"}
                </Button>
              </div>
              {message && (
                <div className={`text-sm ${status === "error" ? "text-red-400" : "text-green-300"} mt-2`}>
                  {message}
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-background/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-background/60 text-sm">
              © 2025 Mkulima Dairy Feeds. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm">
              <a href="/privacy" className="text-background/60 hover:text-primary transition-colors">Privacy Policy</a>
              <a href="/terms" className="text-background/60 hover:text-primary transition-colors">Terms of Service</a>
              <a href="/cookies" className="text-background/60 hover:text-primary transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;