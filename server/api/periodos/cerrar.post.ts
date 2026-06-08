import pg from 'pg'
import { serverSupabaseUser } from '#supabase/server'

const { Pool } = pg
const pool = new Pool({ connectionString: process.env.DIRECT_URL })

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event)
  if (!user) throw createError({ statusCode: 401, message: 'No autenticado' })

  const userId = user.sub
  const now = new Date()
  const mes = now.getMonth() + 1
  const anio = now.getFullYear()

  const client = await pool.connect()
  try {
    // Cerrar periodo abierto
    await client.query(
      'UPDATE periodos SET estado = $1 WHERE user_id = $2 AND estado = $3',
      ['cerrado', userId, 'abierto']
    )

    // Crear nuevo periodo abierto
    const r = await client.query(
      'INSERT INTO periodos (id, user_id, estado, mes, anio, created_at, updated_at) VALUES (gen_random_uuid(), $1, $2, $3, $4, NOW(), NOW()) RETURNING *',
      [userId, 'abierto', mes, anio]
    )

    return { periodo: r.rows[0] }
  } finally {
    client.release()
  }
})
