import pg from 'pg'
import { serverSupabaseUser } from '#supabase/server'

const { Pool } = pg
const pool = new Pool({ connectionString: process.env.DIRECT_URL })

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event)
  if (!user) throw createError({ statusCode: 401, message: 'No autenticado' })

  const userId = user.sub

  const body = await readBody(event)
  const { descripcion, monto, fecha } = body
  if (!descripcion || !monto) throw createError({ statusCode: 400, message: 'descripcion y monto requeridos' })

  const client = await pool.connect()
  try {
    const { rows: [periodo] } = await client.query(
      'SELECT id FROM periodos WHERE user_id = $1 AND estado = $2 LIMIT 1',
      [userId, 'abierto']
    )
    if (!periodo) throw createError({ statusCode: 400, message: 'No hay periodo abierto' })

    const { rows: [registro] } = await client.query(
      `INSERT INTO registros (periodo_id, user_id, descripcion, monto, fecha)
       VALUES ($1, $2, $3, $4, $5) RETURNING id, descripcion, monto, fecha`,
      [periodo.id, userId, descripcion, monto, fecha || new Date().toISOString().split('T')[0]]
    )

    return { registro }
  } finally {
    client.release()
  }
})
