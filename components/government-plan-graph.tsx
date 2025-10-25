"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CheckCircle2, Clock, AlertCircle, Circle, Search, Calendar, TrendingUp } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

type NodeStatus = "completed" | "in-progress" | "delayed" | "pending"

interface PlanNode {
  id: string
  title: string
  description: string
  status: NodeStatus
  progress: number
  category: string
  connections: string[]
  deadline?: string
}

const mockGovernmentPlan: PlanNode[] = [
  {
    id: "1",
    title: "Reforma Educativa",
    description: "Implementación de nuevo currículo nacional",
    status: "in-progress",
    progress: 65,
    category: "Educación",
    connections: ["2", "3"],
    deadline: "Dic 2025",
  },
  {
    id: "2",
    title: "Infraestructura Escolar",
    description: "Construcción de 50 nuevas escuelas",
    status: "in-progress",
    progress: 40,
    category: "Educación",
    connections: ["1"],
    deadline: "Jun 2026",
  },
  {
    id: "3",
    title: "Capacitación Docente",
    description: "Programa de formación continua para profesores",
    status: "completed",
    progress: 100,
    category: "Educación",
    connections: ["1"],
    deadline: "Mar 2025",
  },
  {
    id: "4",
    title: "Sistema de Salud Digital",
    description: "Digitalización de historias clínicas",
    status: "delayed",
    progress: 25,
    category: "Salud",
    connections: ["5"],
    deadline: "Sep 2025",
  },
  {
    id: "5",
    title: "Telemedicina Rural",
    description: "Acceso a consultas médicas remotas en zonas rurales",
    status: "pending",
    progress: 10,
    category: "Salud",
    connections: ["4"],
    deadline: "Dic 2026",
  },
  {
    id: "6",
    title: "Transporte Público Sostenible",
    description: "Renovación de flota con vehículos eléctricos",
    status: "in-progress",
    progress: 55,
    category: "Transporte",
    connections: ["7"],
    deadline: "Ago 2025",
  },
  {
    id: "7",
    title: "Ciclovías Urbanas",
    description: "Red de 200km de ciclovías en ciudades principales",
    status: "in-progress",
    progress: 70,
    category: "Transporte",
    connections: ["6"],
    deadline: "Nov 2025",
  },
]

const statusConfig = {
  completed: {
    icon: CheckCircle2,
    color: "text-green-600",
    bg: "bg-green-50",
    border: "border-green-200",
    label: "Completado",
  },
  "in-progress": {
    icon: Clock,
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-200",
    label: "En Progreso",
  },
  delayed: {
    icon: AlertCircle,
    color: "text-red-600",
    bg: "bg-red-50",
    border: "border-red-200",
    label: "Retrasado",
  },
  pending: {
    icon: Circle,
    color: "text-gray-400",
    bg: "bg-gray-50",
    border: "border-gray-200",
    label: "Pendiente",
  },
}

