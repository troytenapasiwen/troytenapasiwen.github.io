import Dossier from "@/components/dossier/Dossier";
import Folder from "@/components/dossier/Folder";
import PlainEdition from "@/components/plain/PlainEdition";
import IntroPage from "@/components/dossier/pages/IntroPage";
import {
  ExperienceOverviewPage,
  SystemPage,
  SeakerPage,
  MarinoPage,
  RecruitmentPage,
  experienceJobs,
} from "@/components/dossier/pages/ExperiencePages";
import { ExperienceDividerPage, ProjectsDividerPage } from "@/components/dossier/pages/DividerPages";
import { RoleIntroPage } from "@/components/dossier/pages/RoleIntroPages";
import { AnalyzerHowPage, AnalyzerPage, ReinaScreensPage, ReinaPage } from "@/components/dossier/pages/ProjectPages";
import EducationPage from "@/components/dossier/pages/EducationPage";
import SkillsPage from "@/components/dossier/pages/SkillsPage";
import ContactPage from "@/components/dossier/pages/ContactPage";

/**
 * The home page is one continuous dossier, plus the plain reading edition of the same content.
 * The order of the pages here must match PAGES in components/dossier/timeline.ts.
 */
export default function Home() {
  const { iwsc, seaker } = experienceJobs;
  return (
    <Dossier cover={<Folder />} plain={<PlainEdition />}>
      <IntroPage />
      <ExperienceDividerPage />
      <RoleIntroPage pageId="exp-intro-iwsc" job={iwsc} position={1} of={2} plate="software" />
      <ExperienceOverviewPage />
      <SystemPage pageId="exp-inventory" job={iwsc} systemName="Inventory Management System" entry={1} entries={3} />
      <SystemPage pageId="exp-crewing" job={iwsc} systemName="Crewing Management System" entry={2} entries={3} />
      <SystemPage pageId="exp-forms" job={iwsc} systemName="Automated Forms Portal" entry={3} entries={3} />
      <RoleIntroPage pageId="exp-intro-seaker" job={seaker} position={2} of={2} plate="marketing" />
      <SeakerPage />
      <MarinoPage />
      <RecruitmentPage />
      <ProjectsDividerPage />
      <AnalyzerPage />
      <AnalyzerHowPage />
      <ReinaPage />
      <ReinaScreensPage />
      <EducationPage />
      <SkillsPage />
      <ContactPage />
    </Dossier>
  );
}
