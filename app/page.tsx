import ContentHeading from "@/components/Content";
import { Navbar } from "@/components/Navbar";

export default function Home() {
  return (
    <div className="container mx-auto px-4">
      <Navbar />
      
      <main className="mx-auto py-8">
        <ContentHeading />
      </main>
    </div>
  );
}
