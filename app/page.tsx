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
