'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  House, 
  ChartLine, 
  Ranking, 
  Gear, 
  CurrencyBtc,
  X,
  Crown
} from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

const navigation = [
  { name: 'Dashboard', href: '/', icon: House },
  { name: 'Metrics', href: '/metrics', icon: ChartLine },
  { name: 'App Rankings', href: '/rankings', icon: Ranking },
  { name: 'Settings', href: '/settings', icon: Gear },
]

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname()

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <motion.aside
        initial={{ x: -280 }}
        animate={{ x: isOpen ? 0 : -280 }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className={cn(
          "fixed inset-y-0 left-0 z-30 w-64 sm:w-20 xl:w-64 transform bg-card",
          "lg:static lg:translate-x-0 flex flex-col"
        )}
      >
        {/* Header */}
        <div className="flex-shrink-0 overflow-hidden p-2">
          <div className="flex items-center h-full sm:justify-center xl:justify-start p-2 sidebar-separator-top">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-red-500">
              <CurrencyBtc className="h-6 w-6 text-foreground" weight="bold" />
            </div>
            <div className="block sm:hidden xl:block ml-2 font-bold text-xl text-foreground">
              CycleTop
            </div>
            <div className="flex-grow sm:hidden xl:block" />
            <button
              onClick={onClose}
              className="lg:hidden rounded-md p-1 text-muted-foreground hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Premium Card */}
        <div className="w-full p-3 h-24 sm:h-20 xl:h-24 hidden sm:block flex-shrink-0">
          <div className="bg-sidebar-card-top rounded-xl w-full h-full flex items-center justify-start sm:justify-center xl:justify-start px-3 sm:px-0 xl:px-3">
            <div className="icon-background rounded-full p-2">
              <CurrencyBtc className="w-5 h-5 text-orange-500" />
            </div>
            <div className="block sm:hidden xl:block ml-3">
              <div className="text-sm font-bold text-foreground">CycleTop Pro</div>
              <div className="text-sm text-muted-foreground">Premium Analytics</div>
            </div>
            <div className="block sm:hidden xl:block flex-grow" />
            <Crown className="block sm:hidden xl:block w-5 h-5 text-premium-yellow" />
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-2 py-4">
          {navigation.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "w-full mt-3 flex items-center px-3 sm:px-0 xl:px-3 justify-start sm:justify-center xl:justify-start sm:mt-6 xl:mt-3 cursor-pointer py-3 rounded-lg transition-all duration-200",
                  isActive
                    ? "sidebar-item-selected bg-primary/10"
                    : "sidebar-item text-muted-foreground hover:text-foreground hover:bg-accent/50"
                )}
                onClick={() => onClose()}
              >
                <Icon
                  className={cn(
                    "w-5 h-5 flex-shrink-0 transition-colors",
                    isActive
                      ? "text-foreground"
                      : "text-muted-foreground group-hover:text-foreground"
                  )}
                />
                <div className="block sm:hidden xl:block ml-3 font-medium">
                  {item.name}
                </div>
                <div className="block sm:hidden xl:block flex-grow" />
              </Link>
            )
          })}
        </nav>

        {/* Usage Card */}
        <div className="w-full p-3 h-32 hidden sm:block sm:h-20 xl:h-32 flex-shrink-0">
          <div className="rounded-xl w-full h-full px-3 sm:px-0 xl:px-3 overflow-hidden bg-gradient-to-br from-primary/20 to-purple-600/20 border border-primary/20">
            <div className="block sm:hidden xl:block pt-3">
              <div className="font-bold text-foreground text-sm">API Usage</div>
              <div className="text-muted-foreground text-xs">
                Updated {new Date().toLocaleTimeString()}
              </div>
              <div className="text-right text-muted-foreground text-xs mt-1">
                77%
              </div>
              <div className="w-full mt-2">
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-primary to-purple-600 h-2 rounded-full transition-all duration-500" 
                    style={{ width: '77%' }}
                  />
                </div>
              </div>
            </div>

            <div className="hidden sm:block xl:hidden p-2">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center">
                <span className="text-foreground font-bold text-sm">77%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 overflow-hidden p-2">
          <div className="flex items-center h-full sm:justify-center xl:justify-start p-2 sidebar-separator-bottom">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <span className="text-foreground font-bold text-sm">CT</span>
            </div>
            <div className="block sm:hidden xl:block ml-2">
              <div className="font-bold text-foreground text-sm">Admin User</div>
              <div className="text-xs text-muted-foreground">Premium Account</div>
            </div>
            <div className="flex-grow block sm:hidden xl:block" />
            <Gear className="block sm:hidden xl:block w-4 h-4 text-muted-foreground hover:text-foreground cursor-pointer transition-colors" />
          </div>
        </div>
      </motion.aside>
    </>
  )
}