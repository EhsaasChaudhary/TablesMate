'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Menu, X, Table } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from './themetoggle'

const navItems = [
  { name: 'Dashboard', href: '/' },
  { name: 'Table Workspace', href: '/TableWorkspace' },
  { name: 'Data Workspace', href: '/DataWorkspace' },
]

export function Navbar() {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav className={cn(
      "sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
      isScrolled && "shadow-sm"
    )}>
      <div className="container flex h-16 items-center justify-between md:justify-center">
        <div className="flex items-center md:absolute md:left-4">
          <Link href="/" className="flex items-center space-x-2">
            <Table className="h-6 w-6" />
            <span className="font-bold text-lg">
              TablesMate
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-foreground/80",
                pathname === item.href
                  ? "text-foreground"
                  : "text-foreground/60"
              )}
            >
              {item.name}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex md:absolute md:right-4">
          <ThemeToggle/>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <div className="flex items-center">
            <ThemeToggle/>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
              className="ml-2"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="space-y-1 px-2 pb-3 pt-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "block rounded-md px-3 py-2 text-base font-medium",
                  pathname === item.href
                    ? "bg-foreground/10 text-foreground"
                    : "text-foreground/60 hover:bg-foreground/5 hover:text-foreground"
                )}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  )
}

