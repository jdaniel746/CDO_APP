import 'react-native-url-polyfill/auto'
import { createClient } from '@supabase/supabase-js'


/*const supabaseUrl = process.env.REACT_APP_SUPABASE_URL
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY*/
const supabaseUrl = 'https://pxetihsjzmfqwhindsra.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB4ZXRpaHNqem1mcXdoaW5kc3JhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDgxMDE3ODYsImV4cCI6MjAyMzY3Nzc4Nn0.TlY3wKe1A1FA7O0LW-4CG7SvB55EhAdrSToIMiRRRqU'


export default createClient(supabaseUrl, supabaseAnonKey)