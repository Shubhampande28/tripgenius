import { ImageResponse } from 'next/og';

export const runtime = 'edge';

const W = 1080, H = 1350;

const PX = (id: number) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=1080&h=1350&fit=crop`;

// ── Slides — same content as @travajotrip, TripGenius branding ─────
const SLIDES = [
  null,
  {
    headline: 'THINGS NO ONE\nTELLS YOU\nABOUT BALI',
    body: '',
    photo: PX(4946925), // dramatic Bali temple sunset
    iscover: true,
  },
  {
    headline: "BALI ISN'T\nALWAYS\nPEACEFUL",
    body: "It's not all zen 🛵\nBali looks calm, but traffic & chaos are real.\n💡 Want peace? Skip Canggu. Head to Sidemen or Amed.",
    photo: PX(19881163), // Bali traffic scooters
    page: '02',
  },
  {
    headline: 'BALI BELLY',
    body: 'Bali Belly is no joke 💧\nTap water? Big mistake.\n🚫 Stick to bottled water, even for brushing your teeth.',
    photo: PX(3067621), // Bali water temple (green/tropical vibe)
    page: '03',
  },
  {
    headline: 'MONKEY\nTHIEVES',
    body: 'The monkeys WILL rob you 🐒\nThey\'re cute... until they steal your phone.\n👜 Hold onto your stuff at Ubud Monkey Forest.',
    photo: PX(27076288), // monkey Bali
    page: '04',
  },
  {
    headline: 'TEMPLE\nDRESS CODE',
    body: "Temples have rules. Don't wing it. 🛕\nLong pants? Still not enough.\n🎋 Bring a sarong, or you'll be turned away.",
    photo: PX(6015320), // Uluwatu temple
    page: '05',
  },
  {
    headline: 'PLANNING A BALI\nTRIP? SAVE\nTHIS POST! 📍✈️',
    body: 'Which tip shocked you the most?\n👇 Drop it in the comments!',
    photo: PX(36810327), // rice terraces
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

  return new ImageResponse(
    <div style={{ width:W, height:H, display:'flex', flexDirection:'column',
      position:'relative', overflow:'hidden' }}>

      {/* FULL-BLEED PHOTO */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={s.photo} alt="" style={{ position:'absolute', inset:0,
        width:'100%', height:'100%', objectFit:'cover', objectPosition:'center' }} />

      {/* DARK OVERLAY — same as original (~45%) */}
      <div style={{ display:'flex', position:'absolute', inset:0,
        background:'rgba(0,0,0,0.45)' }} />

      {/* Content layer */}
      <div style={{ display:'flex', flexDirection:'column', position:'relative',
        height:'100%', padding:'36px 44px' }}>

        {/* TOP BAR: @handle center, P.0X right */}
        <div style={{ display:'flex', justifyContent:'center', alignItems:'center',
          position:'relative', marginBottom:'auto' }}>
          {/* Handle — centered */}
          <span style={{ fontSize:18, color:'rgba(255,255,255,0.90)',
            fontWeight:600, letterSpacing:1.5 }}>
            @tripgenius.in
          </span>
          {/* Page number — absolute right */}
          {!s.iscover && (
            <span style={{ position:'absolute', right:0, fontSize:16,
              color:'rgba(255,255,255,0.80)', fontWeight:700, letterSpacing:2 }}>
              P. {s.page}
            </span>
          )}
        </div>

        {/* CENTER: headline + body */}
        <div style={{ display:'flex', flexDirection:'column', alignItems:'center',
          justifyContent:'center', flex:1, padding:'0 20px' }}>

          {/* GIANT HEADLINE — exact same style as original */}
          <span style={{
            fontSize: s.iscover ? 96 : 102,
            fontWeight:900,
            color:'#FFFFFF',
            textAlign:'center' as const,
            lineHeight:1.0,
            letterSpacing:-1,
            marginBottom: s.body ? 32 : 0,
            whiteSpace:'pre-line' as const,
          }}>
            {s.headline}
          </span>

          {/* BODY TEXT — smaller, centered, with emojis */}
          {s.body && (
            <span style={{
              fontSize:26,
              fontWeight:500,
              color:'rgba(255,255,255,0.92)',
              textAlign:'center' as const,
              lineHeight:1.65,
              whiteSpace:'pre-line' as const,
              maxWidth:780,
            }}>
              {s.body}
            </span>
          )}
        </div>

        {/* BOTTOM: progress dots */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
          {Array.from({ length: TOTAL }).map((_, i) => (
            <div key={i} style={{ display:'flex', borderRadius:'50%',
              width: i === n-1 ? 12 : 8, height: i === n-1 ? 12 : 8,
              background: i === n-1 ? '#ffffff' : 'rgba(255,255,255,0.45)' }} />
          ))}
        </div>

      </div>
    </div>,
    { width:W, height:H }
  );
}
