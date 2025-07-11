/**
 * API abstraction for managing notes via Supabase
 * Assumes a Supabase table named 'notes' with columns:
 * - id (uuid, primary key, default gen_random_uuid())
 * - title (text)
 * - content (text)
 * - created_at (timestamp, default now())
 */

import { supabase } from '../supabaseClient';

// PUBLIC_INTERFACE
export async function fetchNotes() {
  /** Fetch all notes (ordered by newest first) */
  const { data, error } = await supabase
    .from('notes')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

// PUBLIC_INTERFACE
export async function addNote(title, content) {
  /** Create a new note */
  const { data, error } = await supabase
    .from('notes')
    .insert({ title, content })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// PUBLIC_INTERFACE
export async function updateNote(id, { title, content }) {
  /** Update title/content of an existing note */
  const { data, error } = await supabase
    .from('notes')
    .update({ title, content })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

// PUBLIC_INTERFACE
export async function deleteNote(id) {
  /** Delete a note by id */
  const { error } = await supabase
    .from('notes')
    .delete()
    .eq('id', id);
  if (error) throw error;
}
