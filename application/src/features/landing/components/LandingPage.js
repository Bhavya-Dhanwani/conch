import ConchStatementSection from "./ConchStatementSection";
import FeaturesSection from "./FeaturesSection";
import HeroSection from "./HeroSection";
import styles from "./LandingPage.module.css";
import ProcessStepsSection from "./ProcessStepsSection";
import VideoRevealSection from "./VideoRevealSection";

export default function LandingPage() {
  return (
    <main className={styles.page}>
      <HeroSection />
      <FeaturesSection />
      <ProcessStepsSection />
      <VideoRevealSection />
      <ConchStatementSection />
    </main>
  );
}
