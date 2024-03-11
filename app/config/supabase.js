import 'react-native-url-polyfill/auto'
import { createClient } from '@supabase/supabase-js'


/*const supabaseUrl = process.env.REACT_APP_SUPABASE_URL
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY
*/

const supabaseUrl= "https://krqewqveujecbdqbgtxi.supabase.co"
const supabaseAnonKey= "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtycWV3cXZldWplY2JkcWJndHhpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDg0NDcyMTksImV4cCI6MjAyNDAyMzIxOX0.mz16kb9qkUpoYm3Ya6EzuwXRVVRBorCCykm2IrPkVAE"
export default createClient(supabaseUrl, supabaseAnonKey)