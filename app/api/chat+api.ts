// Serverless sohbet endpoint'i için iskelet.
// Burayı Gemini/OpenAI entegrasyonu veya istem tabanlı iş akışı ile doldurun.

export async function POST(request: Request): Promise<Response> {
  const body = await request.json().catch(() => ({}));

  const message = body?.message ?? '';

  return Response.json(
    {
      success: false,
      error: {
        code: 'NOT_IMPLEMENTED',
        message:
          'Sohbet API route henüz uygulanmadı. Gemini/OpenAI isteği ve oturum yönetimini burada kurabilirsiniz.',
      },
      echo: message,
    },
    { status: 501 }
  );
}
