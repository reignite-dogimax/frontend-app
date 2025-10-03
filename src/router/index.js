/**
 * @fileoverview Archivo de configuración para Vue Router en la aplicación DogiMax.
 * Define todas las rutas y la lógica de navegación.
 */

import { createRouter, createWebHistory } from "vue-router";

/**
 * @description Componentes importados con carga perezosa (lazy-loading).
 * Esto optimiza la carga inicial de la aplicación, cargando cada vista solo cuando se necesita.
 */

// --- Vistas Públicas y Generales ---
const HomeComponent = () => import('../views/HomeView.vue');
const NotFoundComponent = () => import('../views/NotFoundView.vue');

// --- Bounded Context: Gestión de Mascotas ---
const MascotasListComponent = () => import('../views/mascotas/MascotasListView.vue');
const MascotaDetalleComponent = () => import('../views/mascotas/MascotaDetailView.vue');
const MascotaFormComponent = () => import('../views/mascotas/MascotaFormView.vue');

// --- Bounded Context: Gestión de Citas ---
const CitasListComponent = () => import('../views/citas/CitasListView.vue');
const CitaDetalleComponent = () => import('../views/citas/CitaDetailView.vue');
const CitaFormComponent = () => import('../views/citas/CitaFormView.vue');

// --- Bounded Context: Notificaciones ---
const NotificacionesListComponent = () => import('../views/notificaciones/NotificacionesListView.vue');
const NotificacionesConfigComponent = () => import('../views/notificaciones/NotificacionesConfigView.vue');

/**
 * @type {import('vue-router').RouteRecordRaw[]}
 * @description Definición de las rutas de la aplicación, organizadas por Bounded Context.
 */
const routes = [
  // Rutas Generales
  { path: '/inicio', name: 'home', component: HomeComponent, meta: { title: 'Inicio' } },

  // --- Rutas del Bounded Context de MASCOTAS ---
  { path: '/mascotas', name: 'mascotas-lista', component: MascotasListComponent, meta: { title: 'Mis Mascotas' } },
  { path: '/mascotas/nueva', name: 'mascotas-nueva', component: MascotaFormComponent, meta: { title: 'Registrar Mascota' } },
  { path: '/mascotas/:id', name: 'mascotas-detalle', component: MascotaDetalleComponent, meta: { title: 'Perfil de Mascota' } },
  { path: '/mascotas/:id/editar', name: 'mascotas-editar', component: MascotaFormComponent, meta: { title: 'Editar Mascota' } },

  // --- Rutas del Bounded Context de CITAS ---
  { path: '/citas', name: 'citas-lista', component: CitasListComponent, meta: { title: 'Agenda de Citas' } },
  { path: '/citas/agendar', name: 'citas-agendar', component: CitaFormComponent, meta: { title: 'Agendar Nueva Cita' } },
  { path: '/citas/:id', name: 'citas-detalle', component: CitaDetalleComponent, meta: { title: 'Detalle de Cita' } },

  // --- Rutas del Bounded Context de NOTIFICACIONES ---
  { path: '/notificaciones', name: 'notificaciones-lista', component: NotificacionesListComponent, meta: { title: 'Mis Notificaciones' } },
  { path: '/notificaciones/configuracion', name: 'notificaciones-config', component: NotificacionesConfigComponent, meta: { title: 'Configurar Notificaciones' } },

  // Ruta por defecto y de "No Encontrado" (404)
  { path: '/', redirect: { name: 'home' } },
  { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFoundComponent, meta: { title: 'Página no encontrada' } },
];

/**
 * @type {import('vue-router').Router}
 * @description Instancia del router configurada con modo historial de HTML5.
 */
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

/**
 * @description Navigation Guard global que se ejecuta antes de cada cambio de ruta.
 * Actualiza el título de la página dinámicamente.
 */
router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = `DogiMax | ${to.meta.title}`;
  } else {
    document.title = 'DogiMax';
  }
  next();
});

export default router;
