import { Bell, Package, Tag, TrendingUp, AlertCircle, X, ShoppingBag, ExternalLink, ShoppingCart, Eye } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import { useState } from "react";

export interface Notification {
  id: string;
  type: "order" | "promotion" | "product" | "info";
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  icon?: string;
  actionLabel?: string;
  actionType?: "view_order" | "view_promo" | "view_product" | "dismiss";
  actionData?: any;
}

interface NotificationsMenuProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onRemove: (id: string) => void;
  onAction?: (notification: Notification) => void;
}

const iconMap = {
  order: Package,
  promotion: Tag,
  product: ShoppingBag,
  info: AlertCircle,
};

const colorMap = {
  order: "bg-[#0288D1]/10 text-[#0288D1]",
  promotion: "bg-red-50 text-red-600",
  product: "bg-[#00BCD4]/10 text-[#00BCD4]",
  info: "bg-[#01579B]/10 text-[#01579B]",
};

function getTimeAgo(date: Date): string {
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / 60000);
  
  if (diffInMinutes < 1) return "À l'instant";
  if (diffInMinutes < 60) return `Il y a ${diffInMinutes} min`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `Il y a ${diffInHours}h`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `Il y a ${diffInDays}j`;
  
  return date.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
}

export function NotificationsMenu({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onRemove,
  onAction,
}: NotificationsMenuProps) {
  const [open, setOpen] = useState(false);
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleNotificationClick = (id: string) => {
    onMarkAsRead(id);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="relative hover:bg-[#00BCD4]/10"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500 hover:bg-red-600 border-2 border-white animate-pulse">
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[380px] p-0" align="end" sideOffset={8}>
        <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-[#00BCD4]/5 to-[#0288D1]/5">
          <div>
            <h3 className="font-semibold text-[#01579B]">Notifications</h3>
            {unreadCount > 0 && (
              <p className="text-xs text-gray-500 mt-0.5">
                {unreadCount} nouvelle{unreadCount > 1 ? "s" : ""} notification{unreadCount > 1 ? "s" : ""}
              </p>
            )}
          </div>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onMarkAllAsRead}
              className="text-[#0288D1] hover:text-[#01579B] hover:bg-[#00BCD4]/10"
            >
              Tout marquer lu
            </Button>
          )}
        </div>

        <ScrollArea className="h-[400px]">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <div className="bg-gray-100 rounded-full p-4 mb-3">
                <Bell className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-gray-600">Aucune notification</p>
              <p className="text-sm text-gray-400 mt-1">
                Vous êtes à jour !
              </p>
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((notification, index) => {
                const Icon = iconMap[notification.type];
                const colorClass = colorMap[notification.type];
                
                return (
                  <div
                    key={notification.id}
                    className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer relative group ${
                      !notification.isRead ? "bg-[#00BCD4]/5" : ""
                    }`}
                    onClick={() => handleNotificationClick(notification.id)}
                  >
                    <div className="flex gap-3">
                      <div className={`p-2 rounded-lg ${colorClass} flex-shrink-0 h-fit`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className={`text-sm ${!notification.isRead ? "font-semibold" : ""}`}>
                            {notification.title}
                          </p>
                          {!notification.isRead && (
                            <div className="w-2 h-2 rounded-full bg-[#0288D1] flex-shrink-0 mt-1.5" />
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-0.5 line-clamp-2">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-400 mt-1.5">
                          {getTimeAgo(notification.timestamp)}
                        </p>
                        
                        {/* Action rapide */}
                        {notification.actionLabel && onAction && (
                          <div className="mt-3 flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-7 text-xs border-[#0288D1] text-[#0288D1] hover:bg-[#0288D1] hover:text-white transition-colors"
                              onClick={(e) => {
                                e.stopPropagation();
                                onAction(notification);
                                handleNotificationClick(notification.id);
                              }}
                            >
                              {notification.actionType === "view_order" && <Package className="h-3 w-3 mr-1.5" />}
                              {notification.actionType === "view_promo" && <Tag className="h-3 w-3 mr-1.5" />}
                              {notification.actionType === "view_product" && <Eye className="h-3 w-3 mr-1.5" />}
                              {notification.actionLabel}
                            </Button>
                          </div>
                        )}
                      </div>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 flex-shrink-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          onRemove(notification.id);
                        }}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>

        {notifications.length > 0 && (
          <>
            <Separator />
            <div className="p-3 text-center">
              <Button
                variant="ghost"
                size="sm"
                className="text-[#0288D1] hover:text-[#01579B] hover:bg-[#00BCD4]/10 w-full"
              >
                Voir toutes les notifications
              </Button>
            </div>
          </>
        )}
      </PopoverContent>
    </Popover>
  );
}