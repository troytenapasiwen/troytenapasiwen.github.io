import Dossier from "@/components/dossier/Dossier";
import Folder from "@/components/dossier/Folder";
import IntroPage from "@/components/dossier/pages/IntroPage";
import {
  ExperienceOverviewPage,
  SystemPage,
  SeakerPage,
  RecruitmentPage,
  experienceJobs,
} from "@/components/dossier/pages/ExperiencePages";
import { AnalyzerPage, ReinaPage } from "@/components/dossier/pages/ProjectPages";
import EducationPage from "@/components/dossier/pages/EducationPage";
import SkillsPage from "@/components/dossier/pages/SkillsPage";
import ContactPage from "@/components/dossier/pages/ContactPage";

/**
 * The home page is one continuous dossier. The order of the pages here must match
 * PAGES in components/dossier/timeline.ts.
 */
export default function Home() {
  const { iwsc } = experienceJobs;
  return (
    <Dossier cover={<Folder />}>
      <IntroPage />
      <ExperienceOverviewPage />
      <SystemPage pageId="exp-inventory" job={iwsc} systemName="Inventory Management System" entry={1} entries={3} />
      <SystemPage pageId="exp-crewing" job={iwsc} systemName="Crewing Management System" entry={2} entries={3} />
      <SystemPage pageId="exp-forms" job={iwsc} systemName="Automated Forms Portal" entry={3} entries={3} />
      <SeakerPage />
      <RecruitmentPage />
      <AnalyzerPage />
      <ReinaPage />
      <EducationPage />
      <SkillsPage />
      <ContactPage />
    </Dossier>
  );
}
