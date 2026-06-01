import { ImageResponse } from 'next/og';

export const runtime = 'edge';

const W = 1080, H = 1350;

const PX = (id: number) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=1080&h=1350&fit=crop`;

const SLIDES = [
  null,
  {
    headline: 'THINGS NO ONE\nTELLS YOU\nABOUT BALI',
    body: '',
    photo: PX(5511770), // dramatic Bali landscape
    iscover: true,
  },
  {
    headline: "BALI ISN'T\nALWAYS\nPEACEFUL",
    body: "It's not all zen 🛵\nBali looks calm, but traffic & chaos are real.\n💡 Want peace? Skip Canggu. Head to Sidemen or Amed.",
    photo: PX(19881163),
    page: '02',
  },
  {
    headline: 'BALI BELLY',
    body: 'Bali Belly is no joke 💧\nTap water? Big mistake.\n🚫 Bottled water only — even for brushing your teeth.',
    photo: PX(28035121),
    page: '03',
  },
  {
    headline: 'MONKEY\nTHIEVES',
    body: 'The monkeys WILL rob you 🐒\nCute... until they steal your phone.\n👜 Hold tight at Ubud Monkey Forest.',
    photo: PX(27076288),
    page: '04',
  },
  {
    headline: 'TEMPLE\nDRESS CODE',
    body: "Temples have rules. Don't wing it. 🛕\nLong pants? Still not enough.\n🎋 Bring a sarong or you'll be turned away.",
    photo: PX(3067621),
    page: '05',
  },
  {
    headline: 'PLANNING A BALI\nTRIP? SAVE\nTHIS POST! 📍✈️',
    body: 'Which tip shocked you the most?\n👇 Drop it in the comments!',
    photo: PX(36810327),
    page: '06',
  },
];

const TOTAL = SLIDES.length - 1;

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ city: string; slide: string }> }
) {
  const { slide: slideStr } = await params;
  const n = parseInt(slideStr, 10);
  if (isNaN(n) || n < 1 || n > TOTAL) return new Response(`1–${TOTAL}`, { status: 400 });

  const s = SLIDES[n] as any;

  const opts = { width: W, height: H };
  const headlineFont = { fontWeight: 900 as const };

  return new ImageResponse(
    <div style={{ width:W, height:H, display:'flex', flexDirection:'column',
      position:'relative', overflow:'hidden' }}>

      {/* FULL-BLEED PHOTO */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={s.photo} alt="" style={{ position:'absolute', inset:0,
        width:'100%', height:'100%', objectFit:'cover', objectPosition:'center' }} />

      {/* DARK OVERLAY — gradient: lighter top, heavier where text is */}
      <div style={{ display:'flex', position:'absolute', inset:0,
        background:'linear-gradient(to bottom, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.40) 25%, rgba(0,0,0,0.62) 55%, rgba(0,0,0,0.72) 100%)' }} />

      {/* Extra dark band in center where text sits */}
      <div style={{ display:'flex', position:'absolute',
        top:'22%', bottom:'8%', left:0, right:0,
        background:'rgba(0,0,0,0.22)' }} />

      {/* CONTENT */}
      <div style={{ display:'flex', flexDirection:'column', position:'relative',
        height:'100%', padding:'40px 48px' }}>

        {/* TOP: @handle center + P.0X right */}
        <div style={{ display:'flex', justifyContent:'center', alignItems:'center',
          position:'relative', marginBottom:'auto' }}>
          <span style={{ fontSize:20, color:'rgba(255,255,255,0.92)',
            fontWeight:700, letterSpacing:2 }}>
            @tripgenius.in
          </span>
          {!s.iscover && s.page && (
            <span style={{ position:'absolute', right:0,
              fontSize:18, color:'rgba(255,255,255,0.85)', fontWeight:700, letterSpacing:2 }}>
              P. {s.page}
            </span>
          )}
        </div>

        {/* CENTER: headline + body */}
        <div style={{ display:'flex', flexDirection:'column', alignItems:'center',
          justifyContent:'center', flex:1 }}>

          {/* GIANT HEADLINE */}
          <span style={{
            ...headlineFont,
            fontSize: s.iscover ? 110 : 120,
            color: '#FFFFFF',
            textAlign: 'center' as const,
            lineHeight: 1.0,
            letterSpacing: -1,
            marginBottom: s.body ? 36 : 0,
            whiteSpace: 'pre-line' as const,
          }}>
            {s.headline}
          </span>

          {/* BODY TEXT */}
          {s.body && (
            <span style={{
              fontSize: 28,
              fontWeight: 500,
              color: 'rgba(255,255,255,0.95)',
              textAlign: 'center' as const,
              lineHeight: 1.7,
              whiteSpace: 'pre-line' as const,
              maxWidth: 820,
            }}>
              {s.body}
            </span>
          )}
        </div>

        {/* BOTTOM: progress dots */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
          {Array.from({ length: TOTAL }).map((_, i) => (
            <div key={i} style={{ display:'flex', borderRadius:'50%',
              width: i === n-1 ? 14 : 9, height: i === n-1 ? 14 : 9,
              background: i === n-1 ? '#ffffff' : 'rgba(255,255,255,0.45)' }} />
          ))}
        </div>

      </div>
    </div>,
    opts
  );
}
