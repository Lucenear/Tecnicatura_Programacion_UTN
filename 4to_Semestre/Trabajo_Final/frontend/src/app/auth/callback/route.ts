import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const cookieStore = await cookies();
  const redirectCookie = cookieStore.get('fixya_post_login_redirect')?.value;
  let nextFromCookie = '/';

  if (redirectCookie) {
    try {
      nextFromCookie = redirectCookie.startsWith('/')
        ? redirectCookie
        : decodeURIComponent(redirectCookie);
    } catch {
      nextFromCookie = '/';
    }
  }

  const rawNext = searchParams.get('next') ?? nextFromCookie;
  let safeNext = '/';
  try {
    const parsed = new URL(rawNext, origin);
    if (parsed.origin === origin && rawNext.startsWith('/') && !rawNext.startsWith('//')) {
      safeNext = `${parsed.pathname}${parsed.search}${parsed.hash}`;
    }
  } catch {
    safeNext = '/';
  }

  cookieStore.delete('fixya_post_login_redirect');

  if (code) {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: CookieOptions) {
            cookieStore.set({ name, value, ...options });
          },
          remove(name: string, options: CookieOptions) {
            cookieStore.delete({ name, ...options });
          },
        },
      }
    );

    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${safeNext}`);
    }
  }

  // Si hay error o no hay codigo vuelve a la raiz
  return NextResponse.redirect(origin);
}
