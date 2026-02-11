import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, TrendingUp, Settings, Search, Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import AnimatedBackground from './AnimatedBackground';

const SidebarItem = ({ icon: Icon, label, path, isActive, onClick }) => (
    <Link
        to={path}
        onClick={onClick}
        className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sm font-medium",
            isActive
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
        )}
    >
        <Icon className="w-4 h-4" />
        <span>{label}</span>
    </Link>
);

const Layout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = React.useState("");
    const [searchResults, setSearchResults] = React.useState([]);
    const [showResults, setShowResults] = React.useState(false);
    const [showMobileMenu, setShowMobileMenu] = React.useState(false);

    React.useEffect(() => {
        const search = async () => {
            if (searchQuery.length > 1) {
                import('@/services/api').then(async (module) => {
                    const results = await module.MarketService.searchAssets(searchQuery);
                    setSearchResults(results);
                    setShowResults(true);
                });
            } else {
                setSearchResults([]);
                setShowResults(false);
            }
        };
        const debounce = setTimeout(search, 300);
        return () => clearTimeout(debounce);
    }, [searchQuery]);

    const handleNavigate = (id) => {
        navigate(`/asset/${id}`);
        setShowResults(false);
        setSearchQuery("");
    };

    return (
        <div className="flex min-h-screen bg-background text-foreground font-sans relative isolate">
            <AnimatedBackground />
            {/* Mobile Sidebar Overlay */}
            <div
                className={cn(
                    "fixed inset-0 bg-background/80 backdrop-blur-sm z-50 md:hidden transition-all duration-200",
                    showMobileMenu ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                )}
                onClick={() => setShowMobileMenu(false)}
            />
            <div className={cn(
                "fixed inset-y-0 left-0 z-50 w-3/4 max-w-xs bg-card border-r border-border p-6 shadow-xl transition-transform duration-300 md:hidden",
                showMobileMenu ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                            <TrendingUp className="w-5 h-5 text-primary-foreground" />
                        </div>
                        <span className="text-xl font-bold tracking-tight">MarketScope</span>
                    </div>
                    <button onClick={() => setShowMobileMenu(false)} className="p-2 -mr-2 text-muted-foreground">
                        <Menu className="w-6 h-6" />
                    </button>
                </div>
                <nav className="flex flex-col gap-2">
                    <SidebarItem
                        icon={LayoutDashboard}
                        label="Dashboard"
                        path="/"
                        isActive={location.pathname === '/'}
                        onClick={() => setShowMobileMenu(false)}
                    />
                    <SidebarItem
                        icon={TrendingUp}
                        label="Market"
                        path="/market"
                        isActive={location.pathname === '/market'}
                        onClick={() => setShowMobileMenu(false)}
                    />
                    <SidebarItem
                        icon={Settings}
                        label="Settings"
                        path="/settings"
                        isActive={location.pathname === '/settings'}
                        onClick={() => setShowMobileMenu(false)}
                    />
                </nav>
            </div>

            {/* Sidebar - Desktop */}
            <aside className="hidden md:flex flex-col w-64 border-r border-border bg-card p-6 gap-6 sticky top-0 h-screen">
                <div className="flex items-center gap-2 px-2">
                    <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                        <TrendingUp className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <span className="text-xl font-bold tracking-tight">MarketScope</span>
                </div>

                <nav className="flex flex-col gap-1 flex-1">
                    <SidebarItem
                        icon={LayoutDashboard}
                        label="Dashboard"
                        path="/"
                        isActive={location.pathname === '/'}
                    />
                    <SidebarItem
                        icon={TrendingUp}
                        label="Market"
                        path="/market"
                        isActive={location.pathname === '/market'}
                    />
                    <SidebarItem
                        icon={Settings}
                        label="Settings"
                        path="/settings"
                        isActive={location.pathname === '/settings'}
                    />
                </nav>

                <div className="p-4 rounded-xl bg-muted/50 border border-border">
                    <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-2">Portfolio Value</h4>
                    <p className="text-2xl font-bold">$124,592.00</p>
                    <p className="text-xs text-green-500 flex items-center gap-1 mt-1">
                        +2.5% <span className="text-muted-foreground">today</span>
                    </p>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0">
                {/* Header */}
                <header className="h-16 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10 px-6 flex items-center justify-between gap-4">
                    <div className="md:hidden">
                        <button onClick={() => setShowMobileMenu(true)} className="-ml-2 p-2">
                            <Menu className="w-6 h-6 text-muted-foreground" />
                        </button>
                    </div>

                    <div className="relative max-w-md w-full hidden md:block">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <input
                            type="search"
                            placeholder="Search stocks, crypto, pairs..."
                            className="w-full bg-muted/50 border border-transparent focus:border-primary focus:ring-1 focus:ring-primary rounded-md pl-9 pr-4 py-2 text-sm outline-none transition-all"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onFocus={() => searchQuery.length > 1 && setShowResults(true)}
                            onBlur={() => setTimeout(() => setShowResults(false), 200)}
                        />

                        {showResults && searchResults.length > 0 && (
                            <div className="absolute top-full mt-2 w-full bg-popover border border-border rounded-md shadow-lg py-1 z-50">
                                {searchResults.map((result) => (
                                    <button
                                        key={result.id}
                                        className="w-full text-left px-4 py-2 text-sm hover:bg-muted flex items-center justify-between"
                                        onClick={() => handleNavigate(result.id)}
                                    >
                                        <span className="font-medium">{result.name}</span>
                                        <span className="text-muted-foreground text-xs">{result.symbol}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                            JD
                        </button>
                    </div>
                </header>

                {/* Page Content */}
                <div className="flex-1 p-6 overflow-y-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default Layout;
