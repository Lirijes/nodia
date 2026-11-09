import { useState, type ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutGrid,
  FlaskConical,
  Library,
  Plug,
  Workflow,
  ScrollText,
  Settings,
  Search,
  Menu,
  ChevronsUpDown,
  BookOpen,
  LogOut,
  User,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Kbd } from "./data";

export const nav = [
  {
    group: "Workspace",
    items: [
      { to: "/", label: "Overview", icon: LayoutGrid },
      { to: "/playground", label: "Playground", icon: FlaskConical },
    ],
  },
  {
    group: "Build",
    items: [
      { to: "/knowledge", label: "Knowledge", icon: Library },
      { to: "/tools", label: "Tools & Integrations", icon: Plug },
      { to: "/workflows", label: "Workflows", icon: Workflow },
    ],
  },
  { group: "Observe", items: [{ to: "/logs", label: "Execution logs", icon: ScrollText }] },
] as const;

const footerNav = [
  { to: "/design-system", label: "Design system", icon: BookOpen },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

type NavItem = { to: string; label: string; icon: typeof LayoutGrid };
const allItems: NavItem[] = [...nav.flatMap((g): readonly NavItem[] => g.items), ...footerNav];

function Brand() {
  return (
    <div className="flex items-center gap-2.5">
      <div className="grid size-6 grid-cols-2 gap-[2px] rounded-sm bg-foreground p-[5px]">
        <span className="rounded-[1px] bg-background" />
        <span className="rounded-[1px] bg-primary" />
        <span className="rounded-[1px] bg-background/40" />
        <span className="rounded-[1px] bg-background" />
      </div>
      <span className="display text-lg leading-none">Atelier</span>
    </div>
  );
}

function NavLink({
  to,
  label,
  icon: Icon,
  active,
  onNavigate,
}: {
  to: string;
  label: string;
  icon: typeof LayoutGrid;
  active: boolean;
  onNavigate?: (() => void) | undefined;
}) {
  return (
    <Link
      to={to}
      onClick={onNavigate}
      className={cn(
        "group relative flex h-8 items-center gap-2.5 rounded-md px-2.5 text-sm transition-colors",
        active
          ? "bg-surface font-medium text-foreground shadow-xs"
          : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground",
      )}
    >
      {active && (
        <span className="absolute -left-3 top-1.5 bottom-1.5 w-[2px] rounded-full bg-primary" />
      )}
      <Icon
        className={cn(
          "size-4",
          active ? "text-primary" : "text-subtle-foreground group-hover:text-muted-foreground",
        )}
      />
      {label}
    </Link>
  );
}

function SidebarBody({
  path,
  onNavigate,
}: {
  path: string;
  onNavigate?: (() => void) | undefined;
}) {
  const isActive = (to: string) => (to === "/" ? path === "/" : path.startsWith(to));
  return (
    <div className="flex h-full flex-col">
      <div className="flex h-[var(--topbar-h)] items-center border-b border-sidebar-border px-4">
        <Brand />
      </div>
      <WorkspaceSwitcher />
      <nav className="flex-1 overflow-y-auto px-3 pb-4">
        {nav.map((g) => (
          <div key={g.group} className="mt-4 first:mt-1">
            <div className="eyebrow mb-1 px-2.5">{g.group}</div>
            <div className="grid gap-0.5">
              {g.items.map((it) => (
                <NavLink key={it.to} {...it} active={isActive(it.to)} onNavigate={onNavigate} />
              ))}
            </div>
          </div>
        ))}
      </nav>
      <div className="grid gap-0.5 border-t border-sidebar-border p-3">
        {footerNav.map((it) => (
          <NavLink key={it.to} {...it} active={isActive(it.to)} onNavigate={onNavigate} />
        ))}
        <div className="mt-2 flex items-center justify-between px-2.5 font-mono text-2xs text-subtle-foreground">
          <span>v0.4.0-dev</span>
          <span className="flex items-center gap-1.5">
            <span className="size-1.5 rounded-full bg-success" />
            local
          </span>
        </div>
      </div>
    </div>
  );
}

function WorkspaceSwitcher() {
  return (
    <div className="px-3 pt-3">
      <DropdownMenu>
        <DropdownMenuTrigger className="flex w-full items-center gap-2 rounded-md border border-sidebar-border bg-surface px-2.5 py-1.5 text-left shadow-xs hover:border-border-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
          <span className="flex size-5 items-center justify-center rounded-sm bg-primary-soft font-mono text-2xs font-semibold text-primary">
            LS
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-xs font-medium">Personal lab</span>
            <span className="block truncate font-mono text-2xs text-muted-foreground">
              ws_lirije
            </span>
          </span>
          <ChevronsUpDown className="size-3.5 text-muted-foreground" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-[208px]">
          <DropdownMenuLabel className="eyebrow">Workspaces</DropdownMenuLabel>
          <DropdownMenuItem>
            Personal lab <Check className="ml-auto size-3.5" />
          </DropdownMenuItem>
          <DropdownMenuItem>Acme · Staging</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>New workspace…</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function TopBar({ path, onMenu }: { path: string; onMenu: () => void }) {
  const current = allItems.find((i) => (i.to === "/" ? path === "/" : path.startsWith(i.to)));
  return (
    <header className="sticky top-0 z-20 flex h-[var(--topbar-h)] items-center gap-3 border-b border-border bg-background/95 px-3 backdrop-blur-sm md:px-6">
      <Button
        variant="ghost"
        size="icon-sm"
        className="lg:hidden"
        onClick={onMenu}
        aria-label="Open navigation"
      >
        <Menu />
      </Button>
      <nav aria-label="Breadcrumb" className="flex min-w-0 items-center gap-1.5 text-sm">
        <span className="hidden text-muted-foreground sm:inline">Personal lab</span>
        <span className="hidden text-subtle-foreground sm:inline">/</span>
        <span className="truncate font-medium text-foreground">{current?.label ?? "Page"}</span>
      </nav>
      <div className="ml-auto flex items-center gap-2">
        <button className="hidden h-7 w-56 items-center gap-2 rounded-md border border-border bg-surface px-2 text-xs text-subtle-foreground shadow-xs hover:border-border-strong md:flex">
          <Search className="size-3.5" />
          <span className="flex-1 text-left">Search workspace</span>
          <Kbd>⌘</Kbd>
          <Kbd>K</Kbd>
        </button>
        <span className="hidden font-mono text-2xs text-muted-foreground sm:inline">
          $4.12 / $25 this month
        </span>
        <DropdownMenu>
          <DropdownMenuTrigger
            aria-label="Account"
            className="flex size-7 items-center justify-center rounded-full bg-foreground font-mono text-2xs text-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            LS
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuLabel>
              <div className="text-sm">Lirije Shabani</div>
              <div className="font-mono text-2xs font-normal text-muted-foreground">
                lirije@example.com
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/settings">
                <User className="size-3.5" /> Profile & settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/design-system">
                <BookOpen className="size-3.5" /> Design system
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <LogOut className="size-3.5" /> Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const { pathname: path } = useLocation();
  const [open, setOpen] = useState(false);
  return (
    <div className="flex min-h-screen w-full">
      <aside className="sticky top-0 hidden h-screen w-[var(--sidebar-w)] shrink-0 border-r border-sidebar-border bg-sidebar lg:block">
        <SidebarBody path={path} />
      </aside>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-[var(--sidebar-w)] bg-sidebar p-0">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <SidebarBody path={path} onNavigate={() => setOpen(false)} />
        </SheetContent>
      </Sheet>
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar path={path} onMenu={() => setOpen(true)} />
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
