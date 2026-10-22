import { Metadata } from "next";
import { CreatorForm } from "@/components/game/CreatorForm";

export const metadata: Metadata = {
  title: "Create Your LieLoop 👀 | LieLoop",
  description: "Answer 12 honest questions about your habits and see if your best friends can predict you.",
};

export default function CreatePage() {
  return (
    <div className="w-full flex-1 flex flex-col items-center justify-center">
      <CreatorForm />
    </div>
  );
}
