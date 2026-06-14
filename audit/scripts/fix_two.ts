import sharp from 'sharp';
import { readFileSync, writeFileSync } from 'node:fs';
import { getCityImageUrl } from '../../src/lib/cityImages';
const UA='TripGenius-image-audit/1.0 (https://www.tripgenius.in)';
const sleep=(ms:number)=>new Promise(r=>setTimeout(r,ms));
const REJECT=['flag','coat_of_arms','seal','logo','locator_map','.svg','locationmap','emblem','map_of'];
const toOriginal=(u:string)=>u.replace('/commons/thumb/','/commons/').replace(/\/\d+px-[^/]+$/,'');
const isBad=(u:string)=>{const l=u.toLowerCase();return REJECT.some(b=>l.includes(b))||!/\.(jpe?g|png)$/i.test(toOriginal(u));};
const CAND:Record<string,string[]>={penang:['George Town, Penang','Penang Island','Penang'],jeju:['Jeju City','Jeju Island','Jeju Province']};
async function getJson(u:string){try{const r=await fetch(u,{headers:{'User-Agent':UA}});return r.ok?await r.json():null;}catch{return null;}}
async function dl(u:string){for(let a=1;a<=4;a++){try{const r=await fetch(u,{headers:{'User-Agent':UA,accept:'image/*'}});if(r.status===429||r.status===503){await sleep(1500*a);continue;}if(!r.ok)return null;return Buffer.from(await r.arrayBuffer());}catch{await sleep(800*a);}}return null;}
(async()=>{
  const res=JSON.parse(readFileSync('audit/localize-rest.json','utf8'));
  for(const slug of ['penang','jeju']){
    let url:string|null=null, via='';
    for(const t of CAND[slug]){
      const s:any=await getJson(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(t.replace(/ /g,'_'))}`);
      await sleep(200);
      if(s&&s.type!=='disambiguation'){const raw=s.originalimage?.source||(s.thumbnail?.source?toOriginal(s.thumbnail.source):null);if(raw&&!isBad(raw)){url=raw;via='wiki:'+t;break;}}
    }
    if(!url){url=getCityImageUrl(slug,'hero');via='curated';}
    const buf=url?await dl(url):null;
    if(!buf){console.log('✗',slug,'(still failed)');continue;}
    await sharp(buf).flatten({background:'#ffffff'}).resize({width:1200,withoutEnlargement:true}).jpeg({quality:80,mozjpeg:true}).toFile(`public/city-images/${slug}.jpg`);
    res.map[slug]=`/city-images/${slug}.jpg`;
    res.failed=res.failed.filter((s:string)=>s!==slug);
    console.log('✓',slug,'via',via);
  }
  writeFileSync('audit/localize-rest.json',JSON.stringify(res,null,2));
})();
