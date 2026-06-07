export default defineNuxtRouteMiddleware(async (to, from) => {
  const { data: { session } } = await useSupabaseClient().auth.getSession()

  // Si está logueado y va a login → redirigir a raíz
  if (session && to.path === '/login') {
    return navigateTo('/')
  }

  // Si no está logueado y no va a login → redirigir a login
  if (!session && to.path !== '/login') {
    return navigateTo('/login')
  }
})
