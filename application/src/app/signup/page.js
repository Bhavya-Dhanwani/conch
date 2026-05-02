import AuthExperience from "@/features/auth/components/AuthExperience";

export const metadata = {
  title: "Signup | CONCH",
  description: "Create your CONCH account.",
};

export default function SignupPage() {
  return <AuthExperience mode="signup" />;
}
