import { User as UserIcon, LogOut, Package, Heart, Settings, BarChart, Users, Box } from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Badge } from "./ui/badge";
import { User } from "./AuthModal";

interface UserMenuProps {
  user: User | null;
  onLogin: () => void;
  onLogout: () => void;
  onNavigateToProfile: () => void;
  onNavigateToDashboard: () => void;
  onBulkOrder?: () => void;
  onManageClients?: () => void;
  onSettings?: () => void;
}

export function UserMenu({ 
  user, 
  onLogin, 
  onLogout, 
  onNavigateToProfile, 
  onNavigateToDashboard,
  onBulkOrder,
  onManageClients,
  onSettings
}: UserMenuProps) {
  if (!user) {
    return (
      <Button variant="ghost" size="icon" onClick={onLogin}>
        <UserIcon className="h-5 w-5" />
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <UserIcon className="h-5 w-5" />
          {user.type === "b2b" && (
            <Badge className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center p-0 bg-blue-600 text-[10px]">
              B
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col">
            <span className="truncate">{user.name}</span>
            <span className="text-xs text-gray-500 truncate">{user.email}</span>
            {user.type === "b2b" && (
              <Badge variant="secondary" className="mt-1 w-fit">
                Compte Professionnel
              </Badge>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={onNavigateToProfile}>
          <UserIcon className="mr-2 h-4 w-4" />
          Mon profil
        </DropdownMenuItem>

        {user.type === "b2c" ? (
          <>
            <DropdownMenuItem>
              <Package className="mr-2 h-4 w-4" />
              Mes commandes
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Heart className="mr-2 h-4 w-4" />
              Mes favoris
            </DropdownMenuItem>
          </>
        ) : (
          <>
            <DropdownMenuItem onClick={onNavigateToDashboard}>
              <BarChart className="mr-2 h-4 w-4" />
              Tableau de bord
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onBulkOrder}>
              <Box className="mr-2 h-4 w-4" />
              Commandes en gros
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onManageClients}>
              <Users className="mr-2 h-4 w-4" />
              Gestion des clients
            </DropdownMenuItem>
          </>
        )}

        <DropdownMenuItem onClick={onSettings}>
          <Settings className="mr-2 h-4 w-4" />
          Paramètres
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={onLogout} className="text-red-600">
          <LogOut className="mr-2 h-4 w-4" />
          Déconnexion
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}