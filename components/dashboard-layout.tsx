"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { MessageSquare, BarChart3, FileText, Settings, LogOut, Menu, X, ChevronRight } from "lucide-react"
import ChatInterface from "@/components/chat-interface"
import GovernmentPlanGraph from "@/components/government-plan-graph"

interface DashboardLayoutProps {
  user: {
    email?: string
    id: string
  }
  conversationId?: string | null
  initialMessages?: any[]
}

export default function DashboardLayout({ user, conversationId, initialMessages = [] }: DashboardLayoutProps) {
  const [activeSection, setActiveSection] = useState("chat")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const menuItems = [
    {
      id: "chat",
      label: "Hablar Con Capictive",
      icon: MessageSquare,
      description: "Conversa con el asistente AI",
    },
    {
      id: "analytics",
      label: "Análisis de Campañas",
      icon: BarChart3,
      description: "Métricas y estadísticas",
    },
    {
      id: "tracking",
      label: "Seguimiento Gubernamental",
      icon: FileText,
      description: "Monitoreo de promesas",
    },
    {
      id: "settings",
      label: "Configuración",
      icon: Settings,
      description: "Ajustes de cuenta",
    },
  ]

  return (
    <div className="flex h-screen bg-cream overflow-hidden">
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-3 rounded-xl bg-white border border-wood/20 shadow-lg hover:shadow-xl transition-all cursor-pointer hover:scale-105"
      >
        {isMobileMenuOpen ? <X className="w-5 h-5 text-wood-dark" /> : <Menu className="w-5 h-5 text-wood-dark" />}
      </button>

      <aside
        className={`${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 fixed md:static inset-y-0 left-0 z-40 w-72 bg-gradient-to-b from-amber-50 via-orange-50 to-amber-100 border-r border-wood/30 flex flex-col transition-transform duration-300 shadow-xl md:shadow-none`}
      >
        <div className="p-6 border-b border-wood/30 bg-white">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <Image
                src="/capictive-logo.png"
                alt="Capictive"
                width={48}
                height={48}
                className="transition-transform group-hover:scale-110"
              />
            </div>
            <div>
              <span className="text-xl font-bold text-wood-dark block">Capictive</span>
              <span className="text-xs text-wood">Dashboard</span>
            </div>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <div className="mb-2 px-3">
            <p className="text-xs font-semibold text-wood/60 uppercase tracking-wider">Navegación</p>
          </div>
          {menuItems.map((item) => {
            const isActive = activeSection === item.id
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveSection(item.id)
                  setIsMobileMenuOpen(false)
                }}
                className={`w-full group relative overflow-hidden rounded-xl transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "bg-gradient-to-r from-mustard to-amber-400 text-wood-dark shadow-lg shadow-mustard/20"
                    : "text-wood hover:bg-white/70 hover:shadow-md"
                }`}
              >
                <div className="flex items-center gap-3 px-4 py-3.5">
                  <div
                    className={`p-2 rounded-lg transition-colors ${
                      isActive ? "bg-white/20" : "bg-wood/5 group-hover:bg-mustard/10"
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-medium text-sm">{item.label}</div>
                    <div className={`text-xs transition-opacity ${isActive ? "opacity-80" : "opacity-60"}`}>
                      {item.description}
                    </div>
                  </div>
                  {isActive && <ChevronRight className="w-4 h-4 opacity-60" />}
                </div>
                {isActive && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
                )}
              </button>
            )
          })}
        </nav>

        <div className="p-4 border-t border-wood/30 bg-white">
          <div className="mb-3 px-3 py-2 bg-amber-50 rounded-lg border border-wood/10">
            <p className="text-xs text-wood/60 mb-1">Conectado como</p>
            <p className="text-sm font-medium text-wood-dark truncate">{user.email}</p>
          </div>
          <form action="/auth/signout" method="post">
            <Button
              type="submit"
              variant="outline"
              className="w-full border-wood/20 text-wood hover:bg-red-50 hover:text-red-600 hover:border-red-200 bg-white/50 cursor-pointer transition-all"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Cerrar Sesión
            </Button>
          </form>
        </div>
      </aside>

      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-30 transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <main className="flex-1 overflow-hidden">
        {activeSection === "chat" && (
          <ChatInterface conversationId={conversationId} initialMessages={initialMessages} />
        )}
        {activeSection === "analytics" && (
          <div className="h-full flex items-center justify-center p-4 sm:p-8 bg-gradient-to-br from-cream to-white">
            <div className="text-center max-w-md">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-mustard/20 to-amber-200/20 rounded-2xl flex items-center justify-center">
                <BarChart3 className="w-10 h-10 text-mustard" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-wood-dark mb-3">Análisis de Campañas</h2>
              <p className="text-sm sm:text-base text-wood leading-relaxed">
                Esta sección estará disponible próximamente con métricas detalladas y análisis de campañas políticas.
              </p>
            </div>
          </div>
        )}
        {activeSection === "tracking" && <GovernmentPlanGraph />}
        {activeSection === "settings" && (
          <div className="h-full flex items-center justify-center p-4 sm:p-8 bg-gradient-to-br from-cream to-white">
            <div className="text-center max-w-md">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-mustard/20 to-amber-200/20 rounded-2xl flex items-center justify-center">
                <Settings className="w-10 h-10 text-mustard" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-wood-dark mb-3">Configuración</h2>
              <p className="text-sm sm:text-base text-wood leading-relaxed">
                Personaliza tu experiencia con Capictive. Opciones de configuración disponibles próximamente.
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
