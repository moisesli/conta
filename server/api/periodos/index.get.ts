import { createClient } from '@supabase/supabase-js'
import pg from 'pg'

const { Pool } = pg
const pool = new Pool({ connectionString: process.env.DATABASE_URL })

const supabaseUrl = process.env.NUXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_KEY!

export default defineEventHandler(async (event) => {
  const cookie = getHeader(event, 'cookie') || ''
  const match = cookie.match(/sb-.+-auth-token=([^;]+)/)
  if (!match) throw createError({ statusCode: 401, message: 'No autenticado' })

  const supabase = createClient(supabaseUrl, supabaseKey, { auth: { persistSession: false } })
  const { data: { user } } = await supabase.auth.getUser(match[1])
  if (!user) throw createError({ statusCode: 401, message: 'No autenticado' })

  const userId = user.id
  const now = new Date()
  const mes = now.getMonth() + 1
  const anio = now.getFullYear()

  const client = await pool.connect()
  try {
    let { rows } = await client.query(
      'SELECT * FROM periodos WHERE user_id = $1 AND estado = $2 LIMIT 1',
      [userId, 'abierto']
    )
    let periodo = rows[0]

    if (!periodo) {
      const r = await client.query(
        'INSERT INTO periodos (id, user_id, estado, mes, anio, created_at, updated_at) VALUES (gen_random_uuid(), $1, $2, $3, $4, NOW(), NOW()) RETURNING *',
        [userId, 'abierto', mes, anio]
      )
      periodo = r.rows[0]
    }

    return { periodo }
  } finally {
    client.release()
  }
})
