import { createClient } from '@supabase/supabase-js'
import { getEnv } from './env.js'

const { SUPABASE_URL, SUPABASE_ANON_KEY } = getEnv()

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// GET — buscar registros com filtros simples
export async function get(tabela, filtros = {}) {
  let q = supabase.from(tabela).select('*')
  for (const [col, val] of Object.entries(filtros)) {
    q = q.eq(col, val)
  }
  const { data, error } = await q
  if (error) throw error
  return data || []
}

// GET ONE — buscar um registro por id
export async function getOne(tabela, id) {
  const { data, error } = await supabase
    .from(tabela).select('*').eq('id', id).maybeSingle()
  if (error) throw error
  return data
}

// INSERT — inserir registro (sem .single() para evitar erro com RLS)
export async function insert(tabela, dados) {
  const { data, error } = await supabase
    .from(tabela).insert(dados).select()
  if (error) throw error
  return data?.[0] || dados
}

// UPDATE — atualizar registro (sem .single() para evitar erro com RLS)
export async function update(tabela, id, dados) {
  const { data, error } = await supabase
    .from(tabela).update(dados).eq('id', id).select()
  if (error) throw error
  return data?.[0] || dados
}

// DELETE — remover registro
export async function remove(tabela, id) {
  const { error } = await supabase.from(tabela).delete().eq('id', id)
  if (error) throw error
  return true
}

// RPC — chamar função do banco
export async function rpc(funcao, params = {}) {
  const { data, error } = await supabase.rpc(funcao, params)
  if (error) throw error
  return data
}

// UPLOAD — enviar arquivo para o Storage
export async function upload(bucket, caminho, arquivo) {
  const { data, error } = await supabase.storage
    .from(bucket).upload(caminho, arquivo, { upsert: true })
  if (error) throw error
  const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(caminho)
  return urlData.publicUrl
}

// QUERY AVANÇADA — para filtros complexos com builder
export async function query(tabela, fn) {
  let q = supabase.from(tabela).select('*')
  q = fn(q)
  const { data, error } = await q
  if (error) throw error
  return data || []
}