export default function GovernmentPlanGraph() {
  const [initiatives, setInitiatives] = useState<PlanNode[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedNode, setSelectedNode] = useState<PlanNode | null>(null)
  const [hoveredNode, setHoveredNode] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState<NodeStatus | "all">("all")
  const [viewMode, setViewMode] = useState<"grid" | "timeline">("grid")

  useEffect(() => {
    async function loadInitiatives() {
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from("government_initiatives")
          .select(`
            *,
            initiative_connections(
              connected_initiative_id,
              relationship_type
            )
          `)
          .order("created_at", { ascending: false })

        if (error) throw error

        const transformedData: PlanNode[] = data.map((item: any) => ({
          id: item.id,
          title: item.title,
          description: item.description,
          status: item.status as NodeStatus,
          progress: item.progress,
          category: item.category,
          connections: item.initiative_connections?.map((c: any) => c.connected_initiative_id) || [],
          deadline: item.deadline
            ? new Date(item.deadline).toLocaleDateString("es-ES", { month: "short", year: "numeric" })
            : undefined,
        }))

        setInitiatives(transformedData)
      } catch (error) {
        console.error("[v0] Error loading initiatives:", error)
        setInitiatives(mockGovernmentPlan)
      } finally {
        setIsLoading(false)
      }
    }

    loadInitiatives()
  }, [])

  const categories = Array.from(new Set(initiatives.map((node) => node.category)))

  const filteredPlan = initiatives.filter((node) => {
    const matchesSearch =
      node.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      node.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filterStatus === "all" || node.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const stats = {
    total: initiatives.length,
    completed: initiatives.filter((n) => n.status === "completed").length,
    inProgress: initiatives.filter((n) => n.status === "in-progress").length,
    delayed: initiatives.filter((n) => n.status === "delayed").length,
    avgProgress:
      initiatives.length > 0 ? Math.round(initiatives.reduce((acc, n) => acc + n.progress, 0) / initiatives.length) : 0,
  }

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-mustard border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-wood">Cargando iniciativas...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col lg:flex-row gap-4 lg:gap-6 p-4 lg:p-6 bg-gradient-to-br from-cream to-white overflow-auto">
      {/* Graph Visualization */}
      <div className="flex-1 bg-white rounded-xl border border-wood/20 p-4 lg:p-6 overflow-auto shadow-sm">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-wood-dark mb-2">Seguimiento del Plan de Gobierno</h2>
          <p className="text-wood mb-4">Visualización interactiva de promesas y avances gubernamentales</p>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
            <Card className="p-3 bg-gradient-to-br from-mustard/10 to-mustard/5 border-mustard/20">
              <div className="text-xs text-wood mb-1">Total Iniciativas</div>
              <div className="text-2xl font-bold text-wood-dark">{stats.total}</div>
            </Card>
            <Card className="p-3 bg-gradient-to-br from-green-50 to-green-100/50 border-green-200">
              <div className="text-xs text-green-700 mb-1">Completadas</div>
              <div className="text-2xl font-bold text-green-700">{stats.completed}</div>
            </Card>
            <Card className="p-3 bg-gradient-to-br from-blue-50 to-blue-100/50 border-blue-200">
              <div className="text-xs text-blue-700 mb-1">En Progreso</div>
              <div className="text-2xl font-bold text-blue-700">{stats.inProgress}</div>
            </Card>
            <Card className="p-3 bg-gradient-to-br from-red-50 to-red-100/50 border-red-200">
              <div className="text-xs text-red-700 mb-1">Retrasadas</div>
              <div className="text-2xl font-bold text-red-700">{stats.delayed}</div>
            </Card>
            <Card className="p-3 bg-gradient-to-br from-mustard/10 to-mustard/5 border-mustard/20">
              <div className="text-xs text-wood mb-1 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                Progreso Promedio
              </div>
              <div className="text-2xl font-bold text-wood-dark">{stats.avgProgress}%</div>
            </Card>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-wood/50" />
              <Input
                placeholder="Buscar iniciativas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-wood/20 focus:border-mustard"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={filterStatus === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterStatus("all")}
                className={filterStatus === "all" ? "bg-mustard hover:bg-mustard/90" : ""}
              >
                Todas
              </Button>
              <Button
                variant={filterStatus === "completed" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterStatus("completed")}
                className={filterStatus === "completed" ? "bg-green-600 hover:bg-green-700" : ""}
              >
                <CheckCircle2 className="w-4 h-4" />
              </Button>
              <Button
                variant={filterStatus === "in-progress" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterStatus("in-progress")}
                className={filterStatus === "in-progress" ? "bg-blue-600 hover:bg-blue-700" : ""}
              >
                <Clock className="w-4 h-4" />
              </Button>
              <Button
                variant={filterStatus === "delayed" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterStatus("delayed")}
                className={filterStatus === "delayed" ? "bg-red-600 hover:bg-red-700" : ""}
              >
                <AlertCircle className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="space-y-8">
          {categories.map((category) => {
            const categoryNodes = filteredPlan.filter((node) => node.category === category)
            if (categoryNodes.length === 0) return null

            return (
              <div key={category}>
                <h3 className="text-lg font-semibold text-wood-dark mb-4 flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-mustard" />
                  {category}
                  <Badge variant="outline" className="ml-2 text-xs">
                    {categoryNodes.length} iniciativas
                  </Badge>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categoryNodes.map((node) => {
                    const config = statusConfig[node.status]
                    const Icon = config.icon
                    const isConnected =
                      selectedNode &&
                      (selectedNode.connections.includes(node.id) || node.connections.includes(selectedNode.id))
                    const isSelected = selectedNode?.id === node.id

                    return (
                      <Card
                        key={node.id}
                        className={`p-4 cursor-pointer transition-all duration-200 hover:shadow-lg ${
                          isSelected ? "ring-2 ring-mustard shadow-lg" : isConnected ? "ring-1 ring-mustard/50" : ""
                        } ${config.border} ${config.bg}`}
                        onClick={() => setSelectedNode(node)}
                        onMouseEnter={() => setHoveredNode(node.id)}
                        onMouseLeave={() => setHoveredNode(null)}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <Badge variant="outline" className={`${config.color} border-current`}>
                            <Icon className="w-3 h-3 mr-1" />
                            {config.label}
                          </Badge>
                          {node.deadline && (
                            <div className="flex items-center gap-1 text-xs text-wood">
                              <Calendar className="w-3 h-3" />
                              {node.deadline}
                            </div>
                          )}
                        </div>

                        <h4 className="font-semibold text-wood-dark mb-2 text-sm">{node.title}</h4>
                        <p className="text-xs text-wood mb-3 line-clamp-2">{node.description}</p>

                        {/* Progress Bar */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="text-wood">Progreso</span>
                            <span className="font-semibold text-wood-dark">{node.progress}%</span>
                          </div>
                          <div className="w-full bg-wood/20 rounded-full h-2.5 overflow-hidden">
                            <div
                              className="bg-gradient-to-r from-mustard to-amber-500 h-full rounded-full transition-all duration-500 ease-out"
                              style={{ width: `${node.progress}%` }}
                            />
                          </div>
                        </div>

                        {node.connections.length > 0 && (
                          <div className="mt-2 pt-2 border-t border-wood/10">
                            <span className="text-xs text-wood">
                              {node.connections.length} {node.connections.length === 1 ? "conexión" : "conexiones"}
                            </span>
                          </div>
                        )}
                      </Card>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>

        {filteredPlan.length === 0 && (
          <div className="text-center py-12">
            <Search className="w-12 h-12 text-wood/30 mx-auto mb-3" />
            <p className="text-wood">No se encontraron iniciativas que coincidan con tu búsqueda</p>
          </div>
        )}
      </div>

      {/* Details Panel */}
      <div className="lg:w-80 w-full bg-white rounded-xl border border-wood/20 p-4 lg:p-6 shadow-sm lg:sticky lg:top-0 lg:h-[calc(100vh-3rem)]">
        {selectedNode ? (
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-bold text-wood-dark mb-2">{selectedNode.title}</h3>
              <Badge variant="outline" className={`${statusConfig[selectedNode.status].color} border-current`}>
                {statusConfig[selectedNode.status].label}
              </Badge>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-wood-dark mb-1">Descripción</h4>
              <p className="text-sm text-wood leading-relaxed">{selectedNode.description}</p>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-wood-dark mb-1">Categoría</h4>
              <p className="text-sm text-wood">{selectedNode.category}</p>
            </div>

            {selectedNode.deadline && (
              <div>
                <h4 className="text-sm font-semibold text-wood-dark mb-1">Fecha Límite</h4>
                <p className="text-sm text-wood flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {selectedNode.deadline}
                </p>
              </div>
            )}

            <div>
              <h4 className="text-sm font-semibold text-wood-dark mb-2">Progreso General</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-wood">Completado</span>
                  <span className="font-semibold text-wood-dark">{selectedNode.progress}%</span>
                </div>
                <div className="w-full bg-wood/20 rounded-full h-4 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-mustard to-amber-500 h-full rounded-full transition-all duration-500 ease-out shadow-sm"
                    style={{ width: `${selectedNode.progress}%` }}
                  />
                </div>
              </div>
            </div>

            {selectedNode.connections.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-wood-dark mb-2">Iniciativas Relacionadas</h4>
                <div className="space-y-2">
                  {selectedNode.connections.map((connId) => {
                    const connectedNode = initiatives.find((n) => n.id === connId)
                    if (!connectedNode) return null
                    return (
                      <button
                        key={connId}
                        onClick={() => setSelectedNode(connectedNode)}
                        className="w-full text-left p-2 rounded-lg border border-wood/20 hover:bg-mustard/10 transition-colors"
                      >
                        <p className="text-sm font-medium text-wood-dark">{connectedNode.title}</p>
                        <p className="text-xs text-wood">{connectedNode.category}</p>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="h-full min-h-[200px] lg:min-h-0 flex items-center justify-center text-center">
            <div>
              <Circle className="w-12 h-12 text-wood/30 mx-auto mb-3" />
              <p className="text-sm text-wood">Selecciona una iniciativa para ver más detalles</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
