export const Footer = () => {
  return (
    <footer className="bg-gradient-primary/10 border-t mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">Contact Info</h3>
            <div className="space-y-2 text-muted-foreground">
              <p>Email: support@rewixcash.com</p>
              <p>Phone: +1 (555) 123-4567</p>
              <p>Hours: 9 AM - 6 PM EST</p>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">Quick Links</h3>
            <div className="space-y-2">
              <a href="/terms" className="block text-muted-foreground hover:text-primary transition-colors">
                Terms of Service
              </a>
              <a href="/privacy" className="block text-muted-foreground hover:text-primary transition-colors">
                Privacy Policy
              </a>
              <a href="/faq" className="block text-muted-foreground hover:text-primary transition-colors">
                FAQ
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">Disclaimer</h3>
            <p className="text-muted-foreground text-sm">
              This is a demonstration application. All rewards and points are simulated for demo purposes only. 
              No real monetary value is associated with the points earned.
            </p>
          </div>
        </div>
        
        <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground">
          <p>&copy; 2024 RewixCash. All rights reserved. Demo version.</p>
        </div>
      </div>
    </footer>
  );
};