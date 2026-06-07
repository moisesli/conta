<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Navbar -->
    <nav class="bg-white border-b border-gray-200">
      <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <!-- Logo -->
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <span class="text-white font-bold text-base">C</span>
            </div>
            <span class="font-semibold text-gray-900 text-xl">Conta</span>
          </div>

          <!-- Botón Nuevo Período -->
          <button class="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-b from-gray-50 to-gray-100 text-gray-600 text-base font-medium rounded-lg border border-gray-200 hover:from-gray-100 hover:to-gray-200 hover:border-gray-300 transition-all cursor-pointer">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
            Nuevo Período
          </button>
        </div>
      </div>
    </nav>

    <!-- Page content -->
    <main class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <slot />
    </main>
  </div>
</template>
