import Link from 'next/link';
import { BioGeneratorForm } from './_components/bio-generator-form';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function GenerateBioPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted p-4 sm:p-6 md:p-8">
       <div className="w-full max-w-2xl mb-4">
        <Button asChild variant="ghost">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </Button>
      </div>
      <BioGeneratorForm />
    </div>
  );
}
