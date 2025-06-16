

export const useAuth = () => {
    const supabase = useSupabaseClient();
    const user = useSupabaseUser();
  
    const signOut = async () => {
      await supabase.auth.signOut();
    };
  
    return {
      user,
      signOut,
    };
  };
  