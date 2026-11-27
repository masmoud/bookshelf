import { NextResponse, type NextRequest } from 'next/server';

import { updateSession } from '@/lib/supabase/update-session';
import { createClient } from '@/lib/supabase/server';

export async function proxy(request: NextRequest) {
  const supabaseResponse = await updateSession(request);

  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  // Protect the favorites page
  if (request.nextUrl.pathname.startsWith('/favorites') && !user) {
    const redirectUrl = request.nextUrl.clone();

    redirectUrl.pathname = '/login';
    redirectUrl.searchParams.set('redirectTo', request.nextUrl.pathname);

    return NextResponse.redirect(redirectUrl);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'
  ]
};
