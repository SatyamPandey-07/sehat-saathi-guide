import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/components/theme-provider';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Home,
  Heart,
  User,
  ShoppingCart,
  Menu,
  Globe,
  LogOut,
  Building,
  ChevronDown,
  Zap,
  Shield,
  Hospital,
  Settings,
  Moon,
  Sun,
  Map,
  Activity,
  Lightbulb,
  Store,
  MessageCircle
} from 'lucide-react';
import { ModeToggle } from '@/components/mode-toggle';

const Navbar: React.FC = () => {
  const { t, language, setLanguage, languageNames, availableLanguages, currentLanguageName } = useLanguage();
  // const { t, language, setLanguage, languageNames, availableLanguages } = useLanguage();
  const { user, isAuthenticated, logout } = useAuth();
  const { itemCount } = useCart();

  // const [pincodeOpen, setPincodeOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedPincode, setSelectedPincode] = useState('Select Pincode');
  const [pincodeOpen, setPincodeOpen] = useState(false);


  const navItems = [
    { path: "/symptoms", label: t.symptomTracker, icon: Activity },
    { path: "/tips", label: t.healthTips, icon: Lightbulb },
    { path: "/store", label: t.medicineStore, icon: Store },
    { path: "/assistant", label: t.aiAssistant, icon: MessageCircle },
  ];



  const moreItems = [
    { path: '/schemes', label: t.sarkariYojana, icon: '🏛️', iconComponent: Shield },
    { path: '/nearby', label: t.nearbyHospitals, icon: '🏥', iconComponent: Hospital },
  ];

  const isActive = (path: string) => location.pathname === path;

  const languageFlags: Record<string, string> = {
    hi: '🇮🇳',
    en: '🇬🇧',
    bn: '🇧🇩',
    mr: '🇮🇳',
    bho: '🇮🇳',
    mai: '🇮🇳',
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-background border-b border-border">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
            <Heart className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-bold text-lg">
            {language === "en" ? "Swasthya Saathi" : t.appName}
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 text-sm font-medium transition-colors ${isActive(item.path)
                    ? "text-primary"
                    : "text-muted-foreground hover:text-primary"
                  }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(isDark ? "light" : "dark")}
          >
            {isDark ? (
              <Sun className="w-4 h-4" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </Button>

          {/* Language */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-1">
                <Globe className="w-4 h-4" />
                <span className="hidden sm:inline">
                  {currentLanguageName}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {availableLanguages.map((lang) => (
                <DropdownMenuItem
                  key={lang}
                  onClick={() => setLanguage(lang)}
                >
                  {languageNames[lang]}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Cart */}
          <Link to="/cart" className="relative">
            <ShoppingCart className="w-5 h-5" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Link>

          {/* Auth */}
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <User className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link to="/profile">{t.myProfile}</Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={logout}
                  className="text-destructive"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  {t.logout}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to="/auth">{t.login}</Link>
          )}

          {/* Mobile Menu */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>

            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>{t.appName}</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-4 mt-6">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3 text-base"
                    >
                      <Icon className="w-5 h-5" />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
