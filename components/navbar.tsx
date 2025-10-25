import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { Menu, Home, Video, Mic, Mail, Database, User, LogOut } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export default async function Navbar() {
  const supabase = await getSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const navLinks = [
    { href: "/", label: "Inicio", icon: Home },
    { href: "/videos", label: "Videos", icon: Video },
    { href: "/podcast", label: "Podcasts", icon: Mic },
    { href: "/newsletter", label: "Newsletter", icon: Mail },
    { href: "/database", label: "Base de Datos", icon: Database },
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/95 backdrop-blur-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 sm:gap-3">
            <Image src="/capictive-logo.png" alt="Capictive" width={40} height={40} className="rounded-full" />
            <div className="text-lg sm:text-xl font-semibold tracking-tight text-foreground">Capictive</div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <Link href="/dashboard">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-wood/20 text-wood hover:bg-mustard/10 bg-transparent"
                  >
                    Dashboard
                  </Button>
                </Link>
                <form action="/auth/signout" method="post">
                  <Button type="submit" variant="default" size="sm">
                    Cerrar Sesión
                  </Button>
                </form>
              </>
            ) : (
              <Link href="/login">
                <Button variant="default" size="sm">
                  Iniciar Sesión
                </Button>
              </Link>
            )}
          </div>

          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="cursor-pointer hover:bg-mustard/10">
                <Menu className="h-6 w-6 text-wood" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] bg-cream border-l border-wood/10">
              <div className="flex flex-col h-full">
                {/* Mobile Menu Header */}
                <div className="flex items-center gap-3 pb-6 border-b border-wood/10">
                  <Image
                    src="/capictive-logo.png"
                    alt="Capictive"
                    width={48}
                    height={48}
                    className="rounded-full shadow-sm"
                  />
                  <div>
                    <div className="text-xl font-semibold text-wood">Capictive</div>
                    <div className="text-xs text-wood/60">Tu detective político</div>
                  </div>
                </div>

                {/* Navigation Links */}
                <div className="flex flex-col gap-2 mt-6 flex-1">
                  {navLinks.map((link) => {
                    const Icon = link.icon
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="flex items-center gap-3 px-4 py-3 rounded-lg text-wood/80 hover:text-wood hover:bg-mustard/10 transition-all duration-200 group"
                      >
                        <Icon className="h-5 w-5 group-hover:scale-110 transition-transform" />
                        <span className="text-base font-medium">{link.label}</span>
                      </Link>
                    )
                  })}
                </div>

                {/* Auth Section */}
                <div className="border-t border-wood/10 pt-4 space-y-3 mt-auto">
                  {user ? (
                    <>
                      <Link href="/dashboard" className="block">
                        <Button
                          variant="outline"
                          className="w-full border-wood/20 text-wood hover:bg-mustard/20 bg-transparent shadow-sm flex items-center gap-2 cursor-pointer"
                        >
                          <User className="h-4 w-4" />
                          Dashboard
                        </Button>
                      </Link>
                      <form action="/auth/signout" method="post">
                        <Button
                          type="submit"
                          variant="default"
                          className="w-full bg-wood hover:bg-wood/90 text-cream shadow-sm flex items-center gap-2 cursor-pointer"
                        >
                          <LogOut className="h-4 w-4" />
                          Cerrar Sesión
                        </Button>
                      </form>
                    </>
                  ) : (
                    <Link href="/login" className="block">
                      <Button
                        variant="default"
                        className="w-full bg-mustard hover:bg-mustard/90 text-wood shadow-sm flex items-center gap-2 cursor-pointer"
                      >
                        <User className="h-4 w-4" />
                        Iniciar Sesión
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  )
}

export { Navbar }
