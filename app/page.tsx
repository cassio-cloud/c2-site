import { Header } from "@/components/home/Header";
import { Hero } from "@/components/home/Hero";
import { BentoGrid } from "@/components/home/BentoGrid";
import { IaSection } from "@/components/home/IaSection";
import { Clientes } from "@/components/home/Clientes";
import { Estrutura } from "@/components/home/Estrutura";
import { Team } from "@/components/home/Team";
import { Contact } from "@/components/home/Contact";
import { Footer } from "@/components/home/Footer";
import { OrganizationLd } from "@/components/seo/JsonLd";
import { readSite } from "@/lib/site";
import { mediaSrc } from "@/lib/media-url";

/**
 * Home dinâmica: a Vercel CDN cacheava o HTML mesmo com revalidatePath
 * acionado pelo admin. Render-on-request resolve. Como o RSC é leve
 * e os assets (mídia, fonts) são CDN-cached, o hit cold é só o HTML.
 */
export const dynamic = "force-dynamic";

export default async function Home() {
  const site = await readSite();
  return (
    <>
      <OrganizationLd />
      <Header />
      <Hero videoSrc={site.hero.embed || mediaSrc(site.hero.video)} />
      <BentoGrid />
      <IaSection />
      <Estrutura />
      <Clientes />
      <Team />
      <Contact />
      <Footer />
    </>
  );
}
