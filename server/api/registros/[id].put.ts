import pg from 'pg'
import { serverSupabaseUser } from '#supabase/server'

const { Pool } = pg
const pool = new Pool({ connectionString: process.env.DIRECT_URL })

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event)
  if (!user) throw createError({ statusCode: 401, message: 'No autenticado' })

  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, message: 'ID requerido' })

  const body = await readBody(event)
  const { descripcion, monto, fecha } = body
  if (!descripcion || !monto) throw createError({ statusCode: 400, message: 'descripcion y monto requeridos' })

  const client = await pool.connect()
  try {
    const { rowCount } = await client.query(
      `UPDATE registros SET descripcion = $1, monto = $2, fecha = $3, updated_at = NOW()
       WHERE id = $4 AND user_id = $5`,
      [descripcion, monto, fecha, id, user.sub]
    )

    if (rowCount === 0) throw createError({ statusCode: 404, message: 'Registro no encontrado' })

    return { ok: true }
  } finally {
    client.release()
  }
})
