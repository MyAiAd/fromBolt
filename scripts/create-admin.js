import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = 'http://127.0.0.1:54321'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU'

const supabase = createClient(supabaseUrl, supabaseKey)

async function signInAdmin() {
  try {
    // First, let's update the user's password
    const { error: updateError } = await supabase.auth.admin.updateUserById(
      '00000000-0000-0000-0000-000000000001',
      { password: 'password123' }
    )

    if (updateError) {
      console.error('Error updating password:', updateError.message)
      return
    }

    console.log('Password updated successfully')

    // Now try to sign in
    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'admin@example.com',
      password: 'password123'
    })

    if (error) {
      console.error('Error signing in:', error.message)
      return
    }

    console.log('Signed in successfully:', data)
  } catch (error) {
    console.error('Error:', error)
  }
}

signInAdmin() 