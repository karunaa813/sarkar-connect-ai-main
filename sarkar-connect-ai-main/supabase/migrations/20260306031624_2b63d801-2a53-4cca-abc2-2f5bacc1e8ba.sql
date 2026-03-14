-- Fix: Always assign 'citizen' role regardless of client-supplied metadata
-- This prevents privilege escalation via signup metadata manipulation
CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, portal_type)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    'citizen'
  );
  
  -- Always assign citizen role; promotion to official/admin must be done by an admin
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'citizen'::app_role);
  
  RETURN NEW;
END;
$function$;

-- Fix: Tighten access_requests INSERT policy with basic validation
-- Drop the overly permissive policy
DROP POLICY IF EXISTS "Anyone can insert access requests" ON public.access_requests;

-- Create a new policy that validates input lengths
CREATE POLICY "Anyone can insert access requests with validation"
  ON public.access_requests FOR INSERT
  WITH CHECK (
    length(full_name) <= 200
    AND length(email) <= 255
    AND length(department) <= 200
    AND length(designation) <= 200
    AND (reason IS NULL OR length(reason) <= 1000)
    AND email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
  );