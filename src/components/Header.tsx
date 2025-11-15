import { ShoppingCart, Search, User, Menu, Heart } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { UserMenu } from "./UserMenu";
import { User as UserType } from "./AuthModal";
import { Logo } from "./Logo";
import { NotificationsMenu, Notification } from "./NotificationsMenu";

interface HeaderProps {
  cartItemsCount: number;
  onCartClick: () => void;
  onSearchChange: (value: string) => void;
  searchQuery: string;
  onNavigate: (page: "home" | "contact") => void;
  currentPage: "home" | "contact";
  user: UserType | null;
  onLogin: () => void;
  onLogout: () => void;
  onNavigateToProfile: () => void;
  onNavigateToDashboard: () => void;
  onNavigateToHome: () => void;
  favoritesCount: number;
  onFavoritesClick: () => void;
  notifications: Notification[];
  onMarkNotificationAsRead: (id: string) => void;
  onMarkAllNotificationsAsRead: () => void;
  onRemoveNotification: (id: string) => void;
  onNotificationAction?: (notification: Notification) => void;
  onBulkOrder?: () => void;
  onManageClients?: () => void;
  onSettings?: () => void;
}

export function Header({ 
  cartItemsCount, 
  onCartClick, 
  onSearchChange, 
  searchQuery, 
  onNavigate, 
  currentPage,
  user,
  onLogin,
  onLogout,
  onNavigateToProfile,
  onNavigateToDashboard,
  onNavigateToHome,
  favoritesCount,
  onFavoritesClick,
  notifications,
  onMarkNotificationAsRead,
  onMarkAllNotificationsAsRead,
  onRemoveNotification,
  onNotificationAction,
  onBulkOrder,
  onManageClients,
  onSettings,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-white border-b">
      <div className="bg-gradient-to-r from-[#00BCD4] to-[#0288D1] text-white py-2">
        <div className="container mx-auto px-4">
          <p className="text-center text-sm">
            ✨ Livraison gratuite dès 49€ d'achat | Conseils pharmaceutiques disponibles
          </p>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <button 
            onClick={onNavigateToHome}
            className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
          >
            <Logo className="h-10 w-10" />
            <div>
              <h1 className="text-[#0288D1] font-semibold">Excellence Parapharmacie</h1>
              <p className="text-xs text-gray-500">Votre santé, notre priorité</p>
            </div>
          </button>

          {/* Navigation */}
          <nav className="hidden lg:flex items-center gap-6">
            <button 
              onClick={onNavigateToHome}
              className={`text-sm hover:text-[#0288D1] transition-colors ${
                currentPage === "home" ? "text-[#0288D1]" : "text-gray-700"
              }`}
            >
              Accueil
            </button>
            <button 
              onClick={() => onNavigate("contact")}
              className={`text-sm hover:text-[#0288D1] transition-colors ${
                currentPage === "contact" ? "text-[#0288D1]" : "text-gray-700"
              }`}
            >
              Contact
            </button>
          </nav>

          {/* Search */}
          <div className="flex-1 max-w-xl hidden md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="search"
                placeholder="Rechercher un produit, une marque..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <UserMenu
              user={user}
              onLogin={onLogin}
              onLogout={onLogout}
              onNavigateToProfile={onNavigateToProfile}
              onNavigateToDashboard={onNavigateToDashboard}
              onBulkOrder={onBulkOrder}
              onManageClients={onManageClients}
              onSettings={onSettings}
            />
            
            {/* Notifications */}
            <div className="hidden md:block">
              <NotificationsMenu
                notifications={notifications}
                onMarkAsRead={onMarkNotificationAsRead}
                onMarkAllAsRead={onMarkAllNotificationsAsRead}
                onRemove={onRemoveNotification}
                onAction={onNotificationAction}
              />
            </div>
            
            {(!user || user.type === "b2c") && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="hidden md:flex relative"
                onClick={onFavoritesClick}
              >
                <Heart className="h-5 w-5" />
                {favoritesCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500">
                    {favoritesCount}
                  </Badge>
                )}
              </Button>
            )}
            <Button variant="ghost" size="icon" onClick={onCartClick} className="relative">
              <ShoppingCart className="h-5 w-5" />
              {cartItemsCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-[#0288D1]">
                  {cartItemsCount}
                </Badge>
              )}
            </Button>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="mt-4 md:hidden">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="search"
              placeholder="Rechercher..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
        </div>
      </div>
    </header>
  );
}