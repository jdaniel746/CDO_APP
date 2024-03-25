import 'react-native-url-polyfill/auto'
import { createClient } from '@supabase/supabase-js'


const supabaseUrl = process.env.REACT_APP_SUPABASE_URL
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY
console.log(JSON.stringify(supabaseUrl)+" PPP "+JSON.stringify(supabaseAnonKey))


export default createClient(supabaseUrl, supabaseAnonKey)