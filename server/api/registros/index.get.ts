import pg from 'pg'
import { serverSupabaseUser } from '#supabase/server'

const { Pool } = pg
const pool = new Pool({ connectionString: process.env.DIRECT_URL })

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event)
  if (!user) throw createError({ statusCode: 401, message: 'No autenticado' })

  const userId = user.sub

  const client = await pool.connect()
  try {
    // Obtener periodo abierto
    const { rows: [periodo] } = await client.query(
      'SELECT id FROM periodos WHERE user_id = $1 AND estado = $2 LIMIT 1',
      [userId, 'abierto']
    )
    if (!periodo) return { registros: [], total: 0 }

    // Obtener registros del periodo
    const { rows: registros } = await client.query(
      'SELECT id, descripcion, monto, fecha FROM registros WHERE periodo_id = $1 AND user_id = $2 ORDER BY fecha DESC, created_at DESC',
      [periodo.id, userId]
    )

    const total = registros.reduce((s, r) => s + Number(r.monto), 0)

    return { registros, total }
  } finally {
    client.release()
  }
})
